import { motion } from "motion/react";
import { Calendar, UserCheck, Shield } from "lucide-react";
import { PiketDay } from "../types";

interface PiketSectionProps {
  piket: PiketDay[];
}

export default function PiketSection({ piket }: PiketSectionProps) {
  // Sorted days mapping (Senin to Jumat)
  const sortedDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const orderedPiket = [...piket].sort((a, b) => {
    return sortedDays.indexOf(a.dayName) - sortedDays.indexOf(b.dayName);
  });

  return (
    <section id="piket" className="py-24 bg-[#070707] border-t border-neutral-900 relative overflow-hidden">
      {/* Visual Ambient Decorators */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full bg-netflix-red/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-netflix-red font-semibold font-mono">
              Duty Schedule
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 tracking-tight">
              Jadwal <span className="text-netflix-red">Piket</span>
            </h2>
            <div className="h-1 w-20 bg-netflix-red mt-4 rounded-full" />
          </div>
          <p className="text-gray-400 font-light max-w-md">
            Pembagian tanggung jawab harian untuk menjaga kebersihan dan kenyamanan ruang belajar kelas SEVEN D.
          </p>
        </div>

        {/* Schedule Cards Grid */}
        {orderedPiket.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {orderedPiket.map((day, index) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/5 relative overflow-hidden group"
              >
                {/* Red top border highlight on hover */}
                <span className="absolute top-0 left-0 w-full h-[3px] bg-netflix-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {/* Day Header */}
                <div className="text-left mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:text-netflix-red transition-colors">
                      {day.dayName}
                    </h3>
                    <Calendar size={18} className="text-gray-500 group-hover:text-netflix-red transition-colors" />
                  </div>
                  <div className="h-[1px] bg-neutral-800 w-full mt-4" />
                </div>

                {/* Duty Members */}
                <div className="flex-1">
                  {day.members && day.members.length > 0 ? (
                    <ul className="space-y-3.5 text-left">
                      {day.members.map((member, mIdx) => (
                        <li key={mIdx} className="flex items-center gap-2.5 text-gray-300 text-sm font-light">
                          <span className="w-1.5 h-1.5 bg-netflix-red rounded-full flex-shrink-0" />
                          <span className="truncate" title={member}>
                            {member}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-6 text-center text-xs text-gray-500 font-mono">
                      Belum ada siswa
                    </div>
                  )}
                </div>

                {/* Footer badge */}
                <div className="mt-8 pt-4 border-t border-neutral-900/60 flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase">
                  <span>SEVEN D DUTY</span>
                  <UserCheck size={12} className="text-gray-600 group-hover:text-netflix-red/60" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-950/30 rounded-2xl border border-neutral-900">
            <p className="text-gray-500 font-mono text-sm">Jadwal piket belum terisi.</p>
          </div>
        )}

        {/* Custom Classroom Rules Accent Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4 border border-netflix-red/10 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-netflix-red/10 text-netflix-red rounded-xl">
              <Shield size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Kebersihan Sebagian dari Iman</h4>
              <p className="text-gray-400 text-sm mt-0.5">Seluruh petugas wajib hadir 15 menit sebelum bel masuk berbunyi.</p>
            </div>
          </div>
          <div className="text-xs font-mono text-gray-500 uppercase border border-neutral-800 px-3.5 py-1.5 rounded-lg">
            7D Clean Code Rule
          </div>
        </motion.div>
      </div>
    </section>
  );
}
