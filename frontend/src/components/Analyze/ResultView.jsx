import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  Building,
  RefreshCw,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowUp,
  Wand2,
} from "lucide-react";

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
    <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-2xl text-center space-y-6 border border-gray-100">
        {showResults ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Success Icon with Animation */}
            <div className="relative">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="animate-ping absolute h-24 w-24 rounded-full bg-green-400 opacity-20"></div>
              </div>
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto drop-shadow-sm" />
            </div>

            {/* Header */}
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Optimization Complete!
            </h2>

            {/* Score Improvement */}
            <ScoreImprovement oldScore={oldScore} newScore={newScore} />

            {/* Summary Card */}
            {analysis?.summary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-100"
              >
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-semibold text-blue-700">
                    AI Summary
                  </span>
                </div>
                <p className="text-gray-700 italic text-lg">
                  "{analysis.summary}"
                </p>
              </motion.div>
            )}

            {/* Enhancements Summary */}
            <EnhancementsSummary answers={answers} />

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button
                onClick={downloadFile}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                <span>Download Resume</span>
              </button>

              <button
                onClick={handleNavigateToBuilder}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Building className="w-5 h-5" />
                <span>Design in Builder</span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl border border-purple-100"
          >
            {/* Animated Wand Icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            >
              <Wand2 className="w-20 h-20 text-purple-500 mx-auto drop-shadow-sm" />
            </motion.div>

            {/* Header */}
            <h2 className="text-3xl font-bold text-gray-800 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Almost There!
            </h2>

            {/* Description */}
            <p className="text-gray-600 my-5 text-lg leading-relaxed">
              Your resume has been enhanced with AI-powered optimizations. Let's
              run a final check to see your new and improved score.
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg mb-4 border border-red-100 flex items-center justify-center"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Check Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckAndShow}
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isChecking ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Check Improved Score</span>
                </>
              )}
            </motion.button>

            {/* Decorative Elements */}
            <div className="flex justify-center space-x-2 mt-6">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: item * 0.3,
                  }}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResultView;