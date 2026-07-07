import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  LogOut,
  Users,
  Calendar,
  Clock,
  Image,
  Video,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Save,
  UploadCloud,
  Check,
  Megaphone,
  ChevronRight,
  Eye,
  EyeOff,
  Menu,
  X
} from "lucide-react";
import { Student, PiketDay, TimelineEvent, GalleryItem, VideoItem, ClassData, Announcement } from "../types";

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshData: () => void;
}

export default function AdminDashboard({ onClose, onRefreshData }: AdminDashboardProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Class data edit states
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [activeTab, setActiveTab] = useState("siswa"); // 'siswa', 'piket', 'timeline', 'galeri', 'video', 'pengumuman', 'teks'
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Modal / form states for editing items
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<Partial<TimelineEvent> | null>(null);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [editingVideo, setEditingVideo] = useState<Partial<VideoItem> | null>(null);
  const [editingAnn, setEditingAnn] = useState<Partial<Announcement> | null>(null);

  // File uploading states
  const [uploading, setUploading] = useState<string | null>(null); // name of field being uploaded

  // Load existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("sevend_admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchClassData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem("sevend_admin_token", data.token);
          setToken(data.token);
          setIsAuthenticated(true);
          fetchClassData();
        } else {
          setError(data.error || "Password salah!");
        }
      } else {
        const text = await res.text();
        setError(`Respon server tidak valid (${res.status}): ${text.substring(0, 40)}...`);
      }
    } catch (err) {
      setError("Gagal tersambung ke server. Silakan muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sevend_admin_token");
    setToken("");
    setIsAuthenticated(false);
    setClassData(null);
  };

  const fetchClassData = async () => {
    try {
      const res = await fetch("/api/class-data");
      const data = await res.json();
      setClassData(data);
    } catch (err) {
      console.error("Gagal mengambil data kelas:", err);
    }
  };

  const handleSaveChanges = async (updatedData: ClassData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/class-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();

      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setClassData(updatedData);
        onRefreshData();
      } else {
        alert(data.error || "Gagal menyimpan perubahan.");
      }
    } catch (err) {
      alert("Gagal menghubungi server backend.");
    } finally {
      setLoading(false);
    }
  };

  // Base64 file uploader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, fieldId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(fieldId);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ filename: file.name, base64 }),
        });
        const data = await res.json();
        if (data.success) {
          callback(data.url);
        } else {
          alert("Gagal mengunggah gambar: " + data.error);
        }
      } catch (err) {
        alert("Gagal menghubungi server untuk mengunggah.");
      } finally {
        setUploading(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Student handlers ---
  const saveStudentForm = () => {
    if (!classData || !editingStudent) return;
    let list = [...classData.students];

    if (editingStudent.id) {
      // Edit
      list = list.map((s) => (s.id === editingStudent.id ? (editingStudent as Student) : s));
    } else {
      // Add
      const newId = Date.now().toString();
      const newStudent = {
        ...editingStudent,
        id: newId,
        absentNo: Number(editingStudent.absentNo) || list.length + 1,
      } as Student;
      list.push(newStudent);
    }

    // Sort by absent number
    list.sort((a, b) => a.absentNo - b.absentNo);

    const nextData = { ...classData, students: list, stats: { ...classData.stats, studentsCount: list.length } };
    setClassData(nextData);
    setEditingStudent(null);
    handleSaveChanges(nextData);
  };

  const deleteStudent = (id: string) => {
    if (!classData || !window.confirm("Apakah Anda yakin ingin menghapus siswa ini?")) return;
    const list = classData.students.filter((s) => s.id !== id);
    const nextData = { ...classData, students: list, stats: { ...classData.stats, studentsCount: list.length } };
    setClassData(nextData);
    handleSaveChanges(nextData);
  };

  // --- Gallery handlers ---
  const saveGalleryForm = () => {
    if (!classData || !editingGallery) return;
    let list = [...classData.gallery];

    if (editingGallery.id) {
      list = list.map((g) => (g.id === editingGallery.id ? (editingGallery as GalleryItem) : g));
    } else {
      const newId = `g_${Date.now()}`;
      list.push({ ...editingGallery, id: newId } as GalleryItem);
    }

    const nextData = { ...classData, gallery: list, stats: { ...classData.stats, photosCount: list.length } };
    setClassData(nextData);
    setEditingGallery(null);
    handleSaveChanges(nextData);
  };

  const deleteGallery = (id: string) => {
    if (!classData || !window.confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
    const list = classData.gallery.filter((g) => g.id !== id);
    const nextData = { ...classData, gallery: list, stats: { ...classData.stats, photosCount: list.length } };
    setClassData(nextData);
    handleSaveChanges(nextData);
  };

  // --- Video handlers ---
  const saveVideoForm = () => {
    if (!classData || !editingVideo) return;
    let list = [...classData.videos];

    if (editingVideo.id) {
      list = list.map((v) => (v.id === editingVideo.id ? (editingVideo as VideoItem) : v));
    } else {
      const newId = `v_${Date.now()}`;
      list.push({ ...editingVideo, id: newId } as VideoItem);
    }

    const nextData = { ...classData, videos: list, stats: { ...classData.stats, videosCount: list.length } };
    setClassData(nextData);
    setEditingVideo(null);
    handleSaveChanges(nextData);
  };

  const deleteVideo = (id: string) => {
    if (!classData || !window.confirm("Apakah Anda yakin ingin menghapus video ini?")) return;
    const list = classData.videos.filter((v) => v.id !== id);
    const nextData = { ...classData, videos: list, stats: { ...classData.stats, videosCount: list.length } };
    setClassData(nextData);
    handleSaveChanges(nextData);
  };

  // --- Timeline handlers ---
  const saveTimelineForm = () => {
    if (!classData || !editingTimeline) return;
    let list = [...classData.timeline];

    if (editingTimeline.id) {
      list = list.map((t) => (t.id === editingTimeline.id ? (editingTimeline as TimelineEvent) : t));
    } else {
      const newId = `tl_${Date.now()}`;
      list.push({ ...editingTimeline, id: newId } as TimelineEvent);
    }

    const nextData = { ...classData, timeline: list };
    setClassData(nextData);
    setEditingTimeline(null);
    handleSaveChanges(nextData);
  };

  const deleteTimeline = (id: string) => {
    if (!classData || !window.confirm("Apakah Anda yakin ingin menghapus agenda timeline ini?")) return;
    const list = classData.timeline.filter((t) => t.id !== id);
    const nextData = { ...classData, timeline: list };
    setClassData(nextData);
    handleSaveChanges(nextData);
  };

  // --- Announcement handlers ---
  const saveAnnForm = () => {
    if (!classData || !editingAnn) return;
    let list = classData.config.announcements ? [...classData.config.announcements] : [];

    if (editingAnn.id) {
      list = list.map((a) => (a.id === editingAnn.id ? (editingAnn as Announcement) : a));
    } else {
      const newId = `ann_${Date.now()}`;
      list.push({ ...editingAnn, id: newId, date: new Date().toISOString().split("T")[0] } as Announcement);
    }

    const nextData = {
      ...classData,
      config: { ...classData.config, announcements: list },
    };
    setClassData(nextData);
    setEditingAnn(null);
    handleSaveChanges(nextData);
  };

  const deleteAnn = (id: string) => {
    if (!classData || !window.confirm("Hapus pengumuman ini?")) return;
    const list = classData.config.announcements.filter((a) => a.id !== id);
    const nextData = {
      ...classData,
      config: { ...classData.config, announcements: list },
    };
    setClassData(nextData);
    handleSaveChanges(nextData);
  };

  // --- Piket handlers ---
  const togglePiketMember = (dayId: string, studentName: string) => {
    if (!classData) return;
    const list = classData.piket.map((day) => {
      if (day.id === dayId) {
        const isMember = day.members.includes(studentName);
        const nextMembers = isMember
          ? day.members.filter((m) => m !== studentName)
          : [...day.members, studentName];
        return { ...day, members: nextMembers };
      }
      return day;
    });

    const nextData = { ...classData, piket: list };
    setClassData(nextData);
    handleSaveChanges(nextData);
  };

  // --- Config handlers ---
  const handleConfigChange = (field: string, val: any) => {
    if (!classData) return;
    const nextData = {
      ...classData,
      config: { ...classData.config, [field]: val },
    };
    setClassData(nextData);
  };

  const handleStatsChange = (field: string, val: any) => {
    if (!classData) return;
    const nextData = {
      ...classData,
      stats: { ...classData.stats, [field]: val },
    };
    setClassData(nextData);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-6">
        {/* Background glow */}
        <div className="absolute w-80 h-80 rounded-full bg-netflix-red/10 blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full glass-panel-heavy p-8 rounded-3xl border border-neutral-800 relative z-10 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-xs font-mono text-gray-500 hover:text-netflix-red transition-colors"
          >
            Tutup
          </button>

          <Lock className="mx-auto text-netflix-red mb-4" size={40} />
          <h2 className="text-2xl font-black tracking-widest uppercase">Admin Login</h2>
          <p className="text-gray-400 text-xs mt-2 font-light">
            Masukkan sandi otorisasi SEVEN D untuk mengelola konten website kelas.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Kata Sandi Admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 text-white px-4 py-3.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-all text-sm text-center font-mono tracking-widest"
                required
              />
            </div>

            {error && <p className="text-netflix-red text-xs font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-netflix-red text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase hover:bg-red-700 transition-colors cursor-pointer"
            >
              {loading ? "Memvalidasi..." : "Masuk Dashboard"}
            </button>
          </form>
          <p className="text-[10px] text-gray-600 mt-6 font-mono">DEFAULT PASSWORD IS "admin7d"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0B] text-white overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Sidebar Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Mobile Sticky Header Bar */}
      <div className="md:hidden flex flex-col bg-neutral-950 border-b border-neutral-900 z-20 flex-shrink-0 w-full">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 -ml-2 text-gray-400 hover:text-white rounded-lg focus:outline-none hover:bg-white/5 active:scale-95 transition-all"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-black tracking-widest text-glow">
              SEVEN <span className="text-netflix-red">D</span> ADMIN
            </span>
          </div>
          <div className="flex items-center gap-2">
            {classData && (
              <button
                onClick={() => handleSaveChanges(classData)}
                disabled={loading}
                className="px-3 py-1.5 bg-netflix-red/10 border border-netflix-red/30 text-netflix-red hover:bg-netflix-red hover:text-white rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold active:scale-95"
                title="Simpan Semua"
              >
                <Save size={14} />
                <span>Simpan</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              title="Kembali ke Web"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Swipeable Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto px-5 pb-3.5 pt-0.5 scrollbar-none">
          {[
            { id: "siswa", name: "Siswa", icon: <Users size={14} /> },
            { id: "piket", name: "Piket", icon: <Calendar size={14} /> },
            { id: "timeline", name: "Timeline", icon: <Clock size={14} /> },
            { id: "galeri", name: "Galeri", icon: <Image size={14} /> },
            { id: "video", name: "Video", icon: <Video size={14} /> },
            { id: "pengumuman", name: "Mading", icon: <Megaphone size={14} /> },
            { id: "teks", name: "Settings", icon: <FileText size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingStudent(null);
                setEditingTimeline(null);
                setEditingGallery(null);
                setEditingVideo(null);
                setEditingAnn(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? "bg-netflix-red text-white border-netflix-red shadow-md shadow-netflix-red/20"
                  : "bg-neutral-900 text-gray-400 border-neutral-800/80"
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-neutral-950 border-r border-neutral-900 p-6 flex flex-col justify-between transition-transform duration-300 transform md:relative md:translate-x-0 md:w-64 flex-shrink-0 ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-black tracking-widest text-glow">
              SEVEN <span className="text-netflix-red">D</span> ADMIN
            </span>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="md:hidden text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav items */}
          <div className="space-y-1">
            {[
              { id: "siswa", name: "Kelola Siswa", icon: <Users size={16} /> },
              { id: "piket", name: "Jadwal Piket", icon: <Calendar size={16} /> },
              { id: "timeline", name: "Timeline Kelas", icon: <Clock size={16} /> },
              { id: "galeri", name: "Kelola Galeri", icon: <Image size={16} /> },
              { id: "video", name: "Video Kenangan", icon: <Video size={16} /> },
              { id: "pengumuman", name: "Pengumuman", icon: <Megaphone size={16} /> },
              { id: "teks", name: "Settings Website", icon: <FileText size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditingStudent(null);
                  setEditingTimeline(null);
                  setEditingGallery(null);
                  setEditingVideo(null);
                  setEditingAnn(null);
                  setIsMobileNavOpen(false); // Close on select
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === tab.id
                    ? "bg-netflix-red/10 text-netflix-red border-l-2 border-netflix-red"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bottom */}
        <div className="pt-6 border-t border-neutral-900 space-y-3">
          <button
            onClick={() => {
              if (classData) handleSaveChanges(classData);
              setIsMobileNavOpen(false);
            }}
            disabled={loading}
            className="w-full bg-netflix-red text-white py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save size={14} />
            {loading ? "Menyimpan..." : "Simpan Semua"}
          </button>

          <button
            onClick={() => {
              handleLogout();
              setIsMobileNavOpen(false);
            }}
            className="w-full bg-neutral-900 text-gray-400 hover:text-white py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-neutral-850 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            Logout
          </button>

          <button
            onClick={() => {
              onClose();
              setIsMobileNavOpen(false);
            }}
            className="w-full border border-neutral-800 text-gray-400 hover:text-white py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-neutral-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Kembali ke Web
          </button>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#0E0E0E] p-4 md:p-10 relative">
        {/* Saved Toast Alert */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-6 right-6 z-30 bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold"
            >
              <Check size={16} /> Data Berhasil Disimpan & Sinkron!
            </motion.div>
          )}
        </AnimatePresence>

        {!classData ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-mono mt-4">Memuat data database...</p>
          </div>
        ) : (
          <div>
            {/* Header section name */}
            <div className="mb-10 text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold capitalize">
                {activeTab === "teks" ? "Website Settings & Teks" : `Kelola ${activeTab}`}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                Lakukan pengeditan dan klik "Simpan Perubahan" di bagian bawah atau sidebar untuk mempublikasikan.
              </p>
              <div className="h-[1px] bg-neutral-800 mt-6" />
            </div>

            {/* TAB: SISWA */}
            {activeTab === "siswa" && (
              <div className="space-y-6 text-left">
                {/* Upper bar */}
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-300">Daftar Siswa Kelas ({classData.students.length} Orang)</h3>
                  <button
                    onClick={() => setEditingStudent({})}
                    className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={14} /> Tambah Siswa
                  </button>
                </div>

                {/* Grid List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classData.students.map((student) => (
                    <div
                      key={student.id}
                      className="glass-panel p-4 rounded-xl border border-neutral-800 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded-full border border-neutral-800"
                        />
                        <div>
                          <p className="text-xs font-mono text-netflix-red font-bold">Absen {student.absentNo}</p>
                          <h4 className="text-sm font-bold text-white line-clamp-1">{student.name}</h4>
                          <p className="text-[10px] text-gray-500 font-mono">Panggilan: {student.nickname || "-"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-2 text-gray-400 hover:text-netflix-red hover:bg-netflix-red/10 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Edit / Tambah Siswa */}
                <AnimatePresence>
                  {editingStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <div className="bg-[#0F0F0F] border border-neutral-800 w-full max-w-xl rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-none">
                        <h4 className="text-lg font-bold mb-4">
                          {editingStudent.id ? "Edit Data Siswa" : "Tambah Siswa Baru"}
                        </h4>

                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs text-gray-400 font-mono mb-1">No Absen</label>
                              <input
                                type="number"
                                value={editingStudent.absentNo || ""}
                                onChange={(e) => setEditingStudent({ ...editingStudent, absentNo: Number(e.target.value) })}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-gray-400 font-mono mb-1">Nama Panggilan</label>
                              <input
                                type="text"
                                value={editingStudent.nickname || ""}
                                onChange={(e) => setEditingStudent({ ...editingStudent, nickname: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Nama Lengkap</label>
                            <input
                              type="text"
                              value={editingStudent.name || ""}
                              onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-400 font-mono mb-1">Hobi</label>
                              <input
                                type="text"
                                value={editingStudent.hobby || ""}
                                onChange={(e) => setEditingStudent({ ...editingStudent, hobby: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 font-mono mb-1">Cita-Cita</label>
                              <input
                                type="text"
                                value={editingStudent.dream || ""}
                                onChange={(e) => setEditingStudent({ ...editingStudent, dream: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Kata Bijak (Quote)</label>
                            <textarea
                              value={editingStudent.quote || ""}
                              onChange={(e) => setEditingStudent({ ...editingStudent, quote: e.target.value })}
                              rows={2}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none resize-none"
                            />
                          </div>

                          {/* Image upload selector or input */}
                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Foto Profil / Avatar</label>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                placeholder="https://unsplash.com/... atau unggah file"
                                value={editingStudent.avatar || ""}
                                onChange={(e) => setEditingStudent({ ...editingStudent, avatar: e.target.value })}
                                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs focus:border-netflix-red focus:outline-none"
                              />
                              <label className="bg-neutral-900 border border-neutral-800 hover:border-netflix-red text-xs font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer relative">
                                <UploadCloud size={14} />
                                {uploading === "studAvatar" ? "Mengunggah..." : "Unggah"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(
                                      e,
                                      (url) => setEditingStudent({ ...editingStudent, avatar: url }),
                                      "studAvatar"
                                    )
                                  }
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2.5">
                          <button
                            onClick={() => setEditingStudent(null)}
                            className="px-4 py-2 rounded-lg bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-850 text-xs font-bold uppercase"
                          >
                            Batal
                          </button>
                          <button
                            onClick={saveStudentForm}
                            className="px-4 py-2 rounded-lg bg-netflix-red hover:bg-red-700 text-white text-xs font-bold uppercase"
                          >
                            Simpan Siswa
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB: PIKET */}
            {activeTab === "piket" && (
              <div className="space-y-8 text-left">
                <p className="text-sm text-gray-300">
                  Pilih hari piket untuk menambahkan atau mencopot nama siswa. Klik nama untuk mengubah penugasan.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classData.piket.map((day) => (
                    <div key={day.id} className="glass-panel p-6 rounded-2xl border border-neutral-800">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-900">
                        <h4 className="text-base font-extrabold text-white">{day.dayName}</h4>
                        <span className="text-[10px] font-mono bg-netflix-red/10 text-netflix-red px-2 py-0.5 rounded-md font-bold uppercase">
                          {day.members.length} Petugas
                        </span>
                      </div>

                      {/* Members listed */}
                      <div className="mb-6 space-y-2">
                        {day.members.map((member, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-neutral-950/40 px-3 py-2 rounded-lg border border-neutral-900 text-sm"
                          >
                            <span className="text-gray-300">{member}</span>
                            <button
                              onClick={() => togglePiketMember(day.id, member)}
                              className="text-gray-500 hover:text-netflix-red transition-colors text-xs font-bold"
                            >
                              Copot
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Select to Add dialog */}
                      <div>
                        <label className="block text-[10px] uppercase font-mono text-gray-500 mb-2 font-bold">
                          Tambahkan Petugas Piket:
                        </label>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              togglePiketMember(day.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="w-full bg-neutral-950 text-xs text-gray-300 border border-neutral-800 rounded-lg p-2 focus:outline-none focus:border-netflix-red"
                        >
                          <option value="">-- Pilih Siswa --</option>
                          {classData.students
                            .filter((s) => !day.members.includes(s.name))
                            .map((s) => (
                              <option key={s.id} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TIMELINE */}
            {activeTab === "timeline" && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-300">Agenda Milestones Perjalanan</h3>
                  <button
                    onClick={() => setEditingTimeline({})}
                    className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={14} /> Tambah Agenda
                  </button>
                </div>

                <div className="space-y-4">
                  {classData.timeline.map((event, index) => (
                    <div
                      key={event.id}
                      className="glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col md:flex-row justify-between md:items-center gap-4"
                    >
                      <div className="flex items-start gap-4">
                        {event.image && (
                          <img
                            src={event.image}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-20 h-14 object-cover rounded-lg border border-neutral-900"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-netflix-red/10 text-netflix-red px-2 py-0.5 rounded-md font-mono font-bold uppercase">
                              {event.date}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-1.5">{event.title}</h4>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xl font-light">
                            {event.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingTimeline(event)}
                          className="px-3 py-1.5 bg-neutral-900 text-xs hover:text-white font-semibold rounded-lg flex items-center gap-1"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => deleteTimeline(event.id)}
                          className="px-3 py-1.5 bg-neutral-900/40 text-xs hover:text-netflix-red font-semibold rounded-lg flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Timeline */}
                <AnimatePresence>
                  {editingTimeline && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <div className="bg-[#0F0F0F] border border-neutral-800 w-full max-w-xl rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-none">
                        <h4 className="text-lg font-bold mb-4">
                          {editingTimeline.id ? "Edit Agenda Timeline" : "Tambah Agenda Baru"}
                        </h4>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-400 font-mono mb-1">Judul Agenda</label>
                              <input
                                type="text"
                                value={editingTimeline.title || ""}
                                onChange={(e) => setEditingTimeline({ ...editingTimeline, title: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 font-mono mb-1">Tanggal / Bulan (cth: Juli 2025)</label>
                              <input
                                type="text"
                                value={editingTimeline.date || ""}
                                onChange={(e) => setEditingTimeline({ ...editingTimeline, date: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Deskripsi Kegiatan</label>
                            <textarea
                              value={editingTimeline.description || ""}
                              onChange={(e) => setEditingTimeline({ ...editingTimeline, description: e.target.value })}
                              rows={3}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Gambar Agenda</label>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                placeholder="URL gambar atau unggah file"
                                value={editingTimeline.image || ""}
                                onChange={(e) => setEditingTimeline({ ...editingTimeline, image: e.target.value })}
                                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs focus:border-netflix-red focus:outline-none"
                              />
                              <label className="bg-neutral-900 border border-neutral-800 hover:border-netflix-red text-xs font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer relative">
                                <UploadCloud size={14} />
                                Unggah
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(
                                      e,
                                      (url) => setEditingTimeline({ ...editingTimeline, image: url }),
                                      "timelineImg"
                                    )
                                  }
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2.5">
                          <button
                            onClick={() => setEditingTimeline(null)}
                            className="px-4 py-2 rounded-lg bg-neutral-900 text-gray-400 hover:text-white text-xs font-bold uppercase"
                          >
                            Batal
                          </button>
                          <button
                            onClick={saveTimelineForm}
                            className="px-4 py-2 rounded-lg bg-netflix-red hover:bg-red-700 text-white text-xs font-bold uppercase"
                          >
                            Simpan Agenda
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB: GALERI */}
            {activeTab === "galeri" && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-300">Kelola Galeri Foto Kelas ({classData.gallery.length} Foto)</h3>
                  <button
                    onClick={() => setEditingGallery({})}
                    className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={14} /> Tambah Foto
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {classData.gallery.map((item) => (
                    <div
                      key={item.id}
                      className="glass-panel p-2 rounded-xl border border-neutral-800 relative group flex flex-col justify-between"
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border border-neutral-900">
                        <img
                          src={item.url}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-3 text-left">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-neutral-900/60 flex items-center justify-between">
                        <button
                          onClick={() => setEditingGallery(item)}
                          className="text-[10px] uppercase font-bold text-gray-400 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteGallery(item.id)}
                          className="text-[10px] uppercase font-bold text-gray-500 hover:text-netflix-red"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Gallery */}
                <AnimatePresence>
                  {editingGallery && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <div className="bg-[#0F0F0F] border border-neutral-800 w-full max-w-xl rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-none">
                        <h4 className="text-lg font-bold mb-4">
                          {editingGallery.id ? "Edit Foto Galeri" : "Tambah Foto Baru"}
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Judul Foto</label>
                            <input
                              type="text"
                              value={editingGallery.title || ""}
                              onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Deskripsi Ringkas</label>
                            <textarea
                              value={editingGallery.description || ""}
                              onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                              rows={2}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Berkas Foto</label>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                placeholder="URL foto atau unggah file"
                                value={editingGallery.url || ""}
                                onChange={(e) => setEditingGallery({ ...editingGallery, url: e.target.value })}
                                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs focus:border-netflix-red focus:outline-none"
                              />
                              <label className="bg-neutral-900 border border-neutral-800 hover:border-netflix-red text-xs font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer relative">
                                <UploadCloud size={14} />
                                Unggah
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(
                                      e,
                                      (url) => setEditingGallery({ ...editingGallery, url }),
                                      "galleryImg"
                                    )
                                  }
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2.5">
                          <button
                            onClick={() => setEditingGallery(null)}
                            className="px-4 py-2 rounded-lg bg-neutral-900 text-gray-400 hover:text-white text-xs font-bold uppercase"
                          >
                            Batal
                          </button>
                          <button
                            onClick={saveGalleryForm}
                            className="px-4 py-2 rounded-lg bg-netflix-red hover:bg-red-700 text-white text-xs font-bold uppercase"
                          >
                            Simpan Foto
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB: VIDEO */}
            {activeTab === "video" && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-300">Kelola Video Kenangan ({classData.videos.length} Video)</h3>
                  <button
                    onClick={() => setEditingVideo({})}
                    className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={14} /> Tambah Video
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {classData.videos.map((video) => (
                    <div
                      key={video.id}
                      className="glass-panel p-4 rounded-xl border border-neutral-800 flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={video.thumbnail}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-24 h-16 object-cover rounded-lg border border-neutral-900"
                        />
                        <div className="text-left flex-1">
                          <h4 className="text-sm font-bold text-white line-clamp-1">{video.title}</h4>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed font-light">
                            {video.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-end gap-3">
                        <button
                          onClick={() => setEditingVideo(video)}
                          className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => deleteVideo(video.id)}
                          className="text-xs font-semibold text-gray-500 hover:text-netflix-red flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Video */}
                <AnimatePresence>
                  {editingVideo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <div className="bg-[#0F0F0F] border border-neutral-800 w-full max-w-xl rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-none">
                        <h4 className="text-lg font-bold mb-4">
                          {editingVideo.id ? "Edit Video Kenangan" : "Tambah Video Baru"}
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Judul Video</label>
                            <input
                              type="text"
                              value={editingVideo.title || ""}
                              onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Deskripsi Video</label>
                            <textarea
                              value={editingVideo.description || ""}
                              onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                              rows={2}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-400 font-mono mb-1">Tautan Embed Video (YouTube)</label>
                              <input
                                type="text"
                                placeholder="https://www.youtube.com/embed/..."
                                value={editingVideo.url || ""}
                                onChange={(e) => setEditingVideo({ ...editingVideo, url: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs focus:border-netflix-red focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 font-mono mb-1">Thumbnail Cover Gambar</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="URL Cover"
                                  value={editingVideo.thumbnail || ""}
                                  onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail: e.target.value })}
                                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs focus:border-netflix-red focus:outline-none"
                                />
                                <label className="bg-neutral-900 border border-neutral-800 text-[10px] font-semibold px-3 py-2 rounded-xl flex items-center justify-center cursor-pointer">
                                  Unggah
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleFileUpload(
                                        e,
                                        (url) => setEditingVideo({ ...editingVideo, thumbnail: url }),
                                        "videoThumb"
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2.5">
                          <button
                            onClick={() => setEditingVideo(null)}
                            className="px-4 py-2 rounded-lg bg-neutral-900 text-gray-400 hover:text-white text-xs font-bold uppercase"
                          >
                            Batal
                          </button>
                          <button
                            onClick={saveVideoForm}
                            className="px-4 py-2 rounded-lg bg-netflix-red hover:bg-red-700 text-white text-xs font-bold uppercase"
                          >
                            Simpan Video
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB: PENGUMUMAN */}
            {activeTab === "pengumuman" && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-300">
                    Pengumuman Mading Digital ({classData.config.announcements?.length || 0} Total)
                  </h3>
                  <button
                    onClick={() => setEditingAnn({ isActive: true })}
                    className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={14} /> Tambah Pengumuman
                  </button>
                </div>

                <div className="space-y-4">
                  {(classData.config.announcements || []).map((ann) => (
                    <div
                      key={ann.id}
                      className="glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col md:flex-row justify-between md:items-center gap-4"
                    >
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 font-mono font-semibold">{ann.date}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ann.isActive ? "bg-green-500/15 text-green-400" : "bg-neutral-800 text-gray-500"
                            }`}
                          >
                            {ann.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1.5">{ann.title}</h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-light leading-relaxed">
                          {ann.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingAnn(ann)}
                          className="px-3 py-1.5 bg-neutral-900 text-xs hover:text-white font-semibold rounded-lg flex items-center gap-1"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => deleteAnn(ann.id)}
                          className="px-3 py-1.5 bg-neutral-900/40 text-xs hover:text-netflix-red font-semibold rounded-lg flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modal Announcement */}
                <AnimatePresence>
                  {editingAnn && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <div className="bg-[#0F0F0F] border border-neutral-800 w-full max-w-xl rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-none">
                        <h4 className="text-lg font-bold mb-4">
                          {editingAnn.id ? "Edit Pengumuman" : "Tambah Pengumuman Mading"}
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Judul Pengumuman</label>
                            <input
                              type="text"
                              value={editingAnn.title || ""}
                              onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 font-mono mb-1">Isi Pengumuman</label>
                            <textarea
                              value={editingAnn.content || ""}
                              onChange={(e) => setEditingAnn({ ...editingAnn, content: e.target.value })}
                              rows={4}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm focus:border-netflix-red focus:outline-none resize-none"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-900">
                            <span className="text-xs text-gray-300 font-mono">Status Aktif (Tampilkan di mading)</span>
                            <button
                              onClick={() => setEditingAnn({ ...editingAnn, isActive: !editingAnn.isActive })}
                              className={`p-1 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                                editingAnn.isActive
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-neutral-800 text-gray-500"
                              }`}
                            >
                              {editingAnn.isActive ? "AKTIF" : "NONAKTIF"}
                            </button>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2.5">
                          <button
                            onClick={() => setEditingAnn(null)}
                            className="px-4 py-2 rounded-lg bg-neutral-900 text-gray-400 hover:text-white text-xs font-bold uppercase"
                          >
                            Batal
                          </button>
                          <button
                            onClick={saveAnnForm}
                            className="px-4 py-2 rounded-lg bg-netflix-red hover:bg-red-700 text-white text-xs font-bold uppercase"
                          >
                            Simpan Pengumuman
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB: TEKS & METADATA */}
            {activeTab === "teks" && (
              <div className="space-y-6 text-left">
                <div className="glass-panel p-6 rounded-2xl border border-neutral-800 space-y-5">
                  <h4 className="text-sm font-bold text-gray-300 uppercase font-mono tracking-widest pb-2 border-b border-neutral-900">
                    Kustomisasi Konten Teks Landing Page
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1">Judul Website / Logo</label>
                      <input
                        type="text"
                        value={classData.config.logoText || ""}
                        onChange={(e) => handleConfigChange("logoText", e.target.value)}
                        className="w-full bg-[#141414] text-white border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:border-netflix-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1">Nama Wali Kelas</label>
                      <input
                        type="text"
                        value={classData.stats.homeroomTeacher || ""}
                        onChange={(e) => handleStatsChange("homeroomTeacher", e.target.value)}
                        className="w-full bg-[#141414] text-white border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:border-netflix-red focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 font-mono mb-1">Slogan / Subtitle Kelas</label>
                    <textarea
                      value={classData.config.subtitleText || ""}
                      onChange={(e) => handleConfigChange("subtitleText", e.target.value)}
                      rows={3}
                      className="w-full bg-[#141414] text-white border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:border-netflix-red focus:outline-none resize-none"
                    />
                  </div>

                  {/* Backdrop Background image selector */}
                  <div>
                    <label className="block text-xs text-gray-400 font-mono mb-1">Foto Sampul Utama (Hero BG)</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Masukkan URL foto sampul utama"
                        value={classData.config.bgImageUrl || ""}
                        onChange={(e) => handleConfigChange("bgImageUrl", e.target.value)}
                        className="flex-1 bg-[#141414] text-white border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:border-netflix-red focus:outline-none"
                      />
                      <label className="bg-neutral-900 border border-neutral-800 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer relative">
                        <UploadCloud size={14} />
                        Unggah
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => handleConfigChange("bgImageUrl", url), "heroBgImg")
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1">Tautan TikTok Kelas</label>
                      <input
                        type="text"
                        value={classData.config.tiktokUrl || ""}
                        onChange={(e) => handleConfigChange("tiktokUrl", e.target.value)}
                        className="w-full bg-[#141414] text-white border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:border-netflix-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1">Tautan Instagram Kelas</label>
                      <input
                        type="text"
                        value={classData.config.instagramUrl || ""}
                        onChange={(e) => handleConfigChange("instagramUrl", e.target.value)}
                        className="w-full bg-[#141414] text-white border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:border-netflix-red focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Stats overrides */}
                <div className="glass-panel p-6 rounded-2xl border border-neutral-800 space-y-5">
                  <h4 className="text-sm font-bold text-gray-300 uppercase font-mono tracking-widest pb-2 border-b border-neutral-900">
                    Statistik Counter Manual overrides (Opsional)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1">Jumlah Siswa</label>
                      <input
                        type="number"
                        value={classData.stats.studentsCount}
                        onChange={(e) => handleStatsChange("studentsCount", Number(e.target.value))}
                        className="w-full bg-[#141414] text-white border border-neutral-800 rounded-xl px-4 py-2 text-sm focus:border-netflix-red text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1">Foto Terunggah</label>
                      <input
                        type="number"
                        value={classData.stats.photosCount}
                        onChange={(e) => handleStatsChange("photosCount", Number(e.target.value))}
                        className="w-full bg-[#141414] text-white border border-neutral-800 rounded-xl px-4 py-2 text-sm focus:border-netflix-red text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1">Video Terunggah</label>
                      <input
                        type="number"
                        value={classData.stats.videosCount}
                        onChange={(e) => handleStatsChange("videosCount", Number(e.target.value))}
                        className="w-full bg-[#141414] text-white border border-neutral-800 rounded-xl px-4 py-2 text-sm focus:border-netflix-red text-center"
                      />
                    </div>
                    <div className="flex items-end justify-center">
                      <button
                        onClick={() => {
                          const autoStats = {
                            ...classData.stats,
                            studentsCount: classData.students.length,
                            photosCount: classData.gallery.length,
                            videosCount: classData.videos.length,
                          };
                          setClassData({ ...classData, stats: autoStats });
                          alert("Statistik disinkronkan otomatis sesuai jumlah riil data!");
                        }}
                        className="w-full bg-neutral-900 text-[10px] font-bold uppercase tracking-wider py-2.5 text-gray-400 border border-neutral-800 hover:border-netflix-red hover:text-white rounded-xl"
                      >
                        Auto-Sync Rata
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick manual bottom trigger save */}
            <div className="mt-12 p-6 bg-neutral-950 border border-neutral-900 rounded-2xl flex items-center justify-between text-left">
              <div>
                <h4 className="text-white font-bold text-sm">Ada perubahan yang belum disimpan?</h4>
                <p className="text-gray-500 text-xs mt-0.5">Semua modifikasi tab saat ini akan terekam ke database secara aman.</p>
              </div>
              <button
                onClick={() => handleSaveChanges(classData)}
                disabled={loading}
                className="bg-netflix-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-netflix-red/20 transition-all active:scale-95"
              >
                <Save size={14} />
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
