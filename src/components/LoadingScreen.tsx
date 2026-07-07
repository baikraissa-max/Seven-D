import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      // Wait for exit animation to finish before calling onComplete
      setTimeout(onComplete, 800);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="loading-screen"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0B] text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient red glow behind logo */}
          <div className="absolute w-96 h-96 rounded-full bg-netflix-red/10 blur-[120px]" />

          <div className="relative flex flex-col items-center">
            {/* Logo container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center space-x-1"
            >
              <span className="text-5xl md:text-7xl font-extrabold tracking-widest text-glow select-none font-sans">
                SEVEN
                <span className="text-netflix-red relative inline-block ml-3">
                  D
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-netflix-red rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                  />
                </span>
              </span>
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-6 text-xs md:text-sm tracking-[0.3em] uppercase text-gray-400 font-mono"
            >
              The Legacy Begins
            </motion.p>

            {/* Loading Indicator */}
            <div className="mt-12 w-48 h-[2px] bg-neutral-900 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-netflix-red rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Footer of loader */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 text-[10px] tracking-[0.2em] font-mono text-gray-500 uppercase"
          >
            Class of 2026 • SEVEN D
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
