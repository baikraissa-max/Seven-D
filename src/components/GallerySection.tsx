import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
import { GalleryItem } from "../types";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setCurrentIndex(null);
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex !== null) {
      setCurrentIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : gallery.length - 1));
    }
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex !== null) {
      setCurrentIndex((prev) => (prev !== null && prev < gallery.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <section id="galeri" className="py-24 bg-[#070707] border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-netflix-red font-semibold font-mono">
              Visual Archives
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 tracking-tight">
              Galeri <span className="text-netflix-red">Foto</span>
            </h2>
            <div className="h-1 w-20 bg-netflix-red mt-4 rounded-full" />
          </div>
          <p className="text-gray-400 font-light max-w-md">
            Kumpulan potret bahagia yang menangkap tawa, haru, dan setiap perjalanan indah kelas SEVEN D.
          </p>
        </div>

        {/* Gallery Grid */}
        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index % 3 * 0.1 }}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer glass-card"
              >
                {/* Image */}
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlap Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                  <span className="text-netflix-red text-[10px] uppercase font-mono font-bold tracking-widest flex items-center gap-1.5 mb-1">
                    <ImageIcon size={12} /> Click to Expand
                  </span>
                  <h4 className="text-white text-base font-bold line-clamp-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-gray-300 text-xs mt-1 line-clamp-1 font-light">{item.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-950/30 rounded-2xl border border-neutral-900">
            <p className="text-gray-500 font-mono text-sm">Belum ada foto dalam galeri.</p>
          </div>
        )}

        {/* Fullscreen Lightbox Carousel */}
        <AnimatePresence>
          {currentIndex !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Blur Background and Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeLightbox}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(229, 9, 20, 0.08) 0%, rgba(0,0,0,0) 80%), url(${gallery[currentIndex]?.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "overlay",
                }}
              />

              {/* Lightbox Content Container */}
              <div className="relative z-10 max-w-5xl w-full px-4 flex flex-col items-center">
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute -top-16 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-netflix-red p-3 rounded-full transition-all duration-300 backdrop-blur-md"
                >
                  <X size={24} />
                </button>

                {/* Main Active Photo Container */}
                <div className="relative flex items-center justify-center w-full aspect-[4/3] md:aspect-[16/10] max-h-[75vh]">
                  {/* Left Slide Arrow */}
                  <button
                    onClick={showPrev}
                    className="absolute left-4 z-20 text-white bg-black/40 hover:bg-netflix-red p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-md border border-white/5"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Active Image */}
                  <motion.img
                    key={currentIndex}
                    src={gallery[currentIndex]?.url}
                    alt={gallery[currentIndex]?.title}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-contain rounded-xl select-none"
                  />

                  {/* Right Slide Arrow */}
                  <button
                    onClick={showNext}
                    className="absolute right-4 z-20 text-white bg-black/40 hover:bg-netflix-red p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-md border border-white/5"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Active Caption Panel */}
                <motion.div
                  key={`caption-${currentIndex}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mt-6 text-center max-w-2xl"
                >
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {gallery[currentIndex]?.title}
                  </h3>
                  {gallery[currentIndex]?.description && (
                    <p className="text-sm text-gray-400 mt-2 font-light">
                      {gallery[currentIndex]?.description}
                    </p>
                  )}
                  <p className="text-xs font-mono text-netflix-red mt-3 font-semibold">
                    {currentIndex + 1} of {gallery.length} PHOTOS
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
