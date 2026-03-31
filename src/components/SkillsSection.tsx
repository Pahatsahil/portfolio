import { motion } from "framer-motion";
import { Code2, Smartphone, Database, Cloud, Palette } from "lucide-react";
import FadeIn from "./animations/FadeIn";
import type { Skill } from "../hooks/usePortfolioData";

const getSkillIcon = (category: string) => {
  switch (category) {
    case "Mobile":
      return Smartphone;
    case "Database":
    case "State":
      return Database;
    case "Backend":
      return Cloud;
    case "Animation":
    case "Visualization":
      return Palette;
    default:
      return Code2;
  }
};

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  return (
    <section className="py-24 bg-[#1e293b]/30">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-4">
              Tech <span className="text-gradient">Stack</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#61dafb] to-[#818cf8] mx-auto rounded-full" />
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.filter(s => (s as any).visible !== false).map((skill, index) => {
            const IconComponent = getSkillIcon(skill.category);
            return (
              <FadeIn key={skill.id} delay={index * 0.05}>
                <motion.div
                  className="group p-4 bg-[#1e293b]/50 rounded-xl border border-[#334155] hover:border-[#61dafb] hover:bg-[#1e293b]/80 transition-all cursor-default"
                  whileHover={{ scale: 1.03, y: -2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#0f172a] group-hover:bg-[#61dafb]/10 transition-colors">
                      <IconComponent size={20} className="text-[#61dafb]" />
                    </div>
                    <div>
                      <span className="text-gray-200 font-medium text-sm">
                        {skill.name}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">{skill.category}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
