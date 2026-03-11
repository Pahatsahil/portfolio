import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Phone,
  MapPin,
  Download,
  ArrowRight,
  Code2,
  Smartphone,
  Database,
  Cloud,
  Palette,
  Briefcase,
  User,
  Send,
  ChevronDown
} from 'lucide-react';

// Project data
const projects = [
  {
    id: 1,
    title: 'Fitme App',
    subtitle: 'Home Workout Platform',
    description: 'Built a high-performance workout engine using Reanimated for fluid animations. Natively bridged audio players to sync sets and rest timers with video on demand.',
    tech: ['React Native', 'TypeScript', 'Reanimated', 'Kotlin', 'Swift'],
    platform: 'Android & iOS',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 2,
    title: 'Poshan Tracker',
    subtitle: 'Anganwadi Health Tracking',
    description: 'Developed a 3-day offline sync engine for automated data uploads and a secure Aadhaar verification module for health tracking.',
    tech: ['React Native', 'SQLite', 'Firebase', 'Android'],
    platform: 'Android',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 3,
    title: 'Vakmangids',
    subtitle: 'Service Marketplace',
    description: 'Scaled a cross-platform Subscription and Wallet system targeting the Belgium market with multi-language support.',
    tech: ['React Native', 'TypeScript', 'Redux', 'REST APIs'],
    platform: 'Android & iOS',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 4,
    title: 'MauStats',
    subtitle: 'Survey Creation & Analytics',
    description: 'Created a survey engine supporting n*n grids and complex inputs, capable of handling data for 1K+ companies offline with custom eCharts integration.',
    tech: ['React Native', 'eCharts', 'SQLite', 'TypeScript'],
    platform: 'Android & iOS',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 5,
    title: 'Cash Plus',
    subtitle: 'Beneficiary Tracking for UNICEF',
    description: 'Built an offline beneficiary tracking system to manage payment statuses with secure data encryption.',
    tech: ['React Native', 'SQLite', 'Firebase', 'Kotlin'],
    platform: 'Android & iOS',
    color: 'from-cyan-500 to-blue-600',
  },
];

// Experience data
const experiences = [
  {
    id: 1,
    title: 'Solution Developer (React Native)',
    company: 'iTechMission Private Limited',
    period: 'Mar 2025 – Present',
    location: 'India',
    highlights: [
      'Engineered native Android (Kotlin) and iOS (Swift) microphone listener services for real-time, low-latency audio analysis',
      'Architected an offline-first mobile application optimized for low-end hardware using SQLite',
      'Developed a high-performance social media app using TypeScript, reducing production runtime errors by 50%',
      'Optimized performance of a charting module using custom eCharts for online and offline mode',
    ],
  },
  {
    id: 2,
    title: 'React Native Developer',
    company: 'Cyber Vision Infotech Pvt. Ltd',
    period: 'Apr 2023 – Mar 2025',
    location: 'India',
    highlights: [
      'Increased subscription purchases by 30% through effective call-to-action notifications and App linking',
      'Created a custom native audio player in Kotlin and Swift using sophisticated React Native bridging',
      'Developed seamless animations for a high-traffic Fitness App using the Reanimated Library',
      'Integrated REST APIs using Axios and optimized React Hooks to improve rendering performance',
    ],
  },
  {
    id: 3,
    title: 'React Native Developer',
    company: 'Syscorp Inc.',
    period: 'Nov 2022 – Feb 2023',
    location: 'India',
    highlights: [
      'Enhanced warehouse management by boosting app performance by 20% with live QR scanning',
      'Developed various high-utility applications including a cashback app similar to CashKaro',
    ],
  },
];

// Skills data
const skills = [
  { name: 'React Native', icon: Smartphone, category: 'Mobile' },
  { name: 'TypeScript', icon: Code2, category: 'Languages' },
  { name: 'Android (Kotlin)', icon: Code2, category: 'Mobile' },
  { name: 'iOS (Swift)', icon: Code2, category: 'Mobile' },
  { name: 'SQLite', icon: Database, category: 'Database' },
  { name: 'Redux', icon: Database, category: 'State' },
  { name: 'Firebase', icon: Cloud, category: 'Backend' },
  { name: 'REST APIs', icon: Cloud, category: 'Backend' },
  { name: 'Reanimated', icon: Palette, category: 'Animation' },
  { name: 'eCharts', icon: Palette, category: 'Visualization' },
  { name: 'Native Modules', icon: Code2, category: 'Mobile' },
  { name: 'Git', icon: Code2, category: 'Tools' },
];

// Animation components
const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Typing effect component
const TypingEffect = ({ words, speed = 100, deleteSpeed = 50, pauseDuration = 2000 }: { words: string[]; speed?: number; deleteSpeed?: number; pauseDuration?: number }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isDeleting, words, speed, deleteSpeed, pauseDuration]);

  return (
    <span className="text-gradient">
      {currentText}
      <span className="cursor-blink text-[#61dafb]">|</span>
    </span>
  );
};

// Navbar component
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.a
          href="#"
          className="text-2xl font-bold font-['Space_Grotesk']"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gradient">SP</span>
          <span className="text-white ml-1">.dev</span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-[#61dafb] transition-colors text-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {link.name}
            </motion.a>
          ))}
          <motion.a
            href="#contact"
            className="px-5 py-2.5 bg-gradient-to-r from-[#61dafb] to-[#818cf8] text-[#0f172a] font-semibold rounded-full text-sm hover:shadow-lg hover:shadow-[#61dafb]/25 transition-all"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Talk
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass absolute top-full left-0 right-0 p-6"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-[#61dafb] transition-colors text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 px-5 py-3 bg-gradient-to-r from-[#61dafb] to-[#818cf8] text-[#0f172a] font-semibold rounded-full text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Let's Talk
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// Hero Section
const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#61dafb]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[#818cf8]/10 rounded-full blur-3xl" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e293b]/50 border border-[#334155] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#61dafb] animate-pulse" />
              <span className="text-sm text-gray-300">Available for new opportunities</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold font-['Space_Grotesk'] mb-6 leading-tight">
              Hi, I'm{' '}
              <span className="text-gradient">Sahil Pahat</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-300 mb-4">
              <TypingEffect
                words={['React Native Developer', 'Mobile App Architect', 'Cross-Platform Specialist']}
              />
            </h2>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              With 4 years of experience in cross-platform mobile development,
              I specialize in building high-performance mobile applications for Android and iOS
              using React Native, TypeScript, and native modules.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => scrollToSection('#projects')}
                className="group px-8 py-4 bg-gradient-to-r from-[#61dafb] to-[#818cf8] text-[#0f172a] font-semibold rounded-full flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(97, 218, 251, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('#contact')}
                className="px-8 py-4 border border-[#334155] text-white font-semibold rounded-full hover:bg-[#1e293b] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.button>
            </div>
          </FadeIn>

          {/* Social Links */}
          <FadeIn delay={0.5}>
            <div className="flex items-center justify-center gap-6 mt-12">
              <a
                href="https://linkedin.com/in/sahilpahat101019"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#1e293b] border border-[#334155] hover:border-[#61dafb] hover:bg-[#1e293b]/80 transition-all group"
              >
                <Linkedin size={20} className="text-gray-400 group-hover:text-[#61dafb] transition-colors" />
              </a>
              <a
                href="https://github.com/Pahatsahil"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#1e293b] border border-[#334155] hover:border-[#61dafb] hover:bg-[#1e293b]/80 transition-all group"
              >
                <Github size={20} className="text-gray-400 group-hover:text-[#61dafb] transition-colors" />
              </a>
              <a
                href="mailto:sahilpahat12@gmail.com"
                className="p-3 rounded-full bg-[#1e293b] border border-[#334155] hover:border-[#61dafb] hover:bg-[#1e293b]/80 transition-all group"
              >
                <Mail size={20} className="text-gray-400 group-hover:text-[#61dafb] transition-colors" />
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={32} className="text-gray-500" />
        </motion.div>
      </div>
    </section>
  );
};

// About Section
const About = () => {
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
                    <User size={64} className="text-[#61dafb] mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">React Native Developer</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Passionate about building high-performance mobile applications with seamless user experiences.
                      I bridge the gap between design and technology to create apps that users love.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '4+', label: 'Years Experience' },
                  { number: '15+', label: 'Projects Completed' },
                  { number: '10+', label: 'Happy Clients' },
                  { number: '500K+', label: 'App Downloads' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="p-6 bg-[#1e293b]/50 rounded-2xl border border-[#334155] hover:border-[#61dafb]/50 transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-3xl font-bold text-gradient mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 bg-[#1e293b]/50 rounded-2xl border border-[#334155]">
                <h4 className="text-lg font-semibold text-white mb-4">What I Bring</h4>
                <ul className="space-y-3">
                  {[
                    'Cross-platform mobile development',
                    'Native module integration (Kotlin/Swift)',
                    'Performance optimization',
                    'Offline-first architecture',
                    'State management & database design',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-[#61dafb]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <motion.a
                href="user_input_files/Sahil Pahat - Resume.pdf.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#334155] text-white font-semibold rounded-full hover:border-[#61dafb] hover:bg-[#1e293b] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={18} />
                Download Resume
              </motion.a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// Skills Section
const Skills = () => {
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
          {skills.map((skill, index) => (
            <FadeIn key={skill.name} delay={index * 0.05}>
              <motion.div
                className="group p-4 bg-[#1e293b]/50 rounded-xl border border-[#334155] hover:border-[#61dafb] hover:bg-[#1e293b]/80 transition-all cursor-default"
                whileHover={{ scale: 1.03, y: -2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#0f172a] group-hover:bg-[#61dafb]/10 transition-colors">
                    <skill.icon size={20} className="text-[#61dafb]" />
                  </div>
                  <span className="text-gray-200 font-medium">{skill.name}</span>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// Experience Section
const Experience = () => {
  return (
    <section id="experience" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-4">
              Work <span className="text-gradient">Experience</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#61dafb] to-[#818cf8] mx-auto rounded-full" />
          </div>
        </FadeIn>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#61dafb] via-[#818cf8] to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <FadeIn key={exp.id} delay={index * 0.1}>
                <div className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-[#61dafb] transform -translate-x-1/2 mt-2">
                    <div className="absolute inset-0 rounded-full bg-[#61dafb] animate-ping opacity-30" />
                  </div>

                  {/* Content */}
                  <div className={`ml-8 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                  }`}>
                    <motion.div
                      className="p-6 bg-[#1e293b]/50 rounded-2xl border border-[#334155] hover:border-[#61dafb]/30 transition-all"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                          <p className="text-[#61dafb] font-medium">{exp.company}</p>
                        </div>
                        <span className="px-3 py-1 bg-[#0f172a] rounded-full text-sm text-gray-400">
                          {exp.period}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <MapPin size={14} />
                        {exp.location}
                      </div>

                      <ul className="space-y-2">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] mt-1.5 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Projects Section
const Projects = () => {
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
          {projects.map((project, index) => (
            <FadeIn key={project.id} delay={index * 0.1}>
              <div className={`flex flex-col lg:flex-row gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Phone Mockup */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <motion.div
                    className="relative w-64 md:w-72"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="phone-frame aspect-[9/19] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <div className="text-center p-6">
                        <Smartphone size={48} className="text-[#61dafb] mx-auto mb-4" />
                        <span className="text-gray-400 text-sm">{project.title}</span>
                      </div>
                    </div>
                    {/* Floating elements */}
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
                      <span className={`px-3 py-1 bg-gradient-to-r ${project.color} rounded-full text-xs font-medium text-white`}>
                        {project.platform}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-[#61dafb] font-medium mb-4">{project.subtitle}</p>

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
                      <motion.button
                        className="flex items-center gap-2 text-[#61dafb] font-medium hover:gap-3 transition-all"
                        whileHover={{ x: 5 }}
                      >
                        <Github size={18} />
                        View Code
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-2 text-[#818cf8] font-medium hover:gap-3 transition-all"
                        whileHover={{ x: 5 }}
                      >
                        <ExternalLink size={18} />
                        Live Demo
                      </motion.button>
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

// Contact Section
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-4">
              Get In <span className="text-gradient">Touch</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#61dafb] to-[#818cf8] mx-auto rounded-full" />
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              Have a project in mind? Let's discuss how we can work together
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <FadeIn>
            <div className="space-y-8">
              <div className="p-8 bg-[#1e293b]/50 rounded-2xl border border-[#334155]">
                <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>

                <div className="space-y-6">
                  <a
                    href="mailto:sahilpahat12@gmail.com"
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#0f172a]/50 hover:bg-[#0f172a] transition-colors group"
                  >
                    <div className="p-3 rounded-xl bg-[#61dafb]/10 group-hover:bg-[#61dafb]/20 transition-colors">
                      <Mail size={24} className="text-[#61dafb]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">sahilpahat12@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="tel:+919873371012"
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#0f172a]/50 hover:bg-[#0f172a] transition-colors group"
                  >
                    <div className="p-3 rounded-xl bg-[#818cf8]/10 group-hover:bg-[#818cf8]/20 transition-colors">
                      <Phone size={24} className="text-[#818cf8]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-white font-medium">+91 9873371012</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0f172a]/50">
                    <div className="p-3 rounded-xl bg-[#61dafb]/10">
                      <MapPin size={24} className="text-[#61dafb]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="text-white font-medium">India</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[#334155]">
                  <p className="text-gray-400 mb-4">Find me on</p>
                  <div className="flex gap-4">
                    <a
                      href="https://linkedin.com/in/sahilpahat101019"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] transition-colors group"
                    >
                      <Linkedin size={20} className="text-gray-400 group-hover:text-[#61dafb] transition-colors" />
                    </a>
                    <a
                      href="https://github.com/Pahatsahil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] transition-colors group"
                    >
                      <Github size={20} className="text-gray-400 group-hover:text-[#61dafb] transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Contact Form */}
          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit} className="p-8 bg-[#1e293b]/50 rounded-2xl border border-[#334155]">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-white focus:border-[#61dafb] focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-white focus:border-[#61dafb] focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-white focus:border-[#61dafb] focus:outline-none transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-white focus:border-[#61dafb] focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#61dafb] to-[#818cf8] text-[#0f172a] font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <span>Message Sent!</span>
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </motion.button>

                {submitStatus === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-emerald-400"
                  >
                    Thanks for reaching out! I'll get back to you soon.
                  </motion.p>
                )}
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-12 border-t border-[#334155]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-['Space_Grotesk']">
              <span className="text-gradient">SP</span>
              <span className="text-white">.dev</span>
            </span>
          </div>

          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Sahil Pahat. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/sahilpahat101019"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-[#1e293b] transition-colors"
            >
              <Linkedin size={18} className="text-gray-400 hover:text-[#61dafb] transition-colors" />
            </a>
            <a
              href="https://github.com/Pahatsahil"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-[#1e293b] transition-colors"
            >
              <Github size={18} className="text-gray-400 hover:text-[#61dafb] transition-colors" />
            </a>
            <a
              href="mailto:sahilpahat12@gmail.com"
              className="p-2 rounded-full hover:bg-[#1e293b] transition-colors"
            >
              <Mail size={18} className="text-gray-400 hover:text-[#61dafb] transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App
function App() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
