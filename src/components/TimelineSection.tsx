import { motion } from "motion/react";
import { Flag, Compass, Award, Trophy, PenTool, Camera, GraduationCap } from "lucide-react";
import { TimelineEvent } from "../types";

interface TimelineSectionProps {
  timeline: TimelineEvent[];
}

export default function TimelineSection({ timeline }: TimelineSectionProps) {
  // Map index or title to realistic icons
  const getTimelineIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Flag size={18} />;
      case 1:
        return <Award size={18} />;
      case 2:
        return <Trophy size={18} />;
      case 3:
        return <Compass size={18} />;
      case 4:
        return <PenTool size={18} />;
      case 5:
        return <Camera size={18} />;
      default:
        return <GraduationCap size={18} />;
    }
  };

  return (
    <section className="py-24 bg-[#0B0B0B] border-t border-neutral-900 relative">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.25em] text-netflix-red font-semibold font-mono">
            Journey Map
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 tracking-tight">
            Timeline <span className="text-netflix-red">Perjalanan</span>
            <div className="h-1 w-20 bg-netflix-red mt-4 mx-auto rounded-full" />
          </h2>
          <p className="text-gray-400 font-light mt-4 max-w-md mx-auto">
            Jalur sejarah penuh warna yang mengukir kebersamaan kelas SEVEN D sejak hari pertama hingga kelulusan.
          </p>
        </div>

        {/* Timeline Path */}
        {timeline.length > 0 ? (
          <div className="relative">
            {/* Center Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-[2px] bg-neutral-900 transform md:-translate-x-1/2 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-netflix-red via-netflix-red/30 to-netflix-red rounded-full" />
            </div>

            {/* Timeline Blocks */}
            <div className="space-y-16">
              {timeline.map((event, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div
                    key={event.id}
                    className="flex flex-col md:flex-row items-stretch md:items-center relative z-10"
                  >
                    {/* Circle Node on path */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-[7px] md:-translate-x-1/2 w-4 h-4 rounded-full bg-[#0B0B0B] border-[3px] border-netflix-red z-10" />

                    {/* Left Block or Spacing */}
                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-12 md:text-right order-2 md:order-1">
                      {isLeft ? (
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.6 }}
                          className="glass-card p-6 rounded-2xl border border-white/5 text-left"
                        >
                          {/* Image */}
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-44 object-cover rounded-xl mb-4 brightness-[0.8]"
                            />
                          )}

                          <div className="flex items-center gap-2.5 text-netflix-red font-mono text-xs font-semibold uppercase">
                            <span className="p-1.5 rounded-lg bg-netflix-red/10">
                              {getTimelineIcon(index)}
                            </span>
                            <span>{event.date}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white mt-3">{event.title}</h3>
                          <p className="text-gray-400 text-sm mt-2 font-light leading-relaxed">
                            {event.description}
                          </p>
                        </motion.div>
                      ) : (
                        // Empty container to balance spacing on desktop
                        <div className="hidden md:block" />
                      )}
                    </div>

                    {/* Right Block or Spacing */}
                    <div className="w-full md:w-1/2 pl-12 md:pl-12 order-3">
                      {!isLeft ? (
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.6 }}
                          className="glass-card p-6 rounded-2xl border border-white/5 text-left"
                        >
                          {/* Image */}
                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-44 object-cover rounded-xl mb-4 brightness-[0.8]"
                            />
                          )}

                          <div className="flex items-center gap-2.5 text-netflix-red font-mono text-xs font-semibold uppercase">
                            <span className="p-1.5 rounded-lg bg-netflix-red/10">
                              {getTimelineIcon(index)}
                            </span>
                            <span>{event.date}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white mt-3">{event.title}</h3>
                          <p className="text-gray-400 text-sm mt-2 font-light leading-relaxed">
                            {event.description}
                          </p>
                        </motion.div>
                      ) : (
                        // Empty container to balance spacing on desktop
                        <div className="hidden md:block" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-950/30 rounded-2xl border border-neutral-900">
            <p className="text-gray-500 font-mono text-sm">Timeline sejarah belum dibuat.</p>
          </div>
        )}
      </div>
    </section>
  );
}
