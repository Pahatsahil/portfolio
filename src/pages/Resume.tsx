import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  useProfile,
  useExperience,
  useProjects,
  useSkills,
  useSocial,
  useContact,
  useEducation,
  useCertifications,
  useResumeSettings,
} from "../hooks/usePortfolioData";
import "./Resume.css";

/* ─────────────────────────────────────────────
   SMALL HELPERS
───────────────────────────────────────────── */

const Tag = ({ label }: { label: string }) => (
  <span className="resume-tag">{label}</span>
);

const SectionTitle = ({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => (
  <div className="resume-section-title">
    <span className="resume-section-icon">
      <Icon size={16} />
    </span>
    <h2>{title}</h2>
  </div>
);

/* ─────────────────────────────────────────────
   LOADING
───────────────────────────────────────────── */

const LoadingScreen = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "1rem",
    }}
  >
    <Loader2 size={40} className="text-[#61dafb] animate-spin" />
    <p className="text-gray-400 font-['Inter']">Fetching resume data…</p>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN RESUME PAGE
───────────────────────────────────────────── */

const Resume = () => {
  const resumeRef = useRef<HTMLDivElement>(null);

  const { settings, loading: sml } = useResumeSettings();
  const { profile, loading: pl } = useProfile();
  const { experiences, loading: el } = useExperience();
  const { projects, loading: jl } = useProjects();
  const { skills, loading: sl } = useSkills();
  const { socials, loading: sol } = useSocial();
  const { contact, loading: cl } = useContact();
  const { education, loading: edl } = useEducation();
  const { certifications, loading: ctl } = useCertifications();

  const isLoading = pl || el || jl || sl || sol || cl || edl || ctl || sml;

  if (isLoading) return <LoadingScreen />;

  const name = profile?.name || "";
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  const title = profile?.title || "";
  const bio = profile?.bio || "";

  const linkedin = socials.find((s) => s.platform.toLowerCase() === "linkedin");
  const github = socials.find((s) => s.platform.toLowerCase() === "github");
  const email = contact?.showEmail ? contact.email : null;
  const phone = contact?.showPhone ? contact.phone : null;

  const skillGroups = skills.reduce<Record<string, string[]>>((acc, skill) => {
    if ((skill as any).visible === false) return acc; // Skip hidden skills
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {});

  const visibleProjects = projects.filter(
    (p) => p.visible !== false && settings.projectVisibility?.[p.id] !== false,
  );

  return (
    <>
      <div
        className={`resume-wrapper theme-${settings.theme} layout-${settings.layout}`}
      >
        {/* ── Toolbar ── */}
        <div className="resume-toolbar">
          <div className="toolbar-left">
            <a href="/" className="toolbar-back">
              <ArrowLeft size={14} /> Portfolio
            </a>
            <span className="toolbar-badge">Resume</span>
            <div className="toolbar-live">
              <div className="toolbar-live-dot" />
              Live from Firebase
            </div>
          </div>
          <button className="btn-download" onClick={() => window.print()}>
            <Download size={14} />
            Download PDF
          </button>
        </div>

        {/* ── Resume Card ── */}
        <div className="resume-page-wrap">
          <motion.div
            className="resume-card"
            ref={resumeRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* ────── HEADER ────── */}
            <div className="resume-header">
              <div className="header-grid">
                <div>
                  <div className="resume-title-badge">
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#61dafb",
                        display: "inline-block",
                      }}
                    />
                    {title}
                  </div>
                  <div className="resume-name">
                    <span className="name-first">{firstName}</span>{" "}
                    <span className="name-last">{lastName}</span>
                  </div>
                  <div className="resume-contact-row">
                    {email && (
                      <a href={`mailto:${email}`} className="contact-item">
                        <Mail size={12} /> {email}
                      </a>
                    )}
                    {phone && (
                      <a href={`tel:${phone}`} className="contact-item">
                        <Phone size={12} /> {phone}
                      </a>
                    )}
                    {/* {profile?.location && (
                      <span className="contact-item">
                        <MapPin size={12} /> {profile.location}
                      </span>
                    )} */}
                    {linkedin && (
                      <a
                        href={linkedin.url}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-item"
                      >
                        <Linkedin size={12} /> LinkedIn
                      </a>
                    )}
                    {github && (
                      <a
                        href={github.url}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-item"
                      >
                        <Github size={12} /> GitHub
                      </a>
                    )}
                  </div>
                </div>
                <div className="header-qr-stack">
                  <div className="header-availability">
                    <div className="header-availability-dot" />
                    Open to work
                  </div>
                </div>
              </div>
            </div>

            {/* ────── BODY (sidebar + main) ────── */}
            <div className="resume-body">
              {/* ── SIDEBAR ── */}
              <div className="resume-sidebar">
                {/* Skills */}
                {settings.showSkills && Object.keys(skillGroups).length > 0 && (
                  <div className="sidebar-section sidebar-section-skills">
                    <SectionTitle icon={Code2} title="Skills" />
                    {Object.entries(skillGroups).map(([cat, items]) => (
                      <div key={cat} className="skill-group">
                        <div className="skill-category">{cat}</div>
                        <div className="skill-tags">
                          {items.map((item) => (
                            <Tag key={item} label={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {settings.showEducation && education.length > 0 && (
                  <div className="sidebar-section sidebar-section-education">
                    <SectionTitle icon={GraduationCap} title="Education" />
                    {education.map((edu) => (
                      <div key={edu.id} className="sidebar-item">
                        <div className="sidebar-item-title">{edu.degree}</div>
                        <div className="sidebar-item-sub">
                          {edu.institution}
                        </div>
                        {edu.grade && (
                          <div className="sidebar-item-sub">
                            Grade: {edu.grade}
                          </div>
                        )}
                        <div className="sidebar-item-year">{edu.year}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {settings.showCerts && certifications.length > 0 && (
                  <div className="sidebar-section sidebar-section-certs">
                    <SectionTitle icon={Award} title="Certifications" />
                    {certifications.map((cert) => (
                      <div key={cert.id} className="sidebar-item">
                        <div className="sidebar-item-title">
                          {cert.url ? (
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                              }}
                            >
                              {cert.name}{" "}
                              <ExternalLink
                                size={10}
                                style={{
                                  display: "inline",
                                  verticalAlign: "middle",
                                }}
                              />
                            </a>
                          ) : (
                            cert.name
                          )}
                        </div>
                        <div className="sidebar-item-sub">{cert.issuer}</div>
                        <div className="sidebar-item-year">{cert.year}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── MAIN COLUMN ── */}
              <div className="resume-main">
                {/* Summary */}
                {settings.showBio && <div className="resume-bio">{bio}</div>}

                {/* Experience */}
                {experiences.length > 0 && (
                  <div className="resume-section resume-section-exp">
                    <SectionTitle icon={Briefcase} title="Experience" />
                    {experiences.map((exp) => (
                      <div key={exp.id} className="exp-item">
                        <div className="exp-header">
                          <div className="exp-title">{exp.title}</div>
                          <div className="exp-period">{exp.period}</div>
                        </div>
                        <div className="exp-company">{exp.company}</div>
                        <ul className="exp-bullets">
                          {exp.highlights
                            .slice(
                              0,
                              settings.jobLimits[exp.id] ??
                                exp.highlights.length,
                            )
                            .map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {settings.showProjects && visibleProjects.length > 0 && (
                  <div className="resume-section resume-section-projects">
                    <SectionTitle icon={Code2} title="Projects" />
                    {visibleProjects.map((p) => (
                      <div key={p.id} className="project-item">
                        <div className="project-header">
                          <span className="project-name">{p.title}</span>
                          {p.githubUrl && (
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="project-link"
                            >
                              <Github size={10} /> Code
                            </a>
                          )}
                          {p.playStoreUrl && (
                            <a
                              href={p.playStoreUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="project-link"
                            >
                              <ExternalLink size={10} /> Play Store
                            </a>
                          )}
                          {p.appStoreUrl && (
                            <a
                              href={p.appStoreUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="project-link"
                            >
                              <ExternalLink size={10} /> App Store
                            </a>
                          )}
                        </div>
                        <div className="project-tech">{p.tech.join(" · ")}</div>
                        <div className="project-desc">{p.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Resume;
