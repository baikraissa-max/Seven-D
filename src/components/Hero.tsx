import { motion } from "motion/react";
import { Play, CalendarDays, ArrowDown } from "lucide-react";

interface HeroProps {
  bgImageUrl: string;
  subtitle: string;
  onExploreClick: () => void;
  onMemoriesClick: () => void;
}

export default function Hero({
  bgImageUrl,
  subtitle,
  onExploreClick,
  onMemoriesClick,
}: HeroProps) {
  return (
    <div
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-[#070707] overflow-hidden"
    >
      {/* Cinematic Fullscreen Background Image with Zoom effect */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        />
        {/* Multilayered Vignette and Gradient Overlay for Glassmorphism Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-[#0B0B0B]/25" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0B0B0B]/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        {/* Subtle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6 px-4 py-1.5 rounded-full bg-netflix-red/10 border border-netflix-red/30 text-netflix-red text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Official Class Website
        </motion.div>

        {/* Big Premium Header */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white font-sans select-none"
        >
          SEVEN <span className="text-netflix-red text-glow">D</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-6 text-base sm:text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-light tracking-wide"
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Main explore button (Netflix Style Red) */}
          <button
            onClick={onExploreClick}
            className="glow-btn pulse-glow px-8 py-4 w-full sm:w-auto rounded-xl bg-netflix-red text-white font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#ff1a26] transition-all duration-300 shadow-[0_4px_20px_rgba(229,9,20,0.4)]"
          >
            <Play size={16} fill="white" />
            Jelajahi
          </button>

          {/* Secondary memories button (Apple Style Translucent) */}
          <button
            onClick={onMemoriesClick}
            className="px-8 py-4 w-full sm:w-auto rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm tracking-wider uppercase border border-white/10 flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-sm"
          >
            <CalendarDays size={16} />
            Kenangan
          </button>
        </motion.div>

        {/* Smooth Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 1.8, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer flex flex-col items-center gap-2"
          onClick={onExploreClick}
        >
          <span className="text-[10px] tracking-widest uppercase font-mono text-gray-400">
            Scroll Down
          </span>
          <ArrowDown size={14} className="text-netflix-red" />
        </motion.div>
      </div>
    </div>
  );
}
