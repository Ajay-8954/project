import { Briefcase, Sparkles, ArrowRight } from "lucide-react";

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
              placeholder={ "For example: "+q.example || "Your specific, quantifiable answer..."}
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

export default OptimizerView;