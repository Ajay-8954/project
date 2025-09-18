import { useState } from "react";
// ADD THESE IMPORTS
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, Building, Sparkles } from "lucide-react";

import {
  UploadCloud,
  GaugeCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  Palette,
  Target,
  PenTool,
  BookOpen,
  Wand2,
  Download,
  RefreshCw,
  Clipboard,
  BrainCircuit,
  ArrowUp,
  BarChart as BarChartIcon,
  Trash2,
} from "lucide-react";
import useResumeStore from "../store/useResumeStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// --- UI/UX ENHANCEMENT: Static color mapping for Tailwind CSS ---
// This prevents issues with dynamic class name purging in production builds.
const categoryStyles = {
  tailoring: {
    icon: Target,
    title: "Tailoring",
    styles: {
      border: "border-blue-200",
      text: "text-blue-800",
      hoverBg: "hover:bg-blue-50",
      icon: "text-blue-500",
    },
  },
  format: {
    icon: FileText,
    title: "Format",
    styles: {
      border: "border-purple-200",
      text: "text-purple-800",
      hoverBg: "hover:bg-purple-50",
      icon: "text-purple-500",
    },
  },
  content: {
    icon: BookOpen,
    title: "Content",
    styles: {
      border: "border-green-200",
      text: "text-green-800",
      hoverBg: "hover:bg-green-50",
      icon: "text-green-500",
    },
  },
  sections: {
    icon: PenTool,
    title: "Sections",
    styles: {
      border: "border-yellow-200",
      text: "text-yellow-800",
      hoverBg: "hover:bg-yellow-50",
      icon: "text-yellow-500",
    },
  },
  style: {
    icon: Palette,
    title: "Style",
    styles: {
      border: "border-red-200",
      text: "text-red-800",
      hoverBg: "hover:bg-red-50",
      icon: "text-red-500",
    },
  },
};

const AnalysisCategory = ({ categoryKey, data }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { icon: Icon, title, styles } = categoryStyles[categoryKey];
  const scoreColor =
    data.score >= 80
      ? "text-green-600"
      : data.score >= 60
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div
      className={`mb-4 border ${styles.border} rounded-lg shadow-sm bg-white overflow-hidden`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center px-4 py-3 font-semibold text-left ${styles.text} ${styles.hoverBg} transition-colors duration-200`}
      >
        <span className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${styles.icon}`} />
          <span>{title}</span>
        </span>
        <div className="flex items-center gap-4">
          <span className={`text-xl font-bold ${scoreColor}`}>
            {data.score}
            <span className="text-sm text-gray-500">/100</span>
          </span>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <p className="mb-4 text-sm text-gray-600 italic">"{data.feedback}"</p>
          <ul className="space-y-2">
            {data.details.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                {item.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span className="font-semibold">{item.criterion}:</span>
                  <span className="ml-1 text-gray-700">{item.comment}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- UI/UX ENHANCEMENT 1: Engaging loading animation ---
const EngagingLoader = () => (
  <div className="relative w-40 h-40">
    <div className="absolute inset-0 rounded-full border-2 border-purple-300 opacity-50 animate-pulse"></div>
    <div
      className="absolute inset-3 rounded-full border-2 border-purple-400 opacity-50 animate-pulse"
      style={{ animationDelay: "0.2s" }}
    ></div>
    <div
      className="absolute inset-6 rounded-full border-2 border-purple-500 opacity-50 animate-pulse"
      style={{ animationDelay: "0.4s" }}
    ></div>
    <div
      className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent to-purple-500 origin-left animate-spin"
      style={{ animationDuration: "2s" }}
    ></div>
  </div>
);

const LoadingView = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-purple-600">
    <EngagingLoader />
    <p className="text-2xl font-medium mt-8 tracking-wider text-gray-700">
      ANALYZING YOUR FUTURE...
    </p>
    <p className="text-gray-500 mt-2">
      Our AI is meticulously scanning your resume.
    </p>
  </div>
);

const InitialUploadView = ({
  resumeFile,
  setResumeFile,
  handleInitialAnalysis,
  error,
  reset,
  jdText,
  setJdText,
}) => {
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    isError: false,
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragIn = (e) => {
    handleDrag(e);
    if (e.dataTransfer.items?.length > 0) setIsDragging(true);
  };
  const handleDragOut = (e) => {
    handleDrag(e);
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    handleDrag(e);
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      setResumeFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const Popup = ({ message, isError, onClose }) => (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${
          isError
            ? "bg-red-100 border border-red-200"
            : "bg-green-100 border border-green-200"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <p
            className={`font-semibold ${
              isError ? "text-red-800" : "text-green-800"
            }`}
          >
            {message}
          </p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close popup"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const Feature = ({ icon: Icon, title, description, delay }) => (
    <motion.div
      className="flex items-start gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex-shrink-0 h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-purple-300" />
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-purple-200 text-sm">{description}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 p-8 lg:p-12 flex flex-col justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold">Beat the Bots.</h1>
          <h2 className="text-4xl lg:text-5xl font-bold text-purple-300">
            Land the Interview.
          </h2>
          <p className="mt-4 text-lg text-purple-200">
            Our AI-powered checker analyzes your resume against any job
            description, giving you the insights you need to get noticed.
          </p>
        </motion.div>

        <div className="mt-12 space-y-8">
          <Feature
            icon={Target}
            title="Targeted Keyword Analysis"
            description="Find out exactly which keywords are missing from your resume."
            delay={0.2}
          />
          <Feature
            icon={BarChartIcon}
            title="Instant Match Score"
            description="Get a score from 0-100 to see how well you match the job."
            delay={0.4}
          />
          <Feature
            icon={Wand2}
            title="AI-Powered Optimization"
            description="Receive actionable advice and let our AI help you improve your resume."
            delay={0.6}
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-slate-800 text-center">
            Start Your Analysis
          </h3>

          <h1 className="text-[10px] font-bold text-red-500 text-center">
            Note: Only upload a .docx file if you want to fix your resume.
          </h1>
          <br></br>

          <div>
            <label className="font-semibold text-slate-700 flex items-center gap-2 mb-2">
              <span>1. Upload Your Resume</span>
            </label>
            <label
              htmlFor="resume-upload"
              className={`relative flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg cursor-pointer border-2 border-dashed  transition-all duration-300
                                ${
                                  isDragging
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-slate-300 hover:border-slate-400"
                                }
                                ${
                                  resumeFile
                                    ? "border-green-500 bg-green-50"
                                    : ""
                                }`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <AnimatePresence mode="wait">
                {resumeFile ? (
                  <motion.div
                    key="uploaded"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600 mb-2" />
                    <p className="text-green-800 font-semibold">
                      {resumeFile.name}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setResumeFile(null);
                      }}
                      className="mt-2 text-sm text-red-500 hover:underline flex items-center gap-1 z-10"
                    >
                      <Trash2 size={14} /> Change file
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="waiting"
                    className="flex flex-col items-center text-center pointer-events-none"
                  >
                    <UploadCloud
                      className={`w-10 h-10 mb-2 transition-colors ${
                        isDragging ? "text-purple-500" : "text-green-700"
                      }`}
                    />
                    <span
                      className={`font-medium transition-colors ${
                        isDragging ? "text-purple-600" : "text-slate-600"
                      }`}
                    >
                      Drag & drop or click to upload
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="jd"
              className="font-semibold text-slate-700 flex items-center gap-2 mb-2"
            >
              <span>2. Paste Job Description</span>
            </label>
            <textarea
              id="jd"
              rows="6"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
              placeholder="Paste the job description here..."
            />
          </div>

          {/* Sample Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="./public/sample-resume.docx"
              download="sample-resume.docx"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Download a sample resume document"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Download className="w-5 h-5" />
              <span>Sample Resume</span>
            </motion.a>
            <motion.button
              onClick={async () => {
                try {
                  const response = await fetch(
                    "./public/sample-job-description.txt"
                  );
                  const text = await response.text();
                  await navigator.clipboard.writeText(text);
                  setPopup({
                    show: true,
                    message: "Sample job description copied to clipboard!",
                    isError: false,
                  });
                } catch (err) {
                  console.error("Failed to copy sample job description:", err);
                  setPopup({
                    show: true,
                    message:
                      "Failed to copy sample job description. Please try again.",
                    isError: true,
                  });
                }
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Copy a sample job description to clipboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Clipboard className="w-5 h-5" />
              <span>Copy Sample Job Description</span>
            </motion.button>
          </div>

          {/* Popup for copy feedback */}
          <AnimatePresence>
            {popup.show && (
              <Popup
                message={popup.message}
                isError={popup.isError}
                onClose={() =>
                  setPopup({ show: false, message: "", isError: false })
                }
              />
            )}
          </AnimatePresence>

          {error && (
            <p className="text-sm text-red-600 text-center bg-red-100 p-3 rounded-md border border-red-200">
              ❌ {error}
            </p>
          )}

          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              onClick={handleInitialAnalysis}
              disabled={!resumeFile || !jdText.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white text-md font-semibold rounded-md hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <BrainCircuit size={18} />
              <span>Analyze My Resume</span>
            </button>
            <button
              onClick={reset}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
            >
              <RefreshCw size={14} /> Start Over
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const KeywordChart = ({ keywordGaps }) => {
  if (!keywordGaps) return null;
  const data = [
    {
      name: "Keywords Fit",
      Matched:
        (keywordGaps.present_keywords?.length || 0) +
        (keywordGaps.matched_qualifications?.length || 0),
      Missing:
        (keywordGaps.missing_keywords?.length || 0) +
        (keywordGaps.missing_qualifications?.length || 0),
    },
  ];
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border">
      <h4 className="font-semibold text-lg mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
        <BarChartIcon size={20} /> Resume vs. Job Description Fit
      </h4>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={data} layout="vertical" barSize={30}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip cursor={{ fill: "rgba(240, 240, 240, 0.5)" }} />
          <Legend wrapperStyle={{ position: "relative", marginTop: "10px" }} />
          <Bar
            dataKey="Matched"
            stackId="a"
            fill="#16a34a"
            name="Matched Keywords"
          />
          <Bar
            dataKey="Missing"
            stackId="a"
            fill="#dc2626"
            name="Missing Keywords"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const AnalysisView = ({
  analysis,
  keywordGaps,
  handleGenerateQuestions,
  error,
}) => {
  const score = analysis?.overall_score;
  const scoreColor =
    score >= 80
      ? "text-green-600"
      : score >= 60
      ? "text-yellow-600"
      : "text-red-600";
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartOptimization = async () => {
    setIsGenerating(true);
    await handleGenerateQuestions();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Resume vs. Job Description Match
        </h3>
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Overall Match Score</p>
          <div className={`text-6xl font-bold ${scoreColor}`}>
            {score}
            <span className="text-3xl text-gray-400">/100</span>
          </div>
          <p className="mt-2 text-gray-700 font-medium max-w-2xl mx-auto">
            {analysis?.summary}
          </p>
        </div>

        {keywordGaps && <KeywordChart keywordGaps={keywordGaps} />}

        {keywordGaps && (
          <div className="mb-6 border-t pt-4">
            <h4 className="font-semibold text-lg mb-2 text-gray-800">
              Keyword Gap Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <h5 className="font-bold text-red-700 mb-2">
                  Missing Keywords & Qualifications
                </h5>
                <div className="flex flex-wrap gap-2">
                  {keywordGaps.missing_keywords?.map((kw) => (
                    <span
                      key={kw}
                      className="bg-red-200 text-red-800 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                {keywordGaps.missing_qualifications?.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-red-700 mt-3">
                    {keywordGaps.missing_qualifications.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-green-50 p-3 rounded-md border border-green-200">
                <h5 className="font-bold text-green-700 mb-2">
                  Matched Keywords & Qualifications
                </h5>
                <div className="flex flex-wrap gap-2">
                  {keywordGaps.present_keywords?.map((kw) => (
                    <span
                      key={kw}
                      className="bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                {keywordGaps.matched_qualifications?.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-green-700 mt-3">
                    {keywordGaps.matched_qualifications.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="max-h-[500px] overflow-y-auto pr-2">
          {analysis &&
            Object.entries(analysis.analysis_breakdown).map(([key, value]) => (
              <AnalysisCategory key={key} categoryKey={key} data={value} />
            ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Ready to Improve Your Score?
        </h3>
        <p className="text-gray-600 mb-4">
          Let's generate targeted questions to fill the gaps we found and
          optimize your resume.
        </p>
        <button
          onClick={handleStartOptimization}
          disabled={isGenerating}
          className="flex items-center justify-center mx-auto gap-3 py-3 px-6 bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-green-700 disabled:bg-green-400 transition-all transform hover:scale-105"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" /> Generating Questions...
            </>
          ) : (
            <>
              <Wand2 /> Start Optimization
            </>
          )}
        </button>
        {error && (
          <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-md mt-4">
            ❌ {error}
          </p>
        )}
      </div>
    </div>
  );
};

const OptimizerView = ({
  questions,
  answers,
  setAnswer,
  handleOptimize,
  error,
}) => (
  <div className="h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 overflow-hidden">
    {/* Left Section (Fixed Sidebar on md+ screens) */}
    <div className="hidden md:block md:w-2/5 lg:w-1/3 flex-shrink-0 h-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-r border-gray-700">
      <div className="h-full flex items-center justify-center p-6 w-full">
        <div className="bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center text-center">
          <Briefcase className="w-12 h-12 text-purple-400 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white">Resume Power-Up</h3>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            Craft powerful, metric-driven bullet points that highlight your
            impact and get noticed by recruiters.
          </p>
          <div className="mt-4 w-full h-20 rounded-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 flex items-center justify-center text-sm font-semibold text-purple-200 shadow-inner">
            🚀 Level Up Your Career
          </div>
        </div>
      </div>
    </div>

    {/* Right Section (Full width on mobile, shifted on desktop) */}
    <div className="flex-1 flex flex-col overflow-hidden w-full md:ml-0 md:w-3/5 lg:w-2/3">
      <header className="shrink-0 text-center space-y-2 bg-slate-50 text-black py-4 px-6 border-b border-gray-700">
        <h2 className="text-2xl font-extrabold text-black tracking-tight">
          <Sparkles className="inline-block w-6 h-6 text-purple-400 mr-2 animate-pulse" />
          Resume Optimizer
        </h2>
        <p className="text-black text-sm max-w-lg mx-auto">
          Answer a few focused questions to transform your experience into
          strong, results-driven resume points.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {questions.map((q, i) => (
          <div key={i} className="space-y-2">
            <label className="text-base font-semibold text-black flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-1">{i + 1}.</span>
              <span>{q.question}</span>
            </label>
            <input
              type="text"
              value={answers[q.question] || ""}
              onChange={(e) => setAnswer(q.question, e.target.value)}
              className="w-full p-3 bg-slate-50 text-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              placeholder={"For example: " + q.example || "Your specific, quantifiable answer..."}
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="shrink-0 px-6 pb-4">
          <div className="text-sm text-red-400 text-center bg-red-900/50 border border-red-700 p-3 rounded-lg">
            <p className="flex items-center justify-center gap-2">⚠️ {error}</p>
          </div>
        </div>
      )}

      <div className="shrink-0 p-6 pt-0 bg-slate-50">
        <button
          onClick={handleOptimize}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <ArrowRight className="w-5 h-5" />
          Create My Optimized Resume
        </button>
      </div>
    </div>
  </div>
);

const ScoreImprovement = ({ oldScore, newScore }) => {
  if (oldScore === null || newScore === null || oldScore === newScore)
    return null;
  const improvement = newScore - oldScore;
  const improvementColor = improvement > 0 ? "text-green-500" : "text-red-500";
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 my-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Old Score</span>
        <span className="text-3xl font-bold text-gray-400">{oldScore}</span>
      </div>
      <div className={`flex flex-col items-center ${improvementColor}`}>
        <ArrowUp
          className={`w-8 h-8 ${improvement < 0 ? "transform rotate-180" : ""}`}
        />
        <span className="font-bold text-lg">
          {improvement > 0 ? `+${improvement}` : improvement}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className={`text-xs ${improvementColor}`}>New Score</span>
        <span className={`text-5xl font-bold ${improvementColor}`}>
          {newScore}
        </span>
      </div>
    </div>
  );
};

const EnhancementsSummary = ({ answers }) => {
  const enhancements = [
    "Refined bullet points for quantifiable impact.",
    "Integrated keywords tailored to the job description.",
    "Strengthened action verbs for a more dynamic tone.",
    "Improved formatting for better readability and ATS parsing.",
  ];
  if (Object.values(answers).some((a) => a.trim() !== "")) {
    enhancements.push(
      "Incorporated your specific experiences and metrics provided."
    );
  }
  return (
    <div className="text-left bg-gray-50 p-4 rounded-lg my-6 border">
      <h4 className="font-bold text-lg text-gray-800 mb-3">
        Summary of Enhancements
      </h4>
      <ul className="space-y-2">
        {enhancements.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ==========================================================
// === REPLACE YOUR EXISTING ResultView WITH THIS VERSION ===
// ==========================================================
const ResultView = ({
  downloadFile,
  handleRecheck,
  analysis,
  scoreHistory,
  answers,
  error,
  handleNavigateToBuilder,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleCheckAndShow = async () => {
    setIsChecking(true);
    try {
      const success = await handleRecheck();
      if (success) {
        setShowResults(true);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const newScore = analysis?.overall_score;
  const oldScore =
    scoreHistory.length > 1 ? scoreHistory[scoreHistory.length - 2] : null;

  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-2xl text-center space-y-4">
        {showResults ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-3xl font-bold text-gray-800">
              Optimization Results
            </h2>
            <ScoreImprovement oldScore={oldScore} newScore={newScore} />
            {analysis?.summary && (
              <p className="mt-3 text-gray-600 italic">"{analysis.summary}"</p>
            )}
            <EnhancementsSummary answers={answers} />

            {/* --- THIS IS THE MODIFIED PART --- */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={downloadFile}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                <Download /> Download Optimized Resume
              </button>

              {/* --- ADDED THIS NEW BUTTON --- */}
              <button
                onClick={handleNavigateToBuilder}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all transform hover:scale-105"
              >
                <Building /> Design in Builder
              </button>
            </div>

            {/* --- END OF MODIFICATION --- */}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-lg"
          >
            <Wand2 className="w-16 h-16 text-purple-500 mx-auto" />
            <h2 className="text-3xl font-bold text-gray-800 mt-4">
              Almost There!
            </h2>
            <p className="text-gray-600 my-4">
              Your resume has been enhanced. Let's run a final check to see your
              new and improved score.
            </p>
            {error && (
              <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-md mb-4">
                ❌ {error}
              </p>
            )}
            <button
              onClick={handleCheckAndShow}
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-400 transition-all transform hover:scale-105"
            >
              {isChecking ? (
                <>
                  <Loader2 className="animate-spin" /> Checking...
                </>
              ) : (
                <>
                  <RefreshCw /> Check Improved Score
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ======================================================================
// === REPLACE YOUR EXISTING AnalyzeAtsScore EXPORT WITH THIS VERSION ===
// ======================================================================
export default function AnalyzeAtsScore() {
  const {
    currentStep,
    isLoading,
    setIsLoading,
    resumeFile,
    setResumeFile,
    jdText,
    setJdText,
    setAnalysis,
    setFileId,
    setParsedResumeText,
    setCurrentStep,
    analysis,
    setQuestions,
    parsedResumeText,
    keywordGaps,
    setKeywordGaps,
    questions,
    answers,
    setAnswer,
    fileId,
    setOptimizedResumeFile,
    optimizedResumeFile,
    reset,
    addScoreToHistory,
    scoreHistory,
    setDataToBuild, // GET THE NEW ACTION FROM YOUR STORE
  } = useResumeStore();

  const [error, setError] = useState(null);
  const navigate = useNavigate(); // GET THE NAVIGATE FUNCTION

  //
  // NO CHANGES TO ANY OF THESE FUNCTIONS:
  // handleInitialAnalysis, handleGenerateQuestions, handleOptimize,
  // handleRecheck, downloadFile
  //
  const handleInitialAnalysis = async () => {
    if (!resumeFile) {
      setError("Please upload your resume first.");
      return;
    }
    if (!jdText || jdText.trim() === "") {
      setError("Please paste the job description.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("jd_text", jdText);

    try {
      const analysisRes = await fetch(
        "http://localhost:5000/api/analyze_resume",
        { method: "POST", body: formData }
      );
      const analysisData = await analysisRes.json();

      if (analysisRes.ok) {
        setAnalysis(analysisData);
        setFileId(analysisData.file_id);
        const newParsedText = analysisData.parsed_resume_text;
        setParsedResumeText(newParsedText);
        addScoreToHistory(analysisData.overall_score);

        const gapsRes = await fetch(
          "http://localhost:5000/api/get_keyword_gaps",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jd_text: jdText,
              resume_text: newParsedText,
            }),
          }
        );
        const gapsData = await gapsRes.json();
        if (gapsRes.ok) {
          setKeywordGaps(gapsData);
        }

        setCurrentStep("SHOW_MATCH_ANALYSIS");
      } else {
        setError(analysisData.error || "Analysis failed.");
      }
    } catch (err) {
      setError("A network error occurred. Please check your connection.");
    }
    setIsLoading(false);
  };

  const handleGenerateQuestions = async () => {
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/generate_questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd_text: jdText,
          resume_text: parsedResumeText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(data.questions || []);
        setCurrentStep("OPTIMIZING");
      } else {
        setError(data.error || "Failed to generate questions.");
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message || "Network error during question generation.");
      throw err;
    }
  };

  
  const handleOptimize = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const lastScore = scoreHistory[scoreHistory.length - 1];
      if (lastScore === undefined) {
        setError(
          "Cannot optimize without an initial score. Please start over."
        );
        setIsLoading(false);
        return;
      }
      const res = await fetch("http://localhost:5000/api/optimize_resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd_text: jdText,
          answers,
          file_id: fileId,
          old_score: lastScore,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const file = new File([blob], "Optimized_Resume.docx", {
          type: res.headers.get("content-type"),
        });
        setOptimizedResumeFile(file);
        setCurrentStep("RESULT");
      } else {
        const data = await res.json();
        setError(data.error || "Optimization failed.");
      }
    } catch (err) {
      setError("Network error during optimization.");
    }
    setIsLoading(false);
  };

  const handleRecheck = async () => {
    setError(null);
    const formData = new FormData();
    formData.append("resume_file", optimizedResumeFile);
    formData.append("jd_text", jdText);

    const lastScore = scoreHistory[scoreHistory.length - 1];
    if (lastScore !== undefined) {
      formData.append("old_score", lastScore);
    }

    try {
      const res = await fetch("http://localhost:5000/api/analyze_resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Re-check failed during analysis.");
        return false;
      }
      setAnalysis(data);
      addScoreToHistory(data.overall_score);
      setResumeFile(optimizedResumeFile);
      return true;
    } catch (err) {
      setError("Network error during re-check.");
      return false;
    }
  };

  const downloadFile = () => {
    if (!optimizedResumeFile) return;
    const url = URL.createObjectURL(optimizedResumeFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = optimizedResumeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- ADD THIS NEW FUNCTION ---
  // const handleNavigateToBuilder = async () => {
  //     // The optimizedResumeFile is ALREADY in our store from the previous step.
  //     if (!optimizedResumeFile) {
  //         setError("Optimized resume file not found. Please try again.");
  //         return;
  //     }

  //     setIsLoading(true);
  //     setError(null);

  //     // We use FormData because we are now sending a FILE.
  //     const formData = new FormData();
  //     formData.append("optimized_resume_file", optimizedResumeFile);

  //     try {
  //       // We call the NEW, simpler endpoint.
  //       const res = await fetch("http://localhost:5000/parse_optimized_resume", {
  //         method: "POST",
  //         body: formData, // Send the form data with the file
  //       });

  //       const data = await res.json();
  //       if (!res.ok) {
  //         throw new Error(data.error || "Could not prepare data for builder.");
  //       }

  //       // Set the data in the global store
  //       setDataToBuild(data);
  //       // Navigate to the builder page
  //       navigate('/builder/google');

  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  // };

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleNavigateToBuilder = async () => {
    // We use the FINAL optimized file from the app state.
    // This is the SAME file used by the "Download" button.
    if (!optimizedResumeFile) {
      setError(
        "The optimized resume file is not available. Please try the process again."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    // The key here MUST match what the backend expects: 'optimized_resume_file'
    formData.append("optimized_resume_file", optimizedResumeFile);

    try {
      // We call the NEW, correct endpoint
      const res = await fetch(
        "http://localhost:5000/api/parse_final_resume_to_json",
        {
          method: "POST",
          body: formData, // Send the form data containing the final .docx file
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || "Could not prepare data for the builder."
        );
      }

      // Set the data in the global store
      setDataToBuild(data);
      // Navigate to the builder page
      navigate("/builder/google");
    } catch (err) {
      setError(err.message);
      setIsLoading(false); // Make sure to stop loading on error
    }
    // No need for a `finally` block if we only want to stop loading on error or success navigation
  };

  const renderStep = () => {
    if (isLoading) return <LoadingView />;
    switch (currentStep) {
      case "INITIAL_UPLOAD":
        return (
          <InitialUploadView
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            handleInitialAnalysis={handleInitialAnalysis}
            error={error}
            reset={reset}
            jdText={jdText}
            setJdText={setJdText}
          />
        );
      case "SHOW_MATCH_ANALYSIS":
        return (
          <AnalysisView
            analysis={analysis}
            keywordGaps={keywordGaps}
            handleGenerateQuestions={handleGenerateQuestions}
            error={error}
          />
        );
      case "OPTIMIZING":
        return (
          <OptimizerView
            questions={questions}
            answers={answers}
            setAnswer={setAnswer}
            handleOptimize={handleOptimize}
            error={error}
          />
        );
      case "RESULT":
        // --- THIS IS THE MODIFIED PART ---
        return (
          <ResultView
            downloadFile={downloadFile}
            handleRecheck={handleRecheck}
            analysis={analysis}
            scoreHistory={scoreHistory}
            answers={answers}
            error={error}
            handleNavigateToBuilder={handleNavigateToBuilder} // Pass the new handler here
          />
        );
      // --- END OF MODIFICATION ---
      default:
        return (
          <InitialUploadView
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            handleInitialAnalysis={handleInitialAnalysis}
            error={error}
            reset={reset}
            jdText={jdText}
            setJdText={setJdText}
          />
        );
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderStep()}</div>;
}
