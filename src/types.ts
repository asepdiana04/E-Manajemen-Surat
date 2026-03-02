export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  name: string;
}

export interface Bidang {
  id: number;
  nama_bidang: string;
  kode_huruf: string;
  keterangan: string;
}

export interface SuratMasuk {
  id: number;
  nomor_surat: string;
  asal_surat: string;
  tanggal_surat: string;
  tanggal_terima: string;
  perihal: string;
  kategori: string;
  keterangan: string;
  bidang_id?: number;
  nama_bidang?: string;
  file_path?: string;
  status_disposisi?: 'Sudah' | 'Belum';
  status?: 'pending' | 'approved';
  created_at: string;
}

export interface SuratKeluar {
  id: number;
  nomor_surat: string;
  tujuan_surat: string;
  tanggal_surat: string;
  perihal: string;
  kategori: string;
  keterangan: string;
  bidang_id?: number;
  nama_bidang?: string;
  file_path?: string;
  status_disposisi?: 'Sudah' | 'Belum';
  status?: 'pending' | 'approved';
  created_at: string;
}

export interface Stats {
  masuk: number;
  keluar: number;
  users: number;
  tugas: number;
  keterangan: number;
  rekomendasi: number;
  sk: number;
  nota: number;
  piagam: number;
  sertifikat: number;
  ijazah: number;
  sk_khusus: number;
  pending_disposisi: number;
}

export interface Activity {
  id: string;
  type: 'masuk' | 'keluar' | 'disposisi' | 'internal';
  title: string;
  subtitle: string;
  timestamp: string;
}

export interface Disposisi {
  id: number;
  surat_masuk_id?: number;
  surat_keluar_id?: number;
  dokumen_internal_id?: number;
  nomor_surat_masuk?: string;
  perihal_masuk?: string;
  nomor_surat_keluar?: string;
  perihal_keluar?: string;
  nomor_internal?: string;
  perihal_internal?: string;
  tujuan_disposisi: string;
  instruksi: string;
  catatan: string;
  tanggal_disposisi: string;
  created_at: string;
}

export interface DokumenInternal {
  id: number;
  type: string;
  nomor_surat: string;
  tanggal: string;
  perihal: string;
  keterangan: string;
  bidang_id?: number;
  nama_bidang?: string;
  file_path?: string;
  status?: 'pending' | 'approved';
  created_at: string;
}
