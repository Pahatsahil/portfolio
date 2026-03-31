import { motion } from "framer-motion";
import { User, Download } from "lucide-react";
import FadeIn from "./animations/FadeIn";
import type { Profile } from "../hooks/usePortfolioData";

interface AboutProps {
  profile: Profile | null;
}

const defaultStats = [
  { number: "3+", label: "Years Experience" },
  { number: "15+", label: "Projects Completed" },
  { number: "10+", label: "Happy Clients" },
  { number: "500K+", label: "App Downloads" },
];

const defaultHighlights = [
  "Cross-platform mobile development (Android & iOS)",
  "Native module integration (Kotlin / Swift)",
  "Performance optimization & profiling",
  "Offline-first architecture with SQLite",
  "State management & database design",
];

const About = ({ profile }: AboutProps) => {
  const stats = profile?.aboutStats?.length ? profile.aboutStats : defaultStats;
  const highlights = profile?.aboutHighlights?.length
    ? profile.aboutHighlights
    : defaultHighlights;
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-4">
              About <span className="text-gradient">Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#61dafb] to-[#818cf8] mx-auto rounded-full" />
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="relative">
              <div className="w-full aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#61dafb]/20 to-[#818cf8]/20 rounded-3xl transform rotate-3" />
                <div className="absolute inset-0 bg-[#1e293b] rounded-3xl border border-[#334155] p-8">
                  <div className="h-full flex flex-col justify-center">
                    {profile?.photoUrl && profile?.showPhoto !== false ? (
                      <img
                        src={profile.photoUrl}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mb-6 border-2 border-[#61dafb]/40"
                      />
                    ) : (
                      <User size={64} className="text-[#61dafb] mb-6" />
                    )}
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {profile?.title || "React Native Developer"}
                    </h3>
                    <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {profile?.bio ||
                        "Passionate about building high-performance mobile applications with seamless user experiences. I bridge the gap between design and technology to create apps that users love."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="p-6 bg-[#1e293b]/50 rounded-2xl border border-[#334155] hover:border-[#61dafb]/50 transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-3xl font-bold text-gradient mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 bg-[#1e293b]/50 rounded-2xl border border-[#334155]">
                <h4 className="text-lg font-semibold text-white mb-4">
                  What I Bring
                </h4>
                <ul className="space-y-3">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#61dafb]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <motion.a
                href={"/resume"}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#334155] text-white font-semibold rounded-full hover:border-[#61dafb] hover:bg-[#1e293b] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={18} />
                View Full Resume
              </motion.a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default About;
