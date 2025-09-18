import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home, Info } from "lucide-react";
import useResumeStore from "../store/useResumeStore";
import LoadingView from "./Analyze/LoadingView"
import AnalysisView from "./Analyze/AnalysisView";
import OptimizerView from "./Analyze/OptimizerView";
import ResultView from "./Analyze/ResultView";
import InitialUploadView from "./Analyze/InitialUploadView";

const AnalyzeAtsScore = () => {
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
    setDataToBuild,
  } = useResumeStore();

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Define the step order
  const stepOrder = [
    "INITIAL_UPLOAD",
    "SHOW_MATCH_ANALYSIS",
    "OPTIMIZING",
    "RESULT"
  ];

  const stepLabels = ["Upload", "Analysis", "Optimization", "Results"];
  const currentStepIndex = stepOrder.indexOf(currentStep);

  // Navigation functions
  const goToNextStep = () => {
    if (currentStepIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentStepIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(stepOrder[currentStepIndex - 1]);
    }
  };

  const goToHome = () => {
    navigate("/");
  };

  // Check if current step is completed
  const isStepCompleted = () => {
    switch (currentStep) {
      case "INITIAL_UPLOAD":
        return resumeFile && jdText.trim() !== "";
      case "SHOW_MATCH_ANALYSIS":
        return analysis !== null;
      case "OPTIMIZING":
        return Object.keys(answers).length >= questions.length;
      case "RESULT":
        return true;
      default:
        return false;
    }
  };

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

  const handleNavigateToBuilder = async () => {
    if (!optimizedResumeFile) {
      setError(
        "The optimized resume file is not available. Please try the process again."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("optimized_resume_file", optimizedResumeFile);

    try {
      const res = await fetch(
        "http://localhost:5000/api/parse_final_resume_to_json",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || "Could not prepare data for the builder."
        );
      }

      setDataToBuild(data);
      navigate("/builder/google");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Navigation component
  const NavigationControls = () => (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white p-2 rounded-lg shadow-lg z-10">
      <button
        onClick={goToHome}
        className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
        title="Go to Home"
      >
        <Home size={20} />
      </button>
      
      {currentStepIndex > 0 && (
        <button
          onClick={goToPreviousStep}
          className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>
      )}
      
      {currentStepIndex < stepOrder.length - 1 && currentStep !== "INITIAL_UPLOAD" && (
        <button
          onClick={goToNextStep}
          disabled={!isStepCompleted()}
          className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
            isStepCompleted()
              ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );

  // Progress indicator
  const ProgressIndicator = () => {
    const isStepCompleted = (stepIndex) => {
      const step = stepOrder[stepIndex];
      switch (step) {
        case "INITIAL_UPLOAD":
          return resumeFile && jdText.trim() !== "";
        case "SHOW_MATCH_ANALYSIS":
          return analysis !== null;
        case "OPTIMIZING":
          return Object.keys(answers).length >= questions.length;
        case "RESULT":
          return optimizedResumeFile !== null;
        default:
          return false;
      }
    };

    return (
      <div className="w-full bg-white py-4 px-6 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold text-gray-800 sm:mr-4">Resume Analysis</h2>
            
            <div className="w-full sm:w-auto flex-1 max-w-lg">
              {/* Progress bar container */}
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-2 right-2 top-4 h-1 bg-gray-200 -z-10">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ 
                      width: `${(currentStepIndex / (stepOrder.length - 1)) * 100}%` 
                    }}
                  ></div>
                </div>
                
                {/* Steps */}
                <div className="flex justify-between relative">
                  {stepOrder.map((step, index) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${
                          index === currentStepIndex
                            ? "bg-purple-600 text-white ring-4 ring-purple-200"
                            : isStepCompleted(index)
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {stepLabels[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tooltip component
  const StepTooltip = () => {
    const getTooltipText = () => {
      switch (currentStep) {
        case "INITIAL_UPLOAD":
          return "Upload a resume and paste a job description to continue";
        case "SHOW_MATCH_ANALYSIS":
          return "Complete the analysis to continue";
        case "OPTIMIZING":
          return "Answer all questions to continue";
        case "RESULT":
          return "All steps completed!";
        default:
          return "";
      }
    };

    if (currentStep === "RESULT" || isStepCompleted()) return null;

    return (
      <div className="fixed bottom-20 right-4 bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-lg z-10 max-w-xs">
        <div className="flex items-center gap-2">
          <Info size={16} />
          <span>{getTooltipText()}</span>
        </div>
        <div className="absolute -bottom-1 right-6 w-4 h-4 bg-gray-800 transform rotate-45"></div>
      </div>
    );
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
        return (
          <ResultView
            downloadFile={downloadFile}
            handleRecheck={handleRecheck}
            analysis={analysis}
            scoreHistory={scoreHistory}
            answers={answers}
            error={error}
            handleNavigateToBuilder={handleNavigateToBuilder}
          />
        );
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

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep !== "INITIAL_UPLOAD" && <ProgressIndicator />}
      {renderStep()}
      <NavigationControls />
      <StepTooltip />
    </div>
  );
};

export default AnalyzeAtsScore;