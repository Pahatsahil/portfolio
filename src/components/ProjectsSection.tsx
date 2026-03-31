import { motion } from "framer-motion";
import { Github, ExternalLink, Smartphone } from "lucide-react";
import FadeIn from "./animations/FadeIn";
import type { Project } from "../hooks/usePortfolioData";

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
    <section id="projects" className="py-24 bg-[#1e293b]/30">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#61dafb] to-[#818cf8] mx-auto rounded-full" />
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              Some of the mobile applications I've built
            </p>
          </div>
        </FadeIn>

        <div className="space-y-20">
          {projects.filter(p => p.visible !== false).map((project, index) => (
            <FadeIn key={project.id} delay={index * 0.1}>
              <div
                className={`flex flex-col lg:flex-row gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Phone Mockup */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <motion.div
                    className="relative w-64 md:w-72"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="phone-frame aspect-[9/19] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-6">
                          <Smartphone
                            size={48}
                            className="text-[#61dafb] mx-auto mb-4"
                          />
                          <span className="text-gray-400 text-sm">
                            {project.title}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Floating glow */}
                    <motion.div
                      className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#61dafb]/20 to-[#818cf8]/20 rounded-full blur-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>
                </div>

                {/* Project Details */}
                <div className="w-full lg:w-1/2">
                  <motion.div
                    className="p-8 bg-[#1e293b]/50 rounded-2xl border border-[#334155] hover:border-[#61dafb]/30 transition-all"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`px-3 py-1 bg-gradient-to-r ${project.color} rounded-full text-xs font-medium text-white`}
                      >
                        {project.platform}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-[#61dafb] font-medium mb-4">
                      {project.subtitle}
                    </p>

                    <p className="text-gray-400 leading-relaxed mb-6">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-[#0f172a] rounded-lg text-sm text-gray-300 font-mono border border-[#334155]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#61dafb] font-medium hover:gap-3 transition-all"
                          whileHover={{ x: 5 }}
                        >
                          <Github size={18} />
                          View Code
                        </motion.a>
                      )}
                      {project.playStoreUrl && (
                        <motion.a
                          href={project.playStoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#818cf8] font-medium hover:gap-3 transition-all"
                          whileHover={{ x: 5 }}
                        >
                          <ExternalLink size={18} />
                          Play Store
                        </motion.a>
                      )}
                      {project.appStoreUrl && (
                        <motion.a
                          href={project.appStoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-white font-medium hover:gap-3 transition-all"
                          whileHover={{ x: 5 }}
                        >
                          <ExternalLink size={18} />
                          App Store
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
