import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Film, X, Maximize2 } from "lucide-react";
import { VideoItem } from "../types";

interface VideoSectionProps {
  videos: VideoItem[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const handlePlayVideo = (url: string) => {
    setActiveVideoUrl(url);
  };

  const handleCloseVideo = () => {
    setActiveVideoUrl(null);
  };

  return (
    <section id="kenangan" className="py-24 bg-[#0B0B0B] border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-netflix-red font-semibold font-mono">
              Cinematic Reel
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 tracking-tight">
              Video <span className="text-netflix-red">Kenangan</span>
            </h2>
            <div className="h-1 w-20 bg-netflix-red mt-4 rounded-full" />
          </div>
          <p className="text-gray-400 font-light max-w-md">
            Putar video dan saksikan kembali serpihan kenangan manis, tawa lepas, dan petualangan tak ternilai kelas SEVEN D.
          </p>
        </div>

        {/* Video Cards Grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group"
              >
                {/* Thumbnail Preview with Play Overlay */}
                <div className="relative aspect-[16/9] w-full overflow-hidden z-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.75]"
                  />
                  {/* Glowing Overlay */}
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors duration-300" />

                  {/* Play Button */}
                  <button
                    onClick={() => handlePlayVideo(video.url)}
                    className="absolute inset-0 m-auto w-16 h-16 bg-netflix-red text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 shadow-netflix-red/30 cursor-pointer"
                  >
                    <Play size={24} fill="white" className="ml-1" />
                  </button>

                  {/* Fullscreen icon indicator */}
                  <button
                    onClick={() => handlePlayVideo(video.url)}
                    className="absolute bottom-4 right-4 p-2 bg-black/60 hover:bg-netflix-red rounded-lg text-white backdrop-blur-md border border-white/5 transition-colors"
                    title="Mainkan Layar Penuh"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>

                {/* Video Info */}
                <div className="p-6 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-netflix-red uppercase tracking-widest font-mono font-bold flex items-center gap-1.5 mb-2">
                      <Film size={12} /> Playable Video Reel
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-netflix-red transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-gray-400 text-sm mt-2 font-light leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-950/30 rounded-2xl border border-neutral-900">
            <p className="text-gray-500 font-mono text-sm">Belum ada video kenangan.</p>
          </div>
        )}

        {/* Video Player Modal/Overlay */}
        <AnimatePresence>
          {activeVideoUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseVideo}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
              />

              {/* Video Player Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative bg-black w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl z-10"
              >
                {/* Close Button */}
                <button
                  onClick={handleCloseVideo}
                  className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-netflix-red hover:text-white text-gray-300 p-2.5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Video Embed Frame */}
                {activeVideoUrl.includes("youtube.com") || activeVideoUrl.includes("youtu.be") ? (
                  <iframe
                    src={`${activeVideoUrl}${activeVideoUrl.includes("?") ? "&" : "?"}autoplay=1&rel=0`}
                    title="SEVEN D Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={activeVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
