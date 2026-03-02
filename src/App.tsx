import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  Send, 
  Users, 
  LogOut, 
  Plus, 
  Trash2, 
  Pencil,
  Search,
  ArrowUpDown,
  FileText,
  ChevronRight,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck,
  Building,
  ClipboardList,
  Filter,
  Download,
  Printer,
  Briefcase,
  FileCheck,
  FileBadge,
  ThumbsUp,
  Gavel,
  StickyNote,
  Award,
  Scroll,
  GraduationCap,
  Database,
  Settings,
  ChevronDown,
  ChevronUp,
  History,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, SuratMasuk, SuratKeluar, Stats, Bidang, Disposisi, DokumenInternal, Activity } from './types';

// --- Components ---

const SidebarSection = ({ label }: { label: string }) => (
  <div className="px-4 pt-4 pb-2">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick, badge, onPlusClick, indent }: any) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100'
      } ${indent ? 'ml-4 w-[calc(100%-1rem)]' : ''}`}
    >
      <Icon size={18} />
      <span className="font-medium flex-1 text-left text-sm">{label}</span>
      {badge !== undefined && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-200 text-slate-600'}`}>
          {badge}
        </span>
      )}
    </button>
    {onPlusClick && (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onPlusClick();
        }}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
          active ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
        }`}
        title={`Tambah ${label}`}
      >
        <Plus size={14} />
      </button>
    )}
  </div>
);

const Card = ({ children, title, subtitle, action }: any) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    {(title || action) && (
      <div className="px-6 py-4 border-bottom border-slate-100 flex items-center justify-between">
        <div>
          {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color, small, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all duration-200 ${small ? 'p-3' : 'p-6'} ${onClick ? 'cursor-pointer hover:border-indigo-300 hover:shadow-md hover:-translate-y-1' : ''}`}
  >
    <div className={`rounded-xl flex-shrink-0 flex items-center justify-center ${color} ${small ? 'w-10 h-10' : 'w-12 h-12'}`}>
      <Icon size={small ? 18 : 24} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className={`font-medium text-slate-500 truncate ${small ? 'text-xs' : 'text-sm'}`}>{label}</p>
      <p className={`font-bold text-slate-800 ${small ? 'text-lg' : 'text-2xl'}`}>{value}</p>
    </div>
  </div>
);

const AlurDisposisiModal = ({ isOpen, onClose, data, title }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="font-bold text-slate-800">Alur Disposisi</h3>
              <p className="text-xs text-slate-500">{title}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8">
              {data.map((item: any, idx: number) => (
                <div key={item.id} className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Langkah {idx + 1}</span>
                      <span className="text-[10px] font-medium text-slate-400">{item.tanggal_disposisi}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">Tujuan: {item.tujuan_disposisi}</p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Instruksi:</p>
                      <p className="text-sm text-slate-700 italic">"{item.instruksi}"</p>
                      {item.catatan && (
                        <>
                          <p className="text-xs font-semibold text-slate-500 uppercase mt-2 mb-1">Catatan:</p>
                          <p className="text-xs text-slate-600">{item.catatan}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {data.length === 0 && (
                <div className="text-center py-8 text-slate-400 italic">Belum ada alur disposisi.</div>
              )}
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all">
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Pages ---

const Dashboard = ({ stats, activities, onTabChange }: { stats: Stats | null, activities: Activity[], onTabChange: (tab: string) => void }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ringkasan Utama</h2>
          <p className="text-slate-500 text-sm">Metrik utama operasional surat menyurat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Surat Masuk" 
            value={stats?.masuk || 0} 
            icon={Mail} 
            color="bg-emerald-500" 
            onClick={() => onTabChange('masuk')}
          />
          <StatCard 
            label="Surat Keluar" 
            value={stats?.keluar || 0} 
            icon={Send} 
            color="bg-indigo-500" 
            onClick={() => onTabChange('keluar')}
          />
          <StatCard 
            label="Belum Disposisi" 
            value={stats?.pending_disposisi || 0} 
            icon={ClipboardList} 
            color="bg-amber-500" 
            onClick={() => onTabChange('disposisi')}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Arsip Dokumen Lainnya</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Surat Tugas" value={stats?.tugas || 0} icon={Briefcase} color="bg-blue-500" small onClick={() => onTabChange('tugas')} />
            <StatCard label="SK" value={stats?.sk || 0} icon={Gavel} color="bg-purple-500" small onClick={() => onTabChange('sk')} />
            <StatCard label="Nota Dinas" value={stats?.nota || 0} icon={StickyNote} color="bg-rose-500" small onClick={() => onTabChange('nota')} />
            <StatCard label="Piagam" value={stats?.piagam || 0} icon={Award} color="bg-orange-500" small onClick={() => onTabChange('piagam')} />
            <StatCard label="Sertifikat" value={stats?.sertifikat || 0} icon={Scroll} color="bg-yellow-600" small onClick={() => onTabChange('sertifikat')} />
            <StatCard label="Ijazah" value={stats?.ijazah || 0} icon={GraduationCap} color="bg-red-500" small onClick={() => onTabChange('ijazah')} />
            <StatCard label="SK Khusus" value={stats?.sk_khusus || 0} icon={FileBadge} color="bg-pink-500" small onClick={() => onTabChange('sk_khusus')} />
            <StatCard label="Pengguna" value={stats?.users || 0} icon={Users} color="bg-slate-500" small onClick={() => onTabChange('sistem')} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="Aktivitas Terbaru" subtitle="Log perubahan data terakhir">
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'masuk' ? 'bg-emerald-100 text-emerald-600' :
                  activity.type === 'keluar' ? 'bg-indigo-100 text-indigo-600' :
                  activity.type === 'disposisi' ? 'bg-amber-100 text-amber-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {activity.type === 'masuk' ? <Mail size={18} /> :
                   activity.type === 'keluar' ? <Send size={18} /> :
                   activity.type === 'disposisi' ? <ClipboardList size={18} /> :
                   <FileText size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{activity.title}</p>
                  <p className="text-xs text-slate-500 truncate">{activity.subtitle}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(activity.timestamp).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-center text-slate-400 text-sm italic py-4">Belum ada aktivitas.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const SuratMasukPage = ({ data, onDelete, onAdd, onApprove, bidang, showModal, setShowModal, user }: any) => {
  const [formData, setFormData] = useState({
    nomor_surat: '', asal_surat: '', tanggal_surat: '', tanggal_terima: '', perihal: '', kategori: 'Umum', keterangan: '', bidang_id: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [viewItem, setViewItem] = useState<SuratMasuk | null>(null);

  const [filters, setFilters] = useState({
    tanggal: '',
    bidang_id: '',
    kategori: ''
  });

  const [sort, setSort] = useState({
    key: 'tanggal_surat',
    direction: 'desc'
  });

  const filteredData = data.filter((item: SuratMasuk) => {
    const matchTanggal = !filters.tanggal || item.tanggal_surat === filters.tanggal;
    const matchBidang = !filters.bidang_id || item.bidang_id?.toString() === filters.bidang_id;
    const matchKategori = !filters.kategori || item.kategori.toLowerCase().includes(filters.kategori.toLowerCase());
    return matchTanggal && matchBidang && matchKategori;
  });

  const sortedData = [...filteredData].sort((a: any, b: any) => {
    const aValue = a[sort.key] || '';
    const bValue = b[sort.key] || '';
    
    if (sort.direction === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, value as string);
    });
    if (file) {
      dataToSend.append('file', file);
    }
    onAdd(dataToSend);
    setShowModal(false);
    setFormData({ nomor_surat: '', asal_surat: '', tanggal_surat: '', tanggal_terima: '', perihal: '', kategori: 'Umum', keterangan: '', bidang_id: '' });
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Surat Masuk</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Tambah Surat
        </button>
      </div>

      <Card>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter size={10} /> Filter Tanggal
            </label>
            <input 
              type="date" 
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={filters.tanggal}
              onChange={e => setFilters({...filters, tanggal: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building size={10} /> Tujuan Bidang
            </label>
            <select 
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={filters.bidang_id}
              onChange={e => setFilters({...filters, bidang_id: e.target.value})}
            >
              <option value="">Semua Tujuan Bidang</option>
              {bidang.map((b: Bidang) => (
                <option key={b.id} value={b.id}>{b.nama_bidang}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Search size={10} /> Filter Kategori
            </label>
            <input 
              type="text" 
              placeholder="Cari kategori..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={filters.kategori}
              onChange={e => setFilters({...filters, kategori: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown size={10} /> Urutkan Berdasarkan
            </label>
            <div className="flex gap-2">
              <select 
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={sort.key}
                onChange={e => setSort({...sort, key: e.target.value})}
              >
                <option value="tanggal_surat">Tanggal</option>
                <option value="perihal">Subjek/Perihal</option>
                <option value="asal_surat">Pengirim</option>
              </select>
              <button 
                onClick={() => setSort({...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc'})}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {sort.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-semibold text-slate-600 text-sm">No. Surat</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Asal</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Tujuan Bidang</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Perihal & Ringkasan</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedData.map((item: SuratMasuk) => (
                <tr key={item.id} className="hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => setViewItem(item)}>
                  <td className="py-4 text-sm font-medium text-slate-800">
                    <div>
                      {item.nomor_surat}
                      <p className="text-[10px] text-slate-400">{item.tanggal_surat}</p>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{item.asal_surat}</td>
                  <td className="py-4 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">
                      {item.nama_bidang || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-slate-600">
                    <div className="max-w-[250px]">
                      <p className="font-semibold text-slate-800 truncate">{item.perihal}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.keterangan || 'Tidak ada ringkasan'}</p>
                    </div>
                  </td>
                  <td className="py-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                        item.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status === 'approved' ? (
                          <>
                            <CheckCircle size={12} />
                            Approved
                          </>
                        ) : (
                          <>
                            <Clock size={12} />
                            Menunggu Persetujuan
                          </>
                        )}
                      </span>
                      {item.status === 'approved' && (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold w-fit ${
                          item.status_disposisi === 'Sudah' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.status_disposisi === 'Sudah' ? 'Terdisposisi' : 'Belum Disposisi'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {item.file_path && (
                        <a 
                          href={item.file_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-800 p-2 bg-emerald-50 rounded-lg"
                          title="Download File"
                        >
                          <Download size={18} />
                        </a>
                      )}
                      {user?.role === 'admin' && item.status === 'pending' && (
                        <button 
                          onClick={() => onApprove(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-medium transition-colors shadow-sm"
                          title="Setujui Data"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}
                      {item.status === 'approved' && (
                        <button 
                          onClick={() => {
                            if (window.confirm(`Buat disposisi untuk surat ${item.nomor_surat}?`)) {
                              const event = new CustomEvent('create-disposisi', { detail: { id: item.id, type: 'masuk' } });
                              window.dispatchEvent(event);
                            }
                          }}
                          className="text-indigo-600 hover:text-indigo-800 p-2 bg-indigo-50 rounded-lg"
                          title="Buat Disposisi"
                        >
                          <ClipboardList size={18} />
                        </button>
                      )}
                      {item.status_disposisi === 'Sudah' && (
                        <button 
                          onClick={() => {
                            const event = new CustomEvent('view-alur', { detail: { id: item.id, type: 'masuk', nomor: item.nomor_surat } });
                            window.dispatchEvent(event);
                          }}
                          className="text-amber-600 hover:text-amber-800 p-2 bg-amber-50 rounded-lg"
                          title="Lihat Alur Disposisi"
                        >
                          <ArrowUpDown size={18} />
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button onClick={() => onDelete(item.id)} className="text-rose-500 hover:text-rose-700 p-2">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">Belum ada data surat masuk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Tambah Surat Masuk</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">No. Surat</label>
                    <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.nomor_surat} onChange={e => setFormData({...formData, nomor_surat: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Asal Surat</label>
                    <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.asal_surat} onChange={e => setFormData({...formData, asal_surat: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Tgl Surat</label>
                    <input type="date" required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.tanggal_surat} onChange={e => setFormData({...formData, tanggal_surat: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Tgl Terima</label>
                    <input type="date" required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.tanggal_terima} onChange={e => setFormData({...formData, tanggal_terima: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Tujuan Bidang</label>
                    <select 
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.bidang_id}
                      onChange={e => setFormData({...formData, bidang_id: e.target.value})}
                    >
                      <option value="">Pilih Tujuan Bidang</option>
                      {bidang.map((b: Bidang) => (
                        <option key={b.id} value={b.id}>{b.nama_bidang}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Kategori</label>
                    <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Perihal</label>
                  <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.perihal} onChange={e => setFormData({...formData, perihal: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Keterangan</label>
                  <textarea className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" rows={3}
                    value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Upload File (Optional)</label>
                  <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                    onChange={e => setFile(e.target.files?.[0] || null)} />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                  Simpan Data
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-lg">Detail Surat Masuk</h3>
                <button onClick={() => setViewItem(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-full shadow-sm">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Surat</h4>
                      <p className="text-slate-800 font-medium">{viewItem.nomor_surat}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Asal Surat</h4>
                      <p className="text-slate-800 font-medium">{viewItem.asal_surat}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tujuan Bidang</h4>
                      <p className="text-slate-800 font-medium">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">
                          {viewItem.nama_bidang || 'N/A'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kategori</h4>
                      <p className="text-slate-800 font-medium">{viewItem.kategori}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Surat</h4>
                      <p className="text-slate-800 font-medium">{viewItem.tanggal_surat}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Terima</h4>
                      <p className="text-slate-800 font-medium">{viewItem.tanggal_terima}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Persetujuan</h4>
                      <p className="text-slate-800 font-medium">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                          viewItem.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {viewItem.status === 'approved' ? (
                            <><CheckCircle size={12} /> Approved</>
                          ) : (
                            <><Clock size={12} /> Menunggu Persetujuan</>
                          )}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Disposisi</h4>
                      <p className="text-slate-800 font-medium">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold w-fit ${
                          viewItem.status_disposisi === 'Sudah' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {viewItem.status_disposisi === 'Sudah' ? 'Terdisposisi' : 'Belum Disposisi'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Perihal</h4>
                    <p className="text-slate-800 font-medium">{viewItem.perihal}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Keterangan / Ringkasan</h4>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                      {viewItem.keterangan || 'Tidak ada keterangan tambahan.'}
                    </p>
                  </div>
                </div>

                {viewItem.file_path && (
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lampiran File</h4>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 px-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px] md:max-w-[300px]">
                            {viewItem.file_path.split('/').pop() || 'Dokumen Surat'}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">PDF Document</p>
                        </div>
                      </div>
                      <a 
                        href={viewItem.file_path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      >
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setViewItem(null)}
                  className="px-6 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors shadow-sm"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SuratKeluarPage = ({ data, onDelete, onAdd, onApprove, bidang, showModal, setShowModal, user }: any) => {
  const [viewItem, setViewItem] = useState<SuratKeluar | null>(null);
  const [formData, setFormData] = useState({
    nomor_surat: '', tujuan_surat: '', tanggal_surat: '', perihal: '', kategori: 'Umum', keterangan: '', bidang_id: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const [filters, setFilters] = useState({
    tanggal: '',
    bidang_id: '',
    kategori: ''
  });

  const [sort, setSort] = useState({
    key: 'tanggal_surat',
    direction: 'desc'
  });

  const filteredData = data.filter((item: SuratKeluar) => {
    const matchTanggal = !filters.tanggal || item.tanggal_surat === filters.tanggal;
    const matchBidang = !filters.bidang_id || item.bidang_id?.toString() === filters.bidang_id;
    const matchKategori = !filters.kategori || item.kategori.toLowerCase().includes(filters.kategori.toLowerCase());
    return matchTanggal && matchBidang && matchKategori;
  });

  const sortedData = [...filteredData].sort((a: any, b: any) => {
    const aValue = a[sort.key] || '';
    const bValue = b[sort.key] || '';
    
    if (sort.direction === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, value as string);
    });
    if (file) {
      dataToSend.append('file', file);
    }
    onAdd(dataToSend);
    setShowModal(false);
    setFormData({ nomor_surat: '', tujuan_surat: '', tanggal_surat: '', perihal: '', kategori: 'Umum', keterangan: '', bidang_id: '' });
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Surat Keluar</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Tambah Surat
        </button>
      </div>

      <Card>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter size={10} /> Filter Tanggal
            </label>
            <input 
              type="date" 
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={filters.tanggal}
              onChange={e => setFilters({...filters, tanggal: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building size={10} /> Filter Bidang
            </label>
            <select 
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={filters.bidang_id}
              onChange={e => setFilters({...filters, bidang_id: e.target.value})}
            >
              <option value="">Semua Bidang</option>
              {bidang.map((b: Bidang) => (
                <option key={b.id} value={b.id}>{b.nama_bidang}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Search size={10} /> Filter Kategori
            </label>
            <input 
              type="text" 
              placeholder="Cari kategori..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={filters.kategori}
              onChange={e => setFilters({...filters, kategori: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown size={10} /> Urutkan Berdasarkan
            </label>
            <div className="flex gap-2">
              <select 
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={sort.key}
                onChange={e => setSort({...sort, key: e.target.value})}
              >
                <option value="tanggal_surat">Tanggal</option>
                <option value="perihal">Subjek/Perihal</option>
                <option value="tujuan_surat">Tujuan</option>
              </select>
              <button 
                onClick={() => setSort({...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc'})}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {sort.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-semibold text-slate-600 text-sm">No. Surat</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Tujuan</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Bidang</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Perihal & Ringkasan</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedData.map((item: SuratKeluar) => (
                <tr key={item.id} className="hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => setViewItem(item)}>
                  <td className="py-4 text-sm font-medium text-slate-800">
                    <div>
                      {item.nomor_surat}
                      <p className="text-[10px] text-slate-400">{item.tanggal_surat}</p>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{item.tujuan_surat}</td>
                  <td className="py-4 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">
                      {item.nama_bidang || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-slate-600">
                    <div className="max-w-[250px]">
                      <p className="font-semibold text-slate-800 truncate">{item.perihal}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.keterangan || 'Tidak ada ringkasan'}</p>
                    </div>
                  </td>
                  <td className="py-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                        item.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status === 'approved' ? (
                          <>
                            <CheckCircle size={12} />
                            Approved
                          </>
                        ) : (
                          <>
                            <Clock size={12} />
                            Menunggu Persetujuan
                          </>
                        )}
                      </span>
                      {item.status === 'approved' && (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold w-fit ${
                          item.status_disposisi === 'Sudah' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.status_disposisi === 'Sudah' ? 'Terdisposisi' : 'Belum Disposisi'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {item.file_path && (
                        <a 
                          href={item.file_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-800 p-2 bg-emerald-50 rounded-lg"
                          title="Download File"
                        >
                          <Download size={18} />
                        </a>
                      )}
                      {user?.role === 'admin' && item.status === 'pending' && (
                        <button 
                          onClick={() => onApprove(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-medium transition-colors shadow-sm"
                          title="Setujui Data"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}
                      {item.status === 'approved' && (
                        <button 
                          onClick={() => {
                            if (window.confirm(`Buat disposisi untuk surat ${item.nomor_surat}?`)) {
                              const event = new CustomEvent('create-disposisi', { detail: { id: item.id, type: 'keluar' } });
                              window.dispatchEvent(event);
                            }
                          }}
                          className="text-indigo-600 hover:text-indigo-800 p-2 bg-indigo-50 rounded-lg"
                          title="Buat Disposisi"
                        >
                          <ClipboardList size={18} />
                        </button>
                      )}
                      {item.status_disposisi === 'Sudah' && (
                        <button 
                          onClick={() => {
                            const event = new CustomEvent('view-alur', { detail: { id: item.id, type: 'keluar', nomor: item.nomor_surat } });
                            window.dispatchEvent(event);
                          }}
                          className="text-amber-600 hover:text-amber-800 p-2 bg-amber-50 rounded-lg"
                          title="Lihat Alur Disposisi"
                        >
                          <ArrowUpDown size={18} />
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button onClick={() => onDelete(item.id)} className="text-rose-500 hover:text-rose-700 p-2">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">Belum ada data surat keluar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Tambah Surat Keluar</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">No. Surat</label>
                    <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.nomor_surat} onChange={e => setFormData({...formData, nomor_surat: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Tujuan Surat</label>
                    <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.tujuan_surat} onChange={e => setFormData({...formData, tujuan_surat: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Bidang</label>
                    <select 
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.bidang_id}
                      onChange={e => setFormData({...formData, bidang_id: e.target.value})}
                    >
                      <option value="">Pilih Bidang</option>
                      {bidang.map((b: Bidang) => (
                        <option key={b.id} value={b.id}>{b.nama_bidang}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Tgl Surat</label>
                    <input type="date" required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.tanggal_surat} onChange={e => setFormData({...formData, tanggal_surat: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Perihal</label>
                  <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.perihal} onChange={e => setFormData({...formData, perihal: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Keterangan</label>
                  <textarea className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" rows={3}
                    value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Upload File (Optional)</label>
                  <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                    onChange={e => setFile(e.target.files?.[0] || null)} />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                  Simpan Data
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-lg">Detail Surat Keluar</h3>
                <button onClick={() => setViewItem(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-full shadow-sm">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Surat</h4>
                      <p className="text-slate-800 font-medium">{viewItem.nomor_surat}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tujuan Surat</h4>
                      <p className="text-slate-800 font-medium">{viewItem.tujuan_surat}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tujuan Bidang</h4>
                      <p className="text-slate-800 font-medium">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">
                          {viewItem.nama_bidang || 'N/A'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kategori</h4>
                      <p className="text-slate-800 font-medium">{viewItem.kategori}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Surat</h4>
                      <p className="text-slate-800 font-medium">{viewItem.tanggal_surat}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Persetujuan</h4>
                      <p className="text-slate-800 font-medium">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                          viewItem.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {viewItem.status === 'approved' ? (
                            <><CheckCircle size={12} /> Approved</>
                          ) : (
                            <><Clock size={12} /> Menunggu Persetujuan</>
                          )}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Disposisi</h4>
                      <p className="text-slate-800 font-medium">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold w-fit ${
                          viewItem.status_disposisi === 'Sudah' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {viewItem.status_disposisi === 'Sudah' ? 'Terdisposisi' : 'Belum Disposisi'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Perihal</h4>
                    <p className="text-slate-800 font-medium">{viewItem.perihal}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Keterangan / Ringkasan</h4>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                      {viewItem.keterangan || 'Tidak ada keterangan tambahan.'}
                    </p>
                  </div>
                </div>

                {viewItem.file_path && (
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lampiran File</h4>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 px-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px] md:max-w-[300px]">
                            {viewItem.file_path.split('/').pop() || 'Dokumen Surat'}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">PDF Document</p>
                        </div>
                      </div>
                      <a 
                        href={viewItem.file_path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      >
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setViewItem(null)}
                  className="px-6 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors shadow-sm"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UsersPage = ({ data, onDelete, onAdd }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', name: '', role: 'user' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setShowModal(false);
    setFormData({ username: '', password: '', name: '', role: 'user' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Tambah User
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-semibold text-slate-600 text-sm">Nama Lengkap</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Username</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Role</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item: User) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-4 text-sm font-medium text-slate-800">{item.name}</td>
                  <td className="py-4 text-sm text-slate-600">{item.username}</td>
                  <td className="py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${item.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="py-4">
                    {item.username !== 'admin' && (
                      <button onClick={() => onDelete(item.id)} className="text-rose-500 hover:text-rose-700 p-2">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Tambah Pengguna Baru</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Nama Lengkap</label>
                  <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Username</label>
                  <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
                  <input type="password" required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Role</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                  Daftarkan User
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BidangPage = ({ data, onDelete, onAdd, onUpdate }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nama_bidang: '', kode_huruf: '', keterangan: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ nama_bidang: '', kode_huruf: '', keterangan: '' });
  };

  const handleEdit = (item: Bidang) => {
    setEditingId(item.id);
    setFormData({
      nama_bidang: item.nama_bidang,
      kode_huruf: item.kode_huruf,
      keterangan: item.keterangan
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ nama_bidang: '', kode_huruf: '', keterangan: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Bidang</h2>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ nama_bidang: '', kode_huruf: '', keterangan: '' });
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Tambah Bidang
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-semibold text-slate-600 text-sm">Nama Bidang</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Kode Huruf</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Keterangan</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item: Bidang) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-4 text-sm font-medium text-slate-800">{item.nama_bidang}</td>
                  <td className="py-4 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded font-mono text-xs">
                      {item.kode_huruf || '-'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{item.keterangan}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(item)} className="text-indigo-500 hover:text-indigo-700 p-2">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => onDelete(item.id)} className="text-rose-500 hover:text-rose-700 p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 italic">Belum ada data bidang.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">{editingId ? 'Edit Bidang' : 'Tambah Bidang Baru'}</h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Nama Bidang</label>
                  <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.nama_bidang} onChange={e => setFormData({...formData, nama_bidang: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Kode Huruf</label>
                  <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="Contoh: A, B, C"
                    value={formData.kode_huruf} onChange={e => setFormData({...formData, kode_huruf: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Keterangan</label>
                  <textarea className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" rows={3}
                    value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                  {editingId ? 'Update Bidang' : 'Simpan Bidang'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DisposisiPage = ({ data = [], onDelete, onAdd, suratMasuk = [], suratKeluar = [], notaDinas = [], initialSurat, onResetInitialId, user }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    surat_masuk_id: '', surat_keluar_id: '', dokumen_internal_id: '', tujuan_disposisi: '', instruksi: '', catatan: '', tanggal_disposisi: new Date().toISOString().split('T')[0]
  });

  const getSelectValue = () => {
    if (formData.surat_masuk_id) return `masuk-${formData.surat_masuk_id}`;
    if (formData.surat_keluar_id) return `keluar-${formData.surat_keluar_id}`;
    if (formData.dokumen_internal_id) return `internal-${formData.dokumen_internal_id}`;
    return '';
  };

  useEffect(() => {
    if (initialSurat) {
      if (initialSurat.type === 'masuk') {
        setFormData(prev => ({ ...prev, surat_masuk_id: initialSurat.id.toString(), surat_keluar_id: '', dokumen_internal_id: '' }));
      } else if (initialSurat.type === 'keluar') {
        setFormData(prev => ({ ...prev, surat_keluar_id: initialSurat.id.toString(), surat_masuk_id: '', dokumen_internal_id: '' }));
      } else if (initialSurat.type === 'nota') {
        setFormData(prev => ({ ...prev, dokumen_internal_id: initialSurat.id.toString(), surat_masuk_id: '', surat_keluar_id: '' }));
      }
      setShowModal(true);
      onResetInitialId();
    }
  }, [initialSurat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setShowModal(false);
    setFormData({ surat_masuk_id: '', surat_keluar_id: '', dokumen_internal_id: '', tujuan_disposisi: '', instruksi: '', catatan: '', tanggal_disposisi: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Disposisi Surat</h2>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            <Plus size={20} />
            Tambah Disposisi
          </button>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-semibold text-slate-600 text-sm">Surat</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Tujuan Disposisi</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Instruksi</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Tgl Disposisi</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item: Disposisi) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800">
                        {item.nomor_surat_masuk || item.nomor_surat_keluar || item.nomor_internal}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.perihal_masuk || item.perihal_keluar || item.perihal_internal}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-indigo-500">
                        {item.surat_masuk_id ? 'Masuk' : item.surat_keluar_id ? 'Keluar' : 'Nota Dinas'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{item.tujuan_disposisi}</td>
                  <td className="py-4 text-sm text-slate-600">{item.instruksi}</td>
                  <td className="py-4 text-sm text-slate-600">{item.tanggal_disposisi}</td>
                  <td className="py-4">
                    {user?.role === 'admin' && (
                      <button onClick={() => onDelete(item.id)} className="text-rose-500 hover:text-rose-700 p-2">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">Belum ada data disposisi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Tambah Disposisi</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Pilih Surat</label>
                  <select 
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-800"
                    value={getSelectValue()}
                    onChange={e => {
                      const val = e.target.value;
                      if (!val) {
                        setFormData({...formData, surat_masuk_id: '', surat_keluar_id: '', dokumen_internal_id: ''});
                        return;
                      }
                      const [type, id] = val.split('-');
                      if (type === 'masuk') {
                        setFormData({...formData, surat_masuk_id: id, surat_keluar_id: '', dokumen_internal_id: ''});
                      } else if (type === 'keluar') {
                        setFormData({...formData, surat_keluar_id: id, surat_masuk_id: '', dokumen_internal_id: ''});
                      } else if (type === 'internal') {
                        setFormData({...formData, dokumen_internal_id: id, surat_masuk_id: '', surat_keluar_id: ''});
                      }
                    }}
                  >
                    <option value="">-- Pilih Surat --</option>
                    
                    {suratMasuk.length > 0 && (
                      <optgroup label="Surat Masuk">
                        {suratMasuk.map((s: any) => (
                          <option key={`masuk-${s.id}`} value={`masuk-${s.id}`}>[Masuk] {s.nomor_surat} - {s.perihal}</option>
                        ))}
                      </optgroup>
                    )}
                    
                    {suratKeluar.length > 0 && (
                      <optgroup label="Surat Keluar">
                        {suratKeluar.map((s: any) => (
                          <option key={`keluar-${s.id}`} value={`keluar-${s.id}`}>[Keluar] {s.nomor_surat} - {s.perihal}</option>
                        ))}
                      </optgroup>
                    )}
                    
                    {notaDinas.length > 0 && (
                      <optgroup label="Nota Dinas">
                        {notaDinas.map((s: any) => (
                          <option key={`internal-${s.id}`} value={`internal-${s.id}`}>[Nota] {s.nomor_surat} - {s.perihal}</option>
                        ))}
                      </optgroup>
                    )}

                    {suratMasuk.length === 0 && suratKeluar.length === 0 && notaDinas.length === 0 && (
                      <option disabled>Belum ada data surat tersedia</option>
                    )}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Tujuan Disposisi</label>
                  <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="Contoh: Kabid A, Sekertaris"
                    value={formData.tujuan_disposisi} onChange={e => setFormData({...formData, tujuan_disposisi: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Tanggal Disposisi</label>
                  <input type="date" required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.tanggal_disposisi} onChange={e => setFormData({...formData, tanggal_disposisi: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Instruksi</label>
                  <textarea required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" rows={2}
                    placeholder="Instruksi disposisi..."
                    value={formData.instruksi} onChange={e => setFormData({...formData, instruksi: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Catatan</label>
                  <textarea className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" rows={2}
                    placeholder="Catatan tambahan..."
                    value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                  Simpan Disposisi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LaporanPage = ({ suratMasuk, suratKeluar, disposisi, dokumenInternal }: any) => {
  const [reportType, setReportType] = useState('masuk');
  const [filterMode, setFilterMode] = useState('range'); // 'range' or 'month'
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    { id: 1, name: 'Januari' }, { id: 2, name: 'Februari' }, { id: 3, name: 'Maret' },
    { id: 4, name: 'April' }, { id: 5, name: 'Mei' }, { id: 6, name: 'Juni' },
    { id: 7, name: 'Juli' }, { id: 8, name: 'Agustus' }, { id: 9, name: 'September' },
    { id: 10, name: 'Oktober' }, { id: 11, name: 'November' }, { id: 12, name: 'Desember' }
  ];

  const filteredData = () => {
    let data = [];
    if (reportType === 'masuk') data = suratMasuk.map((s: any) => ({ ...s, docType: 'Surat Masuk' }));
    else if (reportType === 'keluar') data = suratKeluar.map((s: any) => ({ ...s, docType: 'Surat Keluar' }));
    else if (reportType === 'disposisi') data = disposisi.map((s: any) => ({ ...s, docType: 'Disposisi' }));
    else if (reportType === 'gabungan') {
      data = [
        ...suratMasuk.map((s: any) => ({ ...s, docType: 'Surat Masuk', type: 'Masuk' })),
        ...suratKeluar.map((s: any) => ({ ...s, docType: 'Surat Keluar', type: 'Keluar' }))
      ];
    } else if (reportType === 'semua') {
      data = [
        ...suratMasuk.map((s: any) => ({ ...s, docType: 'Surat Masuk' })),
        ...suratKeluar.map((s: any) => ({ ...s, docType: 'Surat Keluar' })),
        ...disposisi.map((s: any) => ({ ...s, docType: 'Disposisi' })),
        ...dokumenInternal.tugas.map((s: any) => ({ ...s, docType: 'Surat Tugas' })),
        ...dokumenInternal.keterangan.map((s: any) => ({ ...s, docType: 'Surat Keterangan' })),
        ...dokumenInternal.rekomendasi.map((s: any) => ({ ...s, docType: 'Surat Rekomendasi' })),
        ...dokumenInternal.sk.map((s: any) => ({ ...s, docType: 'SK' })),
        ...dokumenInternal.nota.map((s: any) => ({ ...s, docType: 'Nota Dinas' })),
        ...dokumenInternal.piagam.map((s: any) => ({ ...s, docType: 'Piagam' })),
        ...dokumenInternal.sertifikat.map((s: any) => ({ ...s, docType: 'Sertifikat' })),
        ...dokumenInternal.ijazah.map((s: any) => ({ ...s, docType: 'Ijazah' })),
        ...dokumenInternal.sk_khusus.map((s: any) => ({ ...s, docType: 'SK Khusus' })),
      ];
    }

    return data.filter((item: any) => {
      const dateStr = item.tanggal_surat || item.tanggal_disposisi || item.tanggal;
      if (!dateStr) return true;
      
      const date = new Date(dateStr);
      
      if (filterMode === 'range') {
        const startMatch = !dateRange.start || dateStr >= dateRange.start;
        const endMatch = !dateRange.end || dateStr <= dateRange.end;
        return startMatch && endMatch;
      } else {
        const monthMatch = (date.getMonth() + 1) === selectedMonth;
        const yearMatch = date.getFullYear() === selectedYear;
        return monthMatch && yearMatch;
      }
    }).sort((a: any, b: any) => {
      const dateA = a.tanggal_surat || a.tanggal_disposisi || a.tanggal || '';
      const dateB = b.tanggal_surat || b.tanggal_disposisi || b.tanggal || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold text-slate-800">Cetak Laporan</h2>
        <button 
          onClick={handlePrint}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
        >
          <Printer size={20} />
          Cetak Laporan
        </button>
      </div>

      <Card className="print:hidden">
        <div className="space-y-4">
          <div className="flex gap-4 border-b border-slate-100 pb-2">
            <button 
              onClick={() => setFilterMode('range')}
              className={`text-sm font-bold pb-2 px-2 transition-all ${filterMode === 'range' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
            >
              Rentang Tanggal
            </button>
            <button 
              onClick={() => setFilterMode('month')}
              className={`text-sm font-bold pb-2 px-2 transition-all ${filterMode === 'month' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
            >
              Per Bulan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Jenis Laporan</label>
              <select 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={reportType}
                onChange={e => setReportType(e.target.value)}
              >
                <option value="masuk">Surat Masuk</option>
                <option value="keluar">Surat Keluar</option>
                <option value="gabungan">Gabungan (Masuk & Keluar)</option>
                <option value="disposisi">Disposisi</option>
                <option value="semua">Semua Dokumen</option>
              </select>
            </div>

            {filterMode === 'range' ? (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Dari Tanggal</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={dateRange.start}
                    onChange={e => setDateRange({...dateRange, start: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Sampai Tanggal</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={dateRange.end}
                    onChange={e => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Pilih Bulan</label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {months.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Pilih Tahun</label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={selectedYear}
                    onChange={e => setSelectedYear(parseInt(e.target.value))}
                  >
                    {[2023, 2024, 2025, 2026].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 print:shadow-none print:border-none print:p-0">
        <div className="hidden print:block text-center mb-8 border-b-2 border-slate-800 pb-4">
          <h1 className="text-2xl font-bold uppercase">
            Laporan Rekapitulasi {
              reportType === 'masuk' ? 'Surat Masuk' : 
              reportType === 'keluar' ? 'Surat Keluar' : 
              reportType === 'gabungan' ? 'Surat Masuk & Keluar' : 
              reportType === 'semua' ? 'Semua Dokumen' : 'Disposisi'
            }
          </h1>
          <p className="text-slate-600">
            Periode: {
              filterMode === 'range' 
                ? `${dateRange.start || 'Awal'} s/d ${dateRange.end || 'Akhir'}`
                : `${months.find(m => m.id === selectedMonth)?.name} ${selectedYear}`
            }
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 print:border-slate-800">
                <th className="py-3 px-2 font-bold text-slate-800 text-sm">No</th>
                <th className="py-3 px-2 font-bold text-slate-800 text-sm">No. Surat</th>
                <th className="py-3 px-2 font-bold text-slate-800 text-sm">
                  {reportType === 'masuk' ? 'Asal' : reportType === 'keluar' ? 'Tujuan' : reportType === 'gabungan' ? 'Asal/Tujuan' : reportType === 'semua' ? 'Asal/Tujuan' : 'Tujuan Disposisi'}
                </th>
                {(reportType === 'gabungan' || reportType === 'semua') && <th className="py-3 px-2 font-bold text-slate-800 text-sm">Jenis</th>}
                <th className="py-3 px-2 font-bold text-slate-800 text-sm">Tanggal</th>
                <th className="py-3 px-2 font-bold text-slate-800 text-sm">Perihal / Instruksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 print:divide-slate-800">
              {filteredData().map((item: any, idx: number) => (
                <tr key={item.id}>
                  <td className="py-3 px-2 text-sm text-slate-700">{idx + 1}</td>
                  <td className="py-3 px-2 text-sm text-slate-700 font-medium">
                    {item.nomor_surat || item.nomor_surat_masuk || item.nomor_surat_keluar || item.nomor_internal || '-'}
                  </td>
                  <td className="py-3 px-2 text-sm text-slate-700">
                    {item.asal_surat || item.tujuan_surat || item.tujuan_disposisi || '-'}
                  </td>
                  {(reportType === 'gabungan' || reportType === 'semua') && (
                    <td className="py-3 px-2 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        (item.type === 'Masuk' || item.docType === 'Surat Masuk') ? 'bg-emerald-100 text-emerald-700' : 
                        (item.type === 'Keluar' || item.docType === 'Surat Keluar') ? 'bg-blue-100 text-blue-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.type || item.docType}
                      </span>
                    </td>
                  )}
                  <td className="py-3 px-2 text-sm text-slate-700">
                    {item.tanggal_surat || item.tanggal_disposisi || item.tanggal}
                  </td>
                  <td className="py-3 px-2 text-sm text-slate-700">
                    {item.perihal || item.instruksi}
                  </td>
                </tr>
              ))}
              {filteredData().length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">Tidak ada data untuk periode ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="hidden print:flex justify-end mt-12">
          <div className="text-center w-64">
            <p>Bandung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="mt-1">Petugas Arsip,</p>
            <div className="h-24"></div>
            <p className="font-bold underline">( ____________________ )</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DokumenInternalPage = ({ type, label, data, onDelete, onAdd, onApprove, bidang, showModal, setShowModal, user }: any) => {
  const [viewItem, setViewItem] = useState<DokumenInternal | null>(null);
  const [formData, setFormData] = useState({
    nomor_surat: '', tanggal: '', perihal: '', keterangan: '', bidang_id: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = new FormData();
    dataToSend.append('type', type);
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, value as string);
    });
    if (file) {
      dataToSend.append('file', file);
    }
    onAdd(dataToSend);
    setShowModal(false);
    setFormData({ nomor_surat: '', tanggal: '', perihal: '', keterangan: '', bidang_id: '' });
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{label}</h2>
          <p className="text-slate-500 text-sm">Manajemen arsip {label.toLowerCase()}</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Tambah {label}
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-semibold text-slate-600 text-sm">No. Dokumen</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Bidang</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Tanggal</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Perihal</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="pb-4 font-semibold text-slate-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => setViewItem(item)}>
                  <td className="py-4 text-sm font-medium text-slate-800">{item.nomor_surat}</td>
                  <td className="py-4 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">
                      {item.nama_bidang || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{item.tanggal}</td>
                  <td className="py-4 text-sm text-slate-600">{item.perihal}</td>
                  <td className="py-4 text-sm">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'approved' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status === 'approved' ? (
                        <>
                          <CheckCircle size={12} />
                          Approved
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          Menunggu Persetujuan
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {item.file_path && (
                        <a 
                          href={item.file_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-800 p-2 bg-emerald-50 rounded-lg"
                        >
                          <Download size={18} />
                        </a>
                      )}
                      {user?.role === 'admin' && item.status === 'pending' && (
                        <button 
                          onClick={() => onApprove(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-medium transition-colors shadow-sm"
                          title="Setujui Data"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button onClick={() => onDelete(item.id)} className="text-rose-500 hover:text-rose-700 p-2">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">Belum ada data {label.toLowerCase()}.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Tambah {label}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Nomor Dokumen</label>
                    <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.nomor_surat} onChange={e => setFormData({...formData, nomor_surat: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Tanggal</label>
                    <input type="date" required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Bidang</label>
                  <select required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.bidang_id} onChange={e => setFormData({...formData, bidang_id: e.target.value})}>
                    <option value="">-- Pilih Bidang --</option>
                    {bidang.map((b: Bidang) => (
                      <option key={b.id} value={b.id}>{b.nama_bidang}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Perihal</label>
                  <input required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.perihal} onChange={e => setFormData({...formData, perihal: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Keterangan</label>
                  <textarea className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" rows={3}
                    value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">File Dokumen</label>
                  <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={e => setFile(e.target.files?.[0] || null)} />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                  Simpan Dokumen
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-lg">Detail {label}</h3>
                <button onClick={() => setViewItem(null)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-full shadow-sm">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Surat</h4>
                      <p className="text-slate-800 font-medium">{viewItem.nomor_surat}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bidang</h4>
                      <p className="text-slate-800 font-medium">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">
                          {viewItem.nama_bidang || 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal</h4>
                      <p className="text-slate-800 font-medium">{viewItem.tanggal}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Persetujuan</h4>
                      <p className="text-slate-800 font-medium">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                          viewItem.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {viewItem.status === 'approved' ? (
                            <><CheckCircle size={12} /> Approved</>
                          ) : (
                            <><Clock size={12} /> Menunggu Persetujuan</>
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Perihal</h4>
                    <p className="text-slate-800 font-medium">{viewItem.perihal}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Keterangan / Ringkasan</h4>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                      {viewItem.keterangan || 'Tidak ada keterangan tambahan.'}
                    </p>
                  </div>
                </div>

                {viewItem.file_path && (
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lampiran File</h4>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 px-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px] md:max-w-[300px]">
                            {viewItem.file_path.split('/').pop() || 'Dokumen Surat'}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">PDF Document</p>
                        </div>
                      </div>
                      <a 
                        href={viewItem.file_path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      >
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setViewItem(null)}
                  className="px-6 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors shadow-sm"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SistemPage = ({ users, onDeleteUser, onAddUser, bidang, onDeleteBidang, onAddBidang, onUpdateBidang }: any) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pengaturan Aplikasi</h2>
          <p className="text-slate-500 text-sm">Manajemen pengguna, bidang, dan sistem</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <UsersPage data={users} onDelete={onDeleteUser} onAdd={onAddUser} />
        <BidangPage data={bidang} onDelete={onDeleteBidang} onAdd={onAddBidang} onUpdate={onUpdateBidang} />
        
        <Card title="Backup & Restore" subtitle="Cadangkan data sistem Anda secara berkala">
          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex-1 bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-100 transition-all">
              <Database size={24} />
              Download Backup (.db)
            </button>
            <button className="flex-1 bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all border border-slate-200 border-dashed">
              <FileText size={24} />
              Restore dari File
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-4 italic">* Fitur restore memerlukan akses administrator tingkat lanjut.</p>
        </Card>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [suratMasuk, setSuratMasuk] = useState<SuratMasuk[]>([]);
  const [suratKeluar, setSuratKeluar] = useState<SuratKeluar[]>([]);
  const [disposisi, setDisposisi] = useState<Disposisi[]>([]);
  const [dokumenInternal, setDokumenInternal] = useState<Record<string, DokumenInternal[]>>({
    tugas: [], keterangan: [], rekomendasi: [], sk: [], nota: [], piagam: [], sertifikat: [], ijazah: [], sk_khusus: []
  });
  const [users, setUsers] = useState<User[]>([]);
  const [bidang, setBidang] = useState<Bidang[]>([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // Modals state
  const [showMasukModal, setShowMasukModal] = useState(false);
  const [showKeluarModal, setShowKeluarModal] = useState(false);
  const [showInternalModal, setShowInternalModal] = useState(false);
  const [preSelectedSurat, setPreSelectedSurat] = useState<{id: number, type: 'masuk' | 'keluar'} | null>(null);
  const [viewAlur, setViewAlur] = useState<{isOpen: boolean, data: any[], title: string}>({
    isOpen: false,
    data: [],
    title: ''
  });

  useEffect(() => {
    const handleCreateDisposisi = (e: any) => {
      setPreSelectedSurat(e.detail);
      setActiveTab('disposisi');
    };
    const handleViewAlur = (e: any) => {
      const { id, type, nomor } = e.detail;
      const filteredAlur = disposisi.filter(d => 
        type === 'masuk' ? d.surat_masuk_id === id : d.surat_keluar_id === id
      ).sort((a, b) => new Date(a.tanggal_disposisi).getTime() - new Date(b.tanggal_disposisi).getTime());
      
      setViewAlur({
        isOpen: true,
        data: filteredAlur,
        title: `Surat ${type === 'masuk' ? 'Masuk' : 'Keluar'} - ${nomor}`
      });
    };
    window.addEventListener('create-disposisi', handleCreateDisposisi);
    window.addEventListener('view-alur', handleViewAlur);
    return () => {
      window.removeEventListener('create-disposisi', handleCreateDisposisi);
      window.removeEventListener('view-alur', handleViewAlur);
    };
  }, [disposisi]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchActivities();
      fetchSuratMasuk();
      fetchSuratKeluar();
      fetchBidang();
      fetchDisposisi();
      if (user.role === 'admin') fetchUsers();
      ['tugas', 'keterangan', 'rekomendasi', 'sk', 'nota', 'piagam', 'sertifikat', 'ijazah', 'sk_khusus'].forEach(type => {
        fetchDokumenInternal(type);
      });
    }
  }, [user]);

  const fetchDokumenInternal = async (type: string) => {
    const res = await fetch(`/api/dokumen-internal/${type}`);
    const data = await res.json();
    setDokumenInternal(prev => ({ ...prev, [type]: data }));
  };

  const fetchStats = async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();
    setStats(data);
  };

  const fetchActivities = async () => {
    const res = await fetch('/api/activities');
    const data = await res.json();
    setActivities(data);
  };

  const fetchSuratMasuk = async () => {
    const res = await fetch('/api/surat-masuk');
    const data = await res.json();
    setSuratMasuk(data);
  };

  const fetchSuratKeluar = async () => {
    const res = await fetch('/api/surat-keluar');
    const data = await res.json();
    setSuratKeluar(data);
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const fetchBidang = async () => {
    const res = await fetch('/api/bidang');
    const data = await res.json();
    setBidang(data);
  };

  const fetchDisposisi = async () => {
    const res = await fetch('/api/disposisi');
    const data = await res.json();
    setDisposisi(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
    } else {
      setError(data.message);
    }
  };

  const handleAddSuratMasuk = async (formData: any) => {
    const isFormData = formData instanceof FormData;
    await fetch('/api/surat-masuk', {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? formData : JSON.stringify(formData)
    });
    fetchSuratMasuk();
    fetchStats();
  };

  const handleDeleteSuratMasuk = async (id: number) => {
    if (confirm('Hapus data ini?')) {
      await fetch(`/api/surat-masuk/${id}`, { method: 'DELETE' });
      fetchSuratMasuk();
      fetchStats();
    }
  };

  const handleApproveSuratMasuk = async (id: number) => {
    if (confirm('Setujui data ini?')) {
      await fetch(`/api/surat-masuk/${id}/approve`, { method: 'PUT' });
      fetchSuratMasuk();
      fetchStats();
    }
  };

  const handleAddSuratKeluar = async (formData: any) => {
    const isFormData = formData instanceof FormData;
    await fetch('/api/surat-keluar', {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? formData : JSON.stringify(formData)
    });
    fetchSuratKeluar();
    fetchStats();
  };

  const handleDeleteSuratKeluar = async (id: number) => {
    if (confirm('Hapus data ini?')) {
      await fetch(`/api/surat-keluar/${id}`, { method: 'DELETE' });
      fetchSuratKeluar();
      fetchStats();
    }
  };

  const handleApproveSuratKeluar = async (id: number) => {
    if (confirm('Setujui data ini?')) {
      await fetch(`/api/surat-keluar/${id}/approve`, { method: 'PUT' });
      fetchSuratKeluar();
      fetchStats();
    }
  };

  const handleAddUser = async (formData: any) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) {
      fetchUsers();
      fetchStats();
    } else {
      alert(data.message);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Hapus user ini?')) {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
      fetchStats();
    }
  };

  const handleAddBidang = async (formData: any) => {
    const res = await fetch('/api/bidang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) {
      fetchBidang();
    } else {
      alert(data.message);
    }
  };

  const handleDeleteBidang = async (id: number) => {
    if (confirm('Hapus bidang ini?')) {
      await fetch(`/api/bidang/${id}`, { method: 'DELETE' });
      fetchBidang();
    }
  };

  const handleAddDisposisi = async (formData: any) => {
    await fetch('/api/disposisi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    fetchDisposisi();
  };

  const handleAddDokumenInternal = async (formData: FormData) => {
    const res = await fetch('/api/dokumen-internal', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      const type = formData.get('type') as string;
      fetchDokumenInternal(type);
      fetchStats();
    }
  };

  const handleDeleteDokumenInternal = async (id: number, type: string) => {
    if (confirm('Hapus dokumen ini?')) {
      await fetch(`/api/dokumen-internal/${id}`, { method: 'DELETE' });
      fetchDokumenInternal(type);
      fetchStats();
    }
  };

  const handleApproveDokumenInternal = async (id: number, type: string) => {
    if (confirm('Setujui dokumen ini?')) {
      await fetch(`/api/dokumen-internal/${id}/approve`, { method: 'PUT' });
      fetchDokumenInternal(type);
      fetchStats();
    }
  };

  const handleDeleteDisposisi = async (id: number) => {
    if (confirm('Hapus disposisi ini?')) {
      await fetch(`/api/disposisi/${id}`, { method: 'DELETE' });
      fetchDisposisi();
    }
  };

  const handleUpdateBidang = async (id: number, formData: any) => {
    const res = await fetch(`/api/bidang/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) {
      fetchBidang();
    } else {
      alert(data.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-3xl opacity-50" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md z-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-3xl shadow-2xl shadow-indigo-100 mb-6 overflow-hidden border border-slate-100 p-2">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.postimg.cc/sXd6mfVD/LOGO-KWARCAB-NEW.png';
                }}
              />
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight whitespace-nowrap">E-Manajemen Surat</h1>
            <p className="text-slate-500 mt-3 font-medium">Sistem Manajemen Arsip Digital</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Masukkan username"
                    value={loginForm.username}
                    onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="password" 
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Masukkan password"
                    value={loginForm.password}
                    onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  />
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-500 text-sm font-medium text-center"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:translate-y-0"
              >
                Masuk ke Sistem
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
              <p className="text-xs text-slate-400">Default Login: admin / admin123</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden p-1 flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.postimg.cc/sXd6mfVD/LOGO-KWARCAB-NEW.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
                E-Manajemen <span className="text-indigo-600">Surat</span>
              </span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
          />

          <SidebarSection label="E-Manajemen Surat Utama" />
          <SidebarItem 
            icon={Mail} 
            label="Surat Masuk" 
            active={activeTab === 'masuk'} 
            onClick={() => { setActiveTab('masuk'); setIsSidebarOpen(false); }} 
            badge={stats?.masuk}
            indent
          />
          <SidebarItem 
            icon={Send} 
            label="Surat Keluar" 
            active={activeTab === 'keluar'} 
            onClick={() => { setActiveTab('keluar'); setIsSidebarOpen(false); }} 
            badge={stats?.keluar}
            indent
          />
          <SidebarItem 
            icon={ClipboardList} 
            label="Disposisi" 
            active={activeTab === 'disposisi'} 
            onClick={() => { setActiveTab('disposisi'); setIsSidebarOpen(false); }} 
            badge={stats?.pending_disposisi}
            indent
          />

          <SidebarSection label="Administrasi Internal" />
          <SidebarItem 
            icon={Briefcase} 
            label="Surat Tugas" 
            active={activeTab === 'tugas'} 
            onClick={() => { setActiveTab('tugas'); setIsSidebarOpen(false); }} 
            indent
          />
          <SidebarItem 
            icon={FileCheck} 
            label="Surat Keterangan" 
            active={activeTab === 'keterangan'} 
            onClick={() => { setActiveTab('keterangan'); setIsSidebarOpen(false); }} 
            indent
          />
          <SidebarItem 
            icon={ThumbsUp} 
            label="Surat Rekomendasi" 
            active={activeTab === 'rekomendasi'} 
            onClick={() => { setActiveTab('rekomendasi'); setIsSidebarOpen(false); }} 
            indent
          />
          <SidebarItem 
            icon={Gavel} 
            label="Surat Keputusan (SK)" 
            active={activeTab === 'sk'} 
            onClick={() => { setActiveTab('sk'); setIsSidebarOpen(false); }} 
            indent
          />
          <SidebarItem 
            icon={StickyNote} 
            label="Nota Dinas" 
            active={activeTab === 'nota'} 
            onClick={() => { setActiveTab('nota'); setIsSidebarOpen(false); }} 
            indent
          />

          <SidebarSection label="Penghargaan" />
          <SidebarItem 
            icon={Award} 
            label="Piagam" 
            active={activeTab === 'piagam'} 
            onClick={() => { setActiveTab('piagam'); setIsSidebarOpen(false); }} 
            indent
          />
          <SidebarItem 
            icon={Scroll} 
            label="Sertifikat" 
            active={activeTab === 'sertifikat'} 
            onClick={() => { setActiveTab('sertifikat'); setIsSidebarOpen(false); }} 
            indent
          />
          <SidebarItem 
            icon={GraduationCap} 
            label="Ijazah" 
            active={activeTab === 'ijazah'} 
            onClick={() => { setActiveTab('ijazah'); setIsSidebarOpen(false); }} 
            indent
          />
          <SidebarItem 
            icon={FileBadge} 
            label="SK Khusus" 
            active={activeTab === 'sk_khusus'} 
            onClick={() => { setActiveTab('sk_khusus'); setIsSidebarOpen(false); }} 
            indent
          />

          <SidebarSection label="Pelaporan" />
          <SidebarItem 
            icon={Printer} 
            label="Rekapitulasi Laporan" 
            active={activeTab === 'laporan'} 
            onClick={() => { setActiveTab('laporan'); setIsSidebarOpen(false); }} 
            indent
          />

          <SidebarSection label="Sistem" />
          <SidebarItem 
            icon={Settings} 
            label="Pengaturan Aplikasi" 
            active={activeTab === 'sistem'} 
            onClick={() => { setActiveTab('sistem'); setIsSidebarOpen(false); }} 
            indent
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setUser(null)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari surat..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-xs text-slate-500">Sistem Arsip v1.0</p>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard stats={stats} activities={activities} onTabChange={setActiveTab} />}
              {activeTab === 'masuk' && <SuratMasukPage data={suratMasuk} onDelete={handleDeleteSuratMasuk} onAdd={handleAddSuratMasuk} onApprove={handleApproveSuratMasuk} bidang={bidang} showModal={showMasukModal} setShowModal={setShowMasukModal} user={user} />}
              {activeTab === 'keluar' && <SuratKeluarPage data={suratKeluar} onDelete={handleDeleteSuratKeluar} onAdd={handleAddSuratKeluar} onApprove={handleApproveSuratKeluar} bidang={bidang} showModal={showKeluarModal} setShowModal={setShowKeluarModal} user={user} />}
              
              {/* Administrasi Internal */}
              {activeTab === 'tugas' && <DokumenInternalPage type="tugas" label="Surat Tugas" data={dokumenInternal.tugas} onDelete={(id: number) => handleDeleteDokumenInternal(id, 'tugas')} onAdd={handleAddDokumenInternal} onApprove={(id: number) => handleApproveDokumenInternal(id, 'tugas')} bidang={bidang} showModal={showInternalModal} setShowModal={setShowInternalModal} user={user} />}
              {activeTab === 'keterangan' && <DokumenInternalPage type="keterangan" label="Surat Keterangan" data={dokumenInternal.keterangan} onDelete={(id: number) => handleDeleteDokumenInternal(id, 'keterangan')} onAdd={handleAddDokumenInternal} onApprove={(id: number) => handleApproveDokumenInternal(id, 'keterangan')} bidang={bidang} showModal={showInternalModal} setShowModal={setShowInternalModal} user={user} />}
              {activeTab === 'rekomendasi' && <DokumenInternalPage type="rekomendasi" label="Surat Rekomendasi" data={dokumenInternal.rekomendasi} onDelete={(id: number) => handleDeleteDokumenInternal(id, 'rekomendasi')} onAdd={handleAddDokumenInternal} onApprove={(id: number) => handleApproveDokumenInternal(id, 'rekomendasi')} bidang={bidang} showModal={showInternalModal} setShowModal={setShowInternalModal} user={user} />}
              {activeTab === 'sk' && <DokumenInternalPage type="sk" label="Surat Keputusan (SK)" data={dokumenInternal.sk} onDelete={(id: number) => handleDeleteDokumenInternal(id, 'sk')} onAdd={handleAddDokumenInternal} onApprove={(id: number) => handleApproveDokumenInternal(id, 'sk')} bidang={bidang} showModal={showInternalModal} setShowModal={setShowInternalModal} user={user} />}
              {activeTab === 'nota' && <DokumenInternalPage type="nota" label="Nota Dinas" data={dokumenInternal.nota} onDelete={(id: number) => handleDeleteDokumenInternal(id, 'nota')} onAdd={handleAddDokumenInternal} onApprove={(id: number) => handleApproveDokumenInternal(id, 'nota')} bidang={bidang} showModal={showInternalModal} setShowModal={setShowInternalModal} user={user} />}
              
              {/* Penghargaan */}
              {activeTab === 'piagam' && <DokumenInternalPage type="piagam" label="Piagam" data={dokumenInternal.piagam} onDelete={(id: number) => handleDeleteDokumenInternal(id, 'piagam')} onAdd={handleAddDokumenInternal} onApprove={(id: number) => handleApproveDokumenInternal(id, 'piagam')} bidang={bidang} showModal={showInternalModal} setShowModal={setShowInternalModal} user={user} />}
              {activeTab === 'sertifikat' && <DokumenInternalPage type="sertifikat" label="Sertifikat" data={dokumenInternal.sertifikat} onDelete={(id: number) => handleDeleteDokumenInternal(id, 'sertifikat')} onAdd={handleAddDokumenInternal} onApprove={(id: number) => handleApproveDokumenInternal(id, 'sertifikat')} bidang={bidang} showModal={showInternalModal} setShowModal={setShowInternalModal} user={user} />}
              {activeTab === 'ijazah' && <DokumenInternalPage type="ijazah" label="Ijazah" data={dokumenInternal.ijazah} onDelete={(id: number) => handleDeleteDokumenInternal(id, 'ijazah')} onAdd={handleAddDokumenInternal} onApprove={(id: number) => handleApproveDokumenInternal(id, 'ijazah')} bidang={bidang} showModal={showInternalModal} setShowModal={setShowInternalModal} user={user} />}
              {activeTab === 'sk_khusus' && <DokumenInternalPage type="sk_khusus" label="Surat Keterangan Khusus" data={dokumenInternal.sk_khusus} onDelete={(id: number) => handleDeleteDokumenInternal(id, 'sk_khusus')} onAdd={handleAddDokumenInternal} onApprove={(id: number) => handleApproveDokumenInternal(id, 'sk_khusus')} bidang={bidang} showModal={showInternalModal} setShowModal={setShowInternalModal} user={user} />}

              {activeTab === 'disposisi' && <DisposisiPage data={disposisi} onDelete={handleDeleteDisposisi} onAdd={handleAddDisposisi} suratMasuk={suratMasuk.filter(s => s.status === 'approved')} suratKeluar={suratKeluar.filter(s => s.status === 'approved')} notaDinas={dokumenInternal.nota.filter(s => s.status === 'approved')} initialSurat={preSelectedSurat} onResetInitialId={() => setPreSelectedSurat(null)} user={user} />}
              {activeTab === 'laporan' && <LaporanPage suratMasuk={suratMasuk} suratKeluar={suratKeluar} disposisi={disposisi} dokumenInternal={dokumenInternal} />}
              
              <AlurDisposisiModal 
                isOpen={viewAlur.isOpen} 
                onClose={() => setViewAlur({...viewAlur, isOpen: false})} 
                data={viewAlur.data} 
                title={viewAlur.title} 
              />
              
              {activeTab === 'sistem' && (
                <SistemPage 
                  users={users} onDeleteUser={handleDeleteUser} onAddUser={handleAddUser}
                  bidang={bidang} onDeleteBidang={handleDeleteBidang} onAddBidang={handleAddBidang} onUpdateBidang={handleUpdateBidang}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-4 px-8 border-t border-slate-200 bg-white text-center">
          <p className="text-sm text-slate-500 font-medium">
            Copyright &copy; 2026 Sekretariat Kwartir Cabang Gerakan Pramuka Kota Bandung
          </p>
        </footer>
      </main>
    </div>
  );
}
