import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, BookOpen, Star, Quote, X } from "lucide-react";
import { Student } from "../types";

interface StudentSectionProps {
  students: Student[];
}

export default function StudentSection({ students }: StudentSectionProps) {
  const [search, setSearch] = useState("");
  const [filterRange, setFilterRange] = useState("all"); // 'all', '1-10', '11-20', '21+'
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
      (student.nickname && student.nickname.toLowerCase().includes(search.toLowerCase()));

    let matchesRange = true;
    if (filterRange === "1-10") {
      matchesRange = student.absentNo >= 1 && student.absentNo <= 10;
    } else if (filterRange === "11-20") {
      matchesRange = student.absentNo >= 11 && student.absentNo <= 20;
    } else if (filterRange === "21+") {
      matchesRange = student.absentNo >= 21;
    }

    return matchesSearch && matchesRange;
  });

  return (
    <section id="siswa" className="py-24 bg-[#0B0B0B] border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-netflix-red font-semibold font-mono">
              Class Roster
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 tracking-tight">
              Daftar <span className="text-netflix-red">Siswa</span>
            </h2>
            <div className="h-1 w-20 bg-netflix-red mt-4 rounded-full" />
          </div>
          <p className="text-gray-400 font-light max-w-md">
            Mengenal lebih dekat 32 jiwa luar biasa yang mengisi keseharian SEVEN D dengan tawa dan keceriaan.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-panel p-6 rounded-2xl mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari nama siswa atau nama panggilan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141414] text-white pl-12 pr-4 py-3 rounded-xl border border-neutral-800 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-all text-sm"
            />
          </div>

          {/* Absent Range Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end items-center">
            <span className="text-xs text-gray-400 font-mono uppercase mr-2 flex items-center gap-1.5">
              <SlidersHorizontal size={14} />
              Filter Absen:
            </span>
            {[
              { label: "Semua", value: "all" },
              { label: "Absen 1 - 10", value: "1-10" },
              { label: "Absen 11 - 20", value: "11-20" },
              { label: "Absen 21+", value: "21+" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterRange(tab.value)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  filterRange === tab.value
                    ? "bg-netflix-red text-white shadow-lg shadow-netflix-red/20"
                    : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Students Cards Grid */}
        {filteredStudents.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(index * 0.04, 0.4),
                    ease: [0.25, 0.8, 0.25, 1],
                  }}
                  onClick={() => setSelectedStudent(student)}
                  className="glass-card rounded-2xl overflow-hidden cursor-pointer group aspect-[3/4] relative flex flex-col justify-end"
                >
                  {/* Student Avatar Image */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.75] group-hover:brightness-[0.6]"
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />
                  </div>

                  {/* Absent Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-white/10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-netflix-red font-mono shadow-md">
                    {student.absentNo < 10 ? `0${student.absentNo}` : student.absentNo}
                  </div>

                  {/* Name and Basic Info */}
                  <div className="p-4 md:p-6 relative z-10 text-left">
                    <p className="text-[10px] uppercase tracking-widest text-netflix-red font-bold font-mono">
                      Siswa SEVEN D
                    </p>
                    <h3 className="text-base md:text-lg font-bold text-white mt-1 group-hover:text-netflix-red line-clamp-1 transition-colors">
                      {student.nickname || student.name.split(" ")[0]}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {student.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-neutral-950/30 rounded-2xl border border-neutral-900">
            <p className="text-gray-500 font-mono text-sm">Siswa tidak ditemukan.</p>
          </div>
        )}

        {/* Student Popup/Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedStudent(null)}
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
              />

              {/* Popup Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="relative bg-[#0F0F0F] border border-neutral-800 max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-netflix-red backdrop-blur-md hover:text-white text-gray-400 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Left/Top Area: Large Image */}
                <div className="md:w-1/2 relative aspect-[4/5] md:aspect-auto">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/35 to-transparent" />

                  {/* Floating Absent No */}
                  <div className="absolute bottom-6 left-6 bg-netflix-red text-white px-4 py-2 rounded-xl text-sm font-bold font-mono shadow-lg">
                    ABSEN {selectedStudent.absentNo < 10 ? `0${selectedStudent.absentNo}` : selectedStudent.absentNo}
                  </div>
                </div>

                {/* Right/Bottom Area: Text Info */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center text-left">
                  <span className="text-xs uppercase tracking-[0.25em] text-netflix-red font-semibold font-mono">
                    Profil Lengkap
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
                    {selectedStudent.name}
                  </h3>
                  {selectedStudent.nickname && (
                    <p className="text-sm text-gray-400 font-medium font-mono mt-1">
                      Panggilan: "{selectedStudent.nickname}"
                    </p>
                  )}

                  <div className="h-[1px] bg-neutral-800 my-6" />

                  {/* Hobi & Cita-Cita */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-netflix-red/10 text-netflix-red mt-0.5">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-mono text-gray-400 font-bold">Hobi</h4>
                        <p className="text-sm text-gray-200 mt-1">{selectedStudent.hobby || "-"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-netflix-red/10 text-netflix-red mt-0.5">
                        <Star size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-mono text-gray-400 font-bold">Cita-Cita</h4>
                        <p className="text-sm text-gray-200 mt-1">{selectedStudent.dream || "-"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-neutral-800 my-6" />

                  {/* Quote */}
                  {selectedStudent.quote && (
                    <div className="relative bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                      <span className="absolute -top-3 -left-1 text-netflix-red/25">
                        <Quote size={40} />
                      </span>
                      <p className="text-sm italic text-gray-300 relative z-10 pl-6 leading-relaxed">
                        "{selectedStudent.quote}"
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
