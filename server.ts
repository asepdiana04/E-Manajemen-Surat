import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

const db = new Database("arsip_surat.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('admin', 'user')),
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS bidang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_bidang TEXT UNIQUE,
    kode_huruf TEXT,
    keterangan TEXT
  );

  CREATE TABLE IF NOT EXISTS surat_masuk (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomor_surat TEXT,
    asal_surat TEXT,
    tanggal_surat DATE,
    tanggal_terima DATE,
    perihal TEXT,
    kategori TEXT,
    keterangan TEXT,
    bidang_id INTEGER,
    file_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bidang_id) REFERENCES bidang(id)
  );

  CREATE TABLE IF NOT EXISTS surat_keluar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomor_surat TEXT,
    tujuan_surat TEXT,
    tanggal_surat DATE,
    perihal TEXT,
    kategori TEXT,
    keterangan TEXT,
    bidang_id INTEGER,
    file_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bidang_id) REFERENCES bidang(id)
  );

  CREATE TABLE IF NOT EXISTS disposisi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    surat_masuk_id INTEGER NULL,
    surat_keluar_id INTEGER NULL,
    dokumen_internal_id INTEGER NULL,
    tujuan_disposisi TEXT,
    instruksi TEXT,
    catatan TEXT,
    tanggal_disposisi DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (surat_masuk_id) REFERENCES surat_masuk(id),
    FOREIGN KEY (surat_keluar_id) REFERENCES surat_keluar(id),
    FOREIGN KEY (dokumen_internal_id) REFERENCES dokumen_internal(id)
  );

  CREATE TABLE IF NOT EXISTS dokumen_internal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT, -- 'tugas', 'keterangan', 'rekomendasi', 'sk', 'nota', 'piagam', 'sertifikat'
    nomor_surat TEXT,
    tanggal DATE,
    perihal TEXT,
    keterangan TEXT,
    bidang_id INTEGER,
    file_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bidang_id) REFERENCES bidang(id)
  );
`);

// Migration for existing databases
try {
  db.exec("ALTER TABLE bidang ADD COLUMN kode_huruf TEXT");
} catch (e) {}

try {
  db.exec("ALTER TABLE disposisi ADD COLUMN dokumen_internal_id INTEGER");
} catch (e) {}

try {
  db.exec("ALTER TABLE surat_masuk ADD COLUMN status TEXT DEFAULT 'pending'");
} catch (e) {}

try {
  db.exec("ALTER TABLE surat_keluar ADD COLUMN status TEXT DEFAULT 'pending'");
} catch (e) {}

try {
  db.exec("ALTER TABLE dokumen_internal ADD COLUMN status TEXT DEFAULT 'pending'");
} catch (e) {}

// Seed Admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)").run(
    "admin",
    "admin123",
    "admin",
    "Administrator"
  );
  db.prepare("INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)").run(
    "user",
    "user123",
    "user",
    "Regular User"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Auth API
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT id, username, role, name FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Username atau password salah" });
    }
  });

  // Dashboard Stats
  app.get("/api/stats", (req, res) => {
    const masuk = db.prepare("SELECT COUNT(*) as count FROM surat_masuk").get().count;
    const keluar = db.prepare("SELECT COUNT(*) as count FROM surat_keluar").get().count;
    const users = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
    
    const internalCounts = db.prepare("SELECT type, COUNT(*) as count FROM dokumen_internal GROUP BY type").all();
    
    const pendingMasuk = db.prepare(`
      SELECT COUNT(*) as count FROM surat_masuk sm 
      WHERE sm.status = 'approved' AND NOT EXISTS (SELECT 1 FROM disposisi d WHERE d.surat_masuk_id = sm.id)
    `).get().count;
    
    const pendingKeluar = db.prepare(`
      SELECT COUNT(*) as count FROM surat_keluar sk 
      WHERE sk.status = 'approved' AND NOT EXISTS (SELECT 1 FROM disposisi d WHERE d.surat_keluar_id = sk.id)
    `).get().count;

    const pendingNota = db.prepare(`
      SELECT COUNT(*) as count FROM dokumen_internal di 
      WHERE di.type = 'nota' AND di.status = 'approved' AND NOT EXISTS (SELECT 1 FROM disposisi d WHERE d.dokumen_internal_id = di.id)
    `).get().count;

    const stats: any = { masuk, keluar, users, pending_disposisi: pendingMasuk + pendingKeluar + pendingNota };
    
    ['tugas', 'keterangan', 'rekomendasi', 'sk', 'nota', 'piagam', 'sertifikat', 'ijazah', 'sk_khusus'].forEach(type => {
      const found = internalCounts.find((c: any) => c.type === type);
      stats[type] = found ? found.count : 0;
    });
    
    res.json(stats);
  });

  // Surat Masuk API
  app.get("/api/surat-masuk", (req, res) => {
    const data = db.prepare(`
      SELECT sm.*, b.nama_bidang,
             CASE WHEN EXISTS (SELECT 1 FROM disposisi d WHERE d.surat_masuk_id = sm.id) 
                  THEN 'Sudah' ELSE 'Belum' END as status_disposisi
      FROM surat_masuk sm 
      LEFT JOIN bidang b ON sm.bidang_id = b.id 
      ORDER BY sm.created_at DESC
    `).all();
    res.json(data);
  });

  app.post("/api/surat-masuk", upload.single('file'), (req, res) => {
    const { nomor_surat, asal_surat, tanggal_surat, tanggal_terima, perihal, kategori, keterangan, bidang_id } = req.body;
    const file_path = req.file ? `/uploads/${req.file.filename}` : null;
    const result = db.prepare(`
      INSERT INTO surat_masuk (nomor_surat, asal_surat, tanggal_surat, tanggal_terima, perihal, kategori, keterangan, bidang_id, file_path, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(nomor_surat, asal_surat, tanggal_surat, tanggal_terima, perihal, kategori, keterangan, bidang_id, file_path);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.put("/api/surat-masuk/:id/approve", (req, res) => {
    db.prepare("UPDATE surat_masuk SET status = 'approved' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/surat-masuk/:id", (req, res) => {
    db.prepare("DELETE FROM surat_masuk WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Surat Keluar API
  app.get("/api/surat-keluar", (req, res) => {
    const data = db.prepare(`
      SELECT sk.*, b.nama_bidang,
             CASE WHEN EXISTS (SELECT 1 FROM disposisi d WHERE d.surat_keluar_id = sk.id) 
                  THEN 'Sudah' ELSE 'Belum' END as status_disposisi
      FROM surat_keluar sk 
      LEFT JOIN bidang b ON sk.bidang_id = b.id 
      ORDER BY sk.created_at DESC
    `).all();
    res.json(data);
  });

  app.post("/api/surat-keluar", upload.single('file'), (req, res) => {
    const { nomor_surat, tujuan_surat, tanggal_surat, perihal, kategori, keterangan, bidang_id } = req.body;
    const file_path = req.file ? `/uploads/${req.file.filename}` : null;
    const result = db.prepare(`
      INSERT INTO surat_keluar (nomor_surat, tujuan_surat, tanggal_surat, perihal, kategori, keterangan, bidang_id, file_path, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(nomor_surat, tujuan_surat, tanggal_surat, perihal, kategori, keterangan, bidang_id, file_path);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.put("/api/surat-keluar/:id/approve", (req, res) => {
    db.prepare("UPDATE surat_keluar SET status = 'approved' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/surat-keluar/:id", (req, res) => {
    db.prepare("DELETE FROM surat_keluar WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // User Management API
  app.get("/api/users", (req, res) => {
    const data = db.prepare("SELECT id, username, role, name FROM users").all();
    res.json(data);
  });

  // Bidang API
  app.get("/api/bidang", (req, res) => {
    const data = db.prepare("SELECT * FROM bidang ORDER BY nama_bidang ASC").all();
    res.json(data);
  });

  app.post("/api/bidang", (req, res) => {
    const { nama_bidang, kode_huruf, keterangan } = req.body;
    try {
      const result = db.prepare("INSERT INTO bidang (nama_bidang, kode_huruf, keterangan) VALUES (?, ?, ?)").run(nama_bidang, kode_huruf, keterangan);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ success: false, message: "Nama bidang sudah ada" });
    }
  });

  app.delete("/api/bidang/:id", (req, res) => {
    db.prepare("DELETE FROM bidang WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.put("/api/bidang/:id", (req, res) => {
    const { nama_bidang, kode_huruf, keterangan } = req.body;
    try {
      db.prepare("UPDATE bidang SET nama_bidang = ?, kode_huruf = ?, keterangan = ? WHERE id = ?")
        .run(nama_bidang, kode_huruf, keterangan, req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ success: false, message: "Gagal memperbarui bidang" });
    }
  });

  app.post("/api/users", (req, res) => {
    const { username, password, role, name } = req.body;
    try {
      const result = db.prepare("INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)").run(username, password, role, name);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ success: false, message: "Username sudah digunakan" });
    }
  });

  app.delete("/api/users/:id", (req, res) => {
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Disposisi API
  app.get("/api/disposisi", (req, res) => {
    const data = db.prepare(`
      SELECT d.*, 
             sm.nomor_surat as nomor_surat_masuk, sm.perihal as perihal_masuk,
             sk.nomor_surat as nomor_surat_keluar, sk.perihal as perihal_keluar,
             di.nomor_surat as nomor_internal, di.perihal as perihal_internal, di.type as type_internal
      FROM disposisi d 
      LEFT JOIN surat_masuk sm ON d.surat_masuk_id = sm.id 
      LEFT JOIN surat_keluar sk ON d.surat_keluar_id = sk.id
      LEFT JOIN dokumen_internal di ON d.dokumen_internal_id = di.id
      ORDER BY d.created_at DESC
    `).all();
    res.json(data);
  });

  app.post("/api/disposisi", (req, res) => {
    const { surat_masuk_id, surat_keluar_id, dokumen_internal_id, tujuan_disposisi, instruksi, catatan, tanggal_disposisi } = req.body;
    const result = db.prepare(`
      INSERT INTO disposisi (surat_masuk_id, surat_keluar_id, dokumen_internal_id, tujuan_disposisi, instruksi, catatan, tanggal_disposisi)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(surat_masuk_id || null, surat_keluar_id || null, dokumen_internal_id || null, tujuan_disposisi, instruksi, catatan, tanggal_disposisi);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.delete("/api/disposisi/:id", (req, res) => {
    db.prepare("DELETE FROM disposisi WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Dokumen Internal API
  app.get("/api/dokumen-internal/:type", (req, res) => {
    const data = db.prepare(`
      SELECT di.*, b.nama_bidang 
      FROM dokumen_internal di 
      LEFT JOIN bidang b ON di.bidang_id = b.id 
      WHERE di.type = ?
      ORDER BY di.created_at DESC
    `).all(req.params.type);
    res.json(data);
  });

  app.post("/api/dokumen-internal", upload.single('file'), (req, res) => {
    const { type, nomor_surat, tanggal, perihal, keterangan, bidang_id } = req.body;
    const file_path = req.file ? `/uploads/${req.file.filename}` : null;
    const result = db.prepare(`
      INSERT INTO dokumen_internal (type, nomor_surat, tanggal, perihal, keterangan, bidang_id, file_path, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(type, nomor_surat, tanggal, perihal, keterangan, bidang_id, file_path);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.put("/api/dokumen-internal/:id/approve", (req, res) => {
    db.prepare("UPDATE dokumen_internal SET status = 'approved' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/dokumen-internal/:id", (req, res) => {
    db.prepare("DELETE FROM dokumen_internal WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.get("/api/activities", (req, res) => {
    const activities: any[] = [];
    
    const sm = db.prepare("SELECT id, nomor_surat as title, perihal as subtitle, created_at as timestamp FROM surat_masuk ORDER BY created_at DESC LIMIT 5").all();
    sm.forEach((item: any) => activities.push({ ...item, id: `sm-${item.id}`, type: 'masuk' }));
    
    const sk = db.prepare("SELECT id, nomor_surat as title, perihal as subtitle, created_at as timestamp FROM surat_keluar ORDER BY created_at DESC LIMIT 5").all();
    sk.forEach((item: any) => activities.push({ ...item, id: `sk-${item.id}`, type: 'keluar' }));
    
    const disp = db.prepare("SELECT id, tujuan_disposisi as title, instruksi as subtitle, created_at as timestamp FROM disposisi ORDER BY created_at DESC LIMIT 5").all();
    disp.forEach((item: any) => activities.push({ ...item, id: `disp-${item.id}`, type: 'disposisi' }));
    
    const internal = db.prepare("SELECT id, nomor_surat as title, perihal as subtitle, created_at as timestamp FROM dokumen_internal ORDER BY created_at DESC LIMIT 5").all();
    internal.forEach((item: any) => activities.push({ ...item, id: `int-${item.id}`, type: 'internal' }));
    
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(activities.slice(0, 10));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
