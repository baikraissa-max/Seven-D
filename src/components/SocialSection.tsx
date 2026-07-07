import { motion } from "motion/react";
import { Instagram, Send } from "lucide-react";

interface SocialSectionProps {
  tiktokUrl: string;
  instagramUrl: string;
}

export default function SocialSection({ tiktokUrl, instagramUrl }: SocialSectionProps) {
  return (
    <section id="sosial" className="py-24 bg-[#0B0B0B] border-t border-neutral-900 relative overflow-hidden">
      {/* Decorative Blur BG */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-netflix-red/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span className="text-xs uppercase tracking-[0.25em] text-netflix-red font-semibold font-mono">
          Connect With Us
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 tracking-tight">
          Ikuti <span className="text-netflix-red">Kami</span>
        </h2>
        <div className="h-1 w-20 bg-netflix-red mt-4 mx-auto rounded-full" />
        <p className="text-gray-400 font-light mt-4 max-w-md mx-auto text-sm md:text-base">
          Temukan keseruan harian kami di media sosial dan jadilah bagian dari petualangan seru SEVEN D!
        </p>

        {/* Social Card Links */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* TikTok link card */}
          <motion.a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full sm:w-72 glass-panel p-6 rounded-2xl flex items-center justify-between group hover:border-netflix-red/50 hover:bg-neutral-900/60 transition-all duration-300 border border-white/5 text-left"
          >
            <div className="flex items-center gap-4">
              {/* Custom stylish TikTok SVG since Lucide doesn't have a built-in TikTok icon */}
              <div className="p-3 bg-white/5 text-white group-hover:bg-netflix-red/10 group-hover:text-netflix-red rounded-xl transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">TikTok</h4>
                <p className="text-gray-400 text-xs mt-0.5">@pitu_d07</p>
              </div>
            </div>
            <Send size={16} className="text-gray-500 group-hover:text-netflix-red group-hover:translate-x-1 transition-all" />
          </motion.a>

          {/* Instagram link card */}
          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="w-full sm:w-72 glass-panel p-6 rounded-2xl flex items-center justify-between group hover:border-netflix-red/50 hover:bg-neutral-900/60 transition-all duration-300 border border-white/5 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 text-white group-hover:bg-netflix-red/10 group-hover:text-netflix-red rounded-xl transition-all duration-300">
                <Instagram size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Instagram</h4>
                <p className="text-gray-400 text-xs mt-0.5">@classsevendee</p>
              </div>
            </div>
            <Send size={16} className="text-gray-500 group-hover:text-netflix-red group-hover:translate-x-1 transition-all" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
