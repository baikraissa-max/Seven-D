import { motion } from "motion/react";
import { Megaphone, Calendar, ChevronRight } from "lucide-react";
import { Announcement } from "../types";

interface AnnouncementsProps {
  announcements: Announcement[];
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  const activeAnnouncements = announcements?.filter((a) => a.isActive) || [];

  if (activeAnnouncements.length === 0) return null;

  return (
    <div className="bg-[#070707] border-t border-neutral-900 py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          {/* Header left */}
          <div className="md:w-1/3 text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-netflix-red font-semibold font-mono flex items-center gap-2">
              <Megaphone size={14} className="pulse-glow" /> Class Bulletin
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Mading <span className="text-netflix-red">Digital</span>
            </h2>
            <p className="text-gray-400 font-light mt-3 text-sm leading-relaxed">
              Informasi terkini, pengumuman tugas, kegiatan kelas, dan kabar penting dari SEVEN D.
            </p>
          </div>

          {/* Cards right */}
          <div className="md:w-2/3 w-full flex flex-col gap-4">
            {activeAnnouncements.map((ann, index) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel p-6 rounded-2xl border-l-4 border-l-netflix-red text-left relative overflow-hidden group hover:bg-[#121212]/50 transition-colors duration-300"
              >
                {/* Date header */}
                <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Calendar size={12} className="text-netflix-red" />
                    {ann.date}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-netflix-red/10 text-netflix-red text-[10px] font-bold uppercase tracking-wider">
                    Penting
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mt-3 group-hover:text-netflix-red transition-colors">
                  {ann.title}
                </h3>
                <p className="text-gray-300 text-sm mt-2 font-light leading-relaxed">
                  {ann.content}
                </p>

                {/* Arrow Decor */}
                <ChevronRight size={16} className="absolute bottom-6 right-6 text-gray-700 group-hover:text-netflix-red group-hover:translate-x-1 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
