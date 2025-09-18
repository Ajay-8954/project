import React, { useState, useEffect } from "react";
import {
  RocketIcon,
  FileTextIcon,
  SearchIcon,
  ArrowRightIcon,
  Star,
  UploadCloud,
  ScanLine,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { PenTool } from "lucide-react";

// Framer Motion Variants for animations
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [autoRotateIndex, setAutoRotateIndex] = useState(0);


  const handleCreateResumeClick = () => {
    if (isAuthenticated) {
      navigate("/resume-builder");
    } else {
      navigate("/login", { state: { from: "/resume-builder" } });
    }
  };

  const handleAnalyzeResume = () => {
    if (isAuthenticated) {
      navigate("/analyze");
    } else {
      navigate("/login", { state: { from: "/analyze" } });
    }
  };

  const features = [
    {
      icon: FileTextIcon,
      title: "Intelligent Resume Builder",
      desc: "Effortlessly create a professional, ATS-optimized resume. Our smart editor guides you to include what matters most.",
      color: '142, 202, 252',
    },
    {
      icon: SearchIcon,
      title: "Instant JD Analysis",
      desc: "Pinpoint keyword gaps and score your resume's match against any job description in seconds.",
      color: '142, 252, 204',
    },
    {
      icon: RocketIcon,
      title: "AI-Powered Optimization",
      desc: "Get concrete, actionable feedback to enhance your resume, boost your score, and secure more interviews.",
      color: '252, 208, 142',
    },
    {
      icon: PenTool,
      title: "Smart Templates",
      desc: "Choose from professionally designed templates optimized for different industries and roles.",
      color: '204, 142, 252',
    },
    {
      icon: SearchIcon,
      title: "Real-time Feedback",
      desc: "Get instant suggestions as you build your resume to maximize impact and readability.",
      color: '252, 142, 239',
    },
  ];

  const testimonials = [
    {
      quote:
        "This tool was a game-changer. I went from getting no responses to landing three interviews in one week. The AI feedback is spot-on.",
      name: "Sarah L.",
      title: "Software Engineer",
    },
    {
      quote:
        "As a recent graduate, I had no idea how to write a resume that would pass ATS. ResumeMatcher made it simple and effective.",
      name: "Michael B.",
      title: "Marketing Graduate",
    },
    {
      quote:
        "The JD matching feature is brilliant. It helped me tailor my resume for each application and finally get noticed by my dream company.",
      name: "Jessica P.",
      title: "Project Manager",
    },
  ];

    // Auto rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Only rotate if no card is being hovered
      if (hoveredIndex === null) {
        setAutoRotateIndex((prev) => (prev + 1) % features.length);
      }
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, [hoveredIndex, features.length]);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9D6FF,#ffffff)]"></div>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <div className="text-center md:text-left">
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tighter"
            >
              Stop Getting Rejected by{" "}
              <span className="text-blue-600">Robots.</span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="mt-6 max-w-xl text-lg text-slate-600 mx-auto md:mx-0"
            >
              Your resume's first hurdle isn't a person—it's an algorithm. We
              give you the tools to craft an ATS-beating resume that recruiters
              can't ignore.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4"
            >
              <div className="flex gap-4">
                <button
                  className="group flex items-center justify-center px-6 py-3 text-white bg-blue-500 hover:bg-purple-400 rounded-lg text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
                  onClick={handleCreateResumeClick}
                >
                  <PenTool
                    className="mr-2 transition-transform duration-300 group-hover:rotate-12"
                    size={20}
                  />
                  Create New Resume
                </button>
                <button
                  className="group flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 bg-green-400 hover:bg-slate-400 rounded-lg text-lg font-semibold shadow-sm transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
                  onClick={handleAnalyzeResume}
                >
                  <Sparkles
                    className="mr-2 transition-transform duration-300 group-hover:rotate-12"
                    size={20}
                  />
                  Analyze Existing
                </button>
              </div>
            </motion.div>
          </div>
          <motion.div
            variants={fadeIn}
            className="hidden md:flex items-center justify-center gap-4"
          >
            <div className="p-4 bg-white rounded-2xl shadow-lg shadow-slate-500/10 border border-slate-200 w-1/2">
              <div className="text-center font-bold text-red-500 mb-2">
                BEFORE
              </div>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                <div className="h-8 bg-red-200/50 border border-red-400 rounded-lg mt-4 flex items-center justify-center">
                  <span className="text-red-700 font-bold">ATS Score: 47%</span>
                </div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
              </div>
            </div>
            <ArrowRightIcon className="text-blue-500 flex-shrink-0" size={32} />
            <div className="p-4 bg-white rounded-2xl shadow-2xl shadow-blue-500/20 border-2 border-blue-500 w-1/2 transform scale-110">
              <div className="text-center font-bold text-green-500 mb-2">
                AFTER
              </div>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                <div className="h-8 bg-green-200/50 border border-green-500 rounded-lg mt-4 flex items-center justify-center">
                  <span className="text-green-700 font-bold">
                    ✓ ATS Score: 92%
                  </span>
                </div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3D Carousel Features Section */}
      {/* 3D Carousel Features Section */}
<section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50">
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={staggerContainer}
    className="max-w-6xl mx-auto"
  >
    <motion.h2
      variants={fadeIn}
      className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4"
    >
      A Smarter Way to Job Hunt
    </motion.h2>
    <motion.p
      variants={fadeIn}
      className="text-lg text-center text-slate-600 mb-16 max-w-2xl mx-auto"
    >
      Our platform provides a complete toolkit to take you from
      application to interview.
    </motion.p>
    
    <div
      className="relative w-full h-[500px] flex items-center justify-center"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {features.map((feature, index) => {
        const total = features.length;
        
        // Calculate the position difference from the center
        let positionDiff = (index - autoRotateIndex + total) % total;
        if (positionDiff > total / 2) positionDiff -= total;
        
        // Calculate rotation and position based on autoRotateIndex
        const rotationOffset = positionDiff * (360 / total);
        const xOffset = positionDiff * 40;
        const scale = positionDiff === 0 ? 1.1 : 0.9;
        const opacity = positionDiff === 0 ? 1 : 0.6;
        const zIndex = positionDiff === 0 ? 10 : 1;

        return (
          <motion.div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            animate={{
              opacity: hoveredIndex === null ? opacity : (hoveredIndex === index ? 1 : 0.6),
              scale: hoveredIndex === null ? scale : (hoveredIndex === index ? 1.15 : 0.9),
              x: hoveredIndex === null ? xOffset : (hoveredIndex === index ? 0 : xOffset),
              rotateY: hoveredIndex === null ? rotationOffset : (hoveredIndex === index ? 0 : rotationOffset),
              zIndex: hoveredIndex === null ? zIndex : (hoveredIndex === index ? 20 : zIndex),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              transformOrigin: "center center",
              transformStyle: 'preserve-3d',
              background: `linear-gradient(135deg, rgba(${feature.color}, 1), rgba(${feature.color}, 1))`,
              borderColor: `rgba(${feature.color}, 0.8)`,
              boxShadow: positionDiff === 0
                ? `0px 20px 40px rgba(${feature.color}, 0.4)`
                : `0px 5px 15px rgba(0, 0, 0, 0.05)`,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-60 h-73 md:w-65 md:h-75 p-6 rounded-3xl border 
                       backdrop-blur-sm transform-style-3d cursor-pointer
                       transition-all duration-300 z-auto"
          >
            <div className="flex flex-col items-center justify-center text-center h-full">
              <motion.div
                animate={{
                  scale: positionDiff === 0 ? 1.2 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="mb-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: `rgba(${feature.color}, 0.8)`,
                  border: `2px solid rgba(255, 255, 255, 0.4)`,
                }}
              >
                <feature.icon
                  className="text-white"
                  size={32}
                />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-snug">
                {feature.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
</section>

      {/* Rest of the component remains the same */}
      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-8 bg-slate-50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-16"
          >
            Get Hired in 3 Simple Steps
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {[
              { icon: UploadCloud, text: "Create or Upload" },
              { icon: ScanLine, text: "Analyze & Score" },
              { icon: Send, text: "Optimize & Apply" },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="flex flex-col items-center"
              >
                <div className="mb-4 bg-white border-4 border-blue-500 p-5 rounded-full text-blue-600">
                  <step.icon size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-1">
                  {step.text}
                </h3>
                <p className="text-2xl font-bold text-slate-300">{`0${
                  i + 1
                }`}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section className="bg-white py-20 px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12"
          >
            Trusted by Job Seekers Like You
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={fadeIn}
                className="p-8 bg-slate-50/50 rounded-2xl border border-slate-200"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-amber-400 fill-amber-400"
                      size={20}
                    />
                  ))}
                </div>
                <p className="text-slate-600 mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-slate-800">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <footer className="bg-slate-900 text-white py-20 px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Noticed?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8">
            Stop guessing and start getting interviews. Build your perfect
            resume today.
          </p>
          <button
            className="group flex items-center justify-center mx-auto px-8 py-4 bg-white text-blue-600 rounded-lg text-xl font-bold shadow-lg hover:bg-green-300 transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate("/resume-builder")}
          >
            Start Building for Free{" "}
            <ArrowRightIcon
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
              size={22}
            />
          </button>
        </motion.div>
      </footer>
    </div>
  );
};

export default Home;