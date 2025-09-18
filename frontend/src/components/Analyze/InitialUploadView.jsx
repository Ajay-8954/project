import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  CheckCircle,
  XCircle,
  Trash2,
  Clipboard,
  Download,
  Target,
  BarChart as BarChartIcon,
  Wand2,
  BrainCircuit,
  RefreshCw,
} from "lucide-react";

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
        <p className={`font-semibold ${isError ? "text-red-800" : "text-green-800"}`}>
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

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Left side with features */}
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

      {/* Right side with form */}
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

export default InitialUploadView;