import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ShieldAlert } from "lucide-react";

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onAdminClick: () => void;
}

export default function Navbar({ onNavigate, onAdminClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Beranda", target: "home" },
    { name: "Siswa", target: "siswa" },
    { name: "Piket", target: "piket" },
    { name: "Kenangan", target: "kenangan" },
    { name: "Galeri", target: "galeri" },
    { name: "Sosial Media", target: "sosial" },
  ];

  const handleItemClick = (target: string) => {
    setIsOpen(false);
    onNavigate(target);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0B0B0B]/95 backdrop-blur-md border-b border-neutral-900 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => handleItemClick("home")}
          className="cursor-pointer flex items-center space-x-1 group select-none"
        >
          <span className="text-xl md:text-2xl font-black tracking-widest text-white group-hover:text-glow smooth-transition">
            SEVEN <span className="text-netflix-red">D</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleItemClick(item.target)}
              className="text-sm font-medium tracking-wider text-gray-300 hover:text-white hover:text-glow transition-all duration-300 relative py-1 group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-netflix-red transition-all duration-300 group-hover:w-full" />
            </button>
          ))}

          {/* Minimal Key Icon for Admin Login - Discrete and elegant */}
          <button
            onClick={onAdminClick}
            className="text-gray-500 hover:text-netflix-red transition-colors duration-300 p-1.5 rounded-full hover:bg-white/5"
            title="Admin Dashboard"
          >
            <ShieldAlert size={16} />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center space-x-4 md:hidden">
          {/* Subtle admin button also available in mobile */}
          <button
            onClick={onAdminClick}
            className="text-gray-500 hover:text-netflix-red p-1.5 rounded-full"
            title="Admin Dashboard"
          >
            <ShieldAlert size={16} />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-netflix-red transition-colors focus:outline-none p-1"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#0B0B0B]/98 backdrop-blur-lg border-b border-neutral-900 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col space-y-5">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.target}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleItemClick(item.target)}
                  className="text-left text-lg font-medium tracking-wide text-gray-300 hover:text-white py-1 border-l-2 border-transparent hover:border-netflix-red pl-3 transition-all duration-300"
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
