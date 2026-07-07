import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Users, GraduationCap, Image, Video } from "lucide-react";
import { ClassStats } from "../types";

interface StatsSectionProps {
  stats: ClassStats;
}

function Counter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);

    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return <span ref={ref}>{count}</span>;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const statsConfig = [
    {
      id: "students",
      label: "Murid Aktif",
      value: stats.studentsCount,
      icon: <Users size={24} />,
      suffix: "",
    },
    {
      id: "teacher",
      label: "Wali Kelas",
      value: 1,
      icon: <GraduationCap size={24} />,
      suffix: "",
    },
    {
      id: "photos",
      label: "Foto Kenangan",
      value: stats.photosCount,
      icon: <Image size={24} />,
      suffix: "+",
    },
    {
      id: "videos",
      label: "Video Kenangan",
      value: stats.videosCount,
      icon: <Video size={24} />,
      suffix: "+",
    },
  ];

  return (
    <section className="py-20 bg-[#070707] border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center relative group overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/0 to-netflix-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div className="p-3 bg-netflix-red/10 text-netflix-red rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>

              {/* Stat Value */}
              <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
                <Counter value={stat.value} />
                <span className="text-netflix-red">{stat.suffix}</span>
              </h3>

              {/* Stat Label */}
              <p className="text-gray-400 text-xs sm:text-sm tracking-wider uppercase font-mono mt-2 font-medium">
                {stat.label}
              </p>

              {/* Subtitle */}
              {stat.id === "teacher" && (
                <p className="text-[10px] text-gray-500 font-mono mt-1 italic max-w-[180px] truncate" title={stats.homeroomTeacher}>
                  {stats.homeroomTeacher}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
