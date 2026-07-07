import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Announcements from "./components/Announcements";
import StudentSection from "./components/StudentSection";
import PiketSection from "./components/PiketSection";
import TimelineSection from "./components/TimelineSection";
import VideoSection from "./components/VideoSection";
import GallerySection from "./components/GallerySection";
import StatsSection from "./components/StatsSection";
import SocialSection from "./components/SocialSection";
import AdminDashboard from "./components/AdminDashboard";
import { ClassData } from "./types";
import { initialClassData } from "./data/initial-data";

export default function App() {
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [currentView, setCurrentView] = useState<"home" | "admin">("home");

  // Fetch data on mount
  const fetchClassData = async () => {
    try {
      const res = await fetch("/api/class-data");
      if (res.ok) {
        const data = await res.json();
        setClassData(data);
      } else {
        setClassData(initialClassData);
      }
    } catch (err) {
      console.warn("Express backend offline or unreachable, falling back to local initial state.");
      setClassData(initialClassData);
    }
  };

  useEffect(() => {
    fetchClassData();

    // Direct routing check
    const path = window.location.pathname;
    if (path === "/admin") {
      setCurrentView("admin");
    }

    // Handle back button / forward button
    const handlePopState = () => {
      if (window.location.pathname === "/admin") {
        setCurrentView("admin");
      } else {
        setCurrentView("home");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleAdminToggle = (open: boolean) => {
    if (open) {
      setCurrentView("admin");
      window.history.pushState({}, "", "/admin");
    } else {
      setCurrentView("home");
      window.history.pushState({}, "", "/");
    }
  };

  const scrollToSection = (id: string) => {
    // If we're on admin page, switch to home first, wait a moment, then scroll
    if (currentView === "admin") {
      handleAdminToggle(false);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="bg-[#0B0B0B] text-white font-sans min-h-screen relative overflow-x-hidden antialiased Selection:bg-netflix-red selection:text-white">
      {/* 1. Startup Loader */}
      <LoadingScreen onComplete={() => setIsLoaderFinished(true)} />

      {isLoaderFinished && classData && (
        <>
          {/* 2. Standard Header & Navbar */}
          <Navbar
            onNavigate={scrollToSection}
            onAdminClick={() => handleAdminToggle(true)}
          />

          {/* 3. Main Views router */}
          <main className="relative">
            {/* Hero / Welcome Intro */}
            <Hero
              bgImageUrl={classData.config.bgImageUrl}
              subtitle={classData.config.subtitleText}
              onExploreClick={() => scrollToSection("siswa")}
              onMemoriesClick={() => scrollToSection("kenangan")}
            />

            {/* Bulletins Board */}
            <Announcements announcements={classData.config.announcements} />

            {/* Students Profiles Grid */}
            <StudentSection students={classData.students} />

            {/* Class Piket schedule */}
            <PiketSection piket={classData.piket} />

            {/* Class History Milestones */}
            <TimelineSection timeline={classData.timeline} />

            {/* Video Records */}
            <VideoSection videos={classData.videos} />

            {/* Gallery Media */}
            <GallerySection gallery={classData.gallery} />

            {/* Dynamic Counter Statistics */}
            <StatsSection stats={classData.stats} />

            {/* Social Network Panels */}
            <SocialSection
              tiktokUrl={classData.config.tiktokUrl}
              instagramUrl={classData.config.instagramUrl}
            />
          </main>

          {/* 4. Footer */}
          <footer className="py-12 bg-[#070707] border-t border-neutral-900 text-center text-sm relative">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 font-light">
              <p className="flex items-center justify-center gap-1">
                Made with <span className="text-netflix-red animate-pulse">❤️</span> by <span className="font-bold text-gray-400">Seven D</span>
              </p>
              <p className="font-mono text-xs text-gray-600">
                © {new Date().getFullYear()} SEVEN D • All Rights Reserved.
              </p>
            </div>
          </footer>

          {/* 5. Secret Admin Overlay Panel */}
          {currentView === "admin" && (
            <AdminDashboard
              onClose={() => handleAdminToggle(false)}
              onRefreshData={fetchClassData}
            />
          )}
        </>
      )}
    </div>
  );
}
