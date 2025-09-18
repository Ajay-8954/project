import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import AnalysisCategory from "./AnalysisCategory";
import KeywordChart from "./KeywordChart";

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

export default AnalysisView;