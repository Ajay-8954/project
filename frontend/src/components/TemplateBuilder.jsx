import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Save,
  Check,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Menu,
  X,
} from "lucide-react";
import ResumeForm from "./ResumeForm";
import Google from "./templates/Google";
import Meta from "./templates/Meta";
import Microsoft from "./templates/Microsoft";
import TemplateSelection from "./TemplateSelection";
import axios from "axios";
import juice from "juice";
import useResumeStore from "../store/useResumeStore";
import Template4 from "./templates/Template4";
import Template5 from "./templates/Template5";
import Template6 from "./templates/Template6";

export default function TemplateBuilder({
  selectedTemplate,
  resumeData,
  resumeId,
}) {
  // Default template if none is selected
  const templateId = selectedTemplate || "microsoft";

  // Access state and actions from useResumeStore
  const {
    manualForm,
    loading,
    setManualForm,
    setResumeId,
    setDataToBuild,
    dataToBuild,
    reset,
  } = useResumeStore();
  
  // Refs for preview and scrolling
  const previewRef = useRef();
  const topRef = useRef();

  // Local state for UI
  const [title, setTitle] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("form"); // 'form' or 'preview' for mobile

  // Required fields for step validation
  const requiredFields = ["Name", "email", "phone", "education"];

  // Check if required fields are filled to enable step progression
  const checkRequiredFieldsFilled = () => {
    if (!manualForm) return false;
    return requiredFields.every((field) => {
      const value = manualForm[field];
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== "";
    });
  };

  // Initialize manualForm with default structure only on mount
  useEffect(() => {
    if (!manualForm) {
      console.log("Initializing manualForm with default structure");
      setManualForm({
        Name: "",
        jobTitle: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        summary: "",
        objective: "",
        experience: [],
        education: [],
        projects: [],
        skills: [],
        languages: [],
        interests: [],
        achievements: [],
        internships: [],
        certifications: [],
      });
    }
  }, [setManualForm]);

  // Handle navigation state and initialize form
  useEffect(() => {
    const state = location.state || {};
    console.log("Navigation state:", state);

    if (
      !state.resumeId &&
      !resumeId &&
      !state.content &&
      !resumeData &&
      !dataToBuild &&
      (!manualForm || !Object.keys(manualForm).length)
    ) {
      console.log("Resetting form for new resume");
      reset();
      setTitle("Untitled Resume");
    } else if (state.content || resumeData) {
      console.log("Populating form with existing data");
      const data = state.content || resumeData || {};
      setManualForm({
        Name: data.Name || "",
        jobTitle: data.jobTitle || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        linkedin: data.linkedin || "",
        github: data.github || "",
        summary: data.summary || "",
        objective: data.objective || "",
        experience: data.experience || [],
        education: data.education || [],
        projects: data.projects || [],
        skills: data.skills || [],
        languages: data.languages || [],
        interests: data.interests || [],
        achievements: data.achievements || [],
        internships: data.internships || [],
        certifications: data.certifications || [],
        newExperience: data.newExperience || { jobTitle: "", company: "", startDate: "", endDate: "", description: "" },
        newEducation: data.newEducation || { degree: "", school: "", startDate: "", endDate: "" },
        newProject: data.newProject || { title: "", startDate: "", endDate: "", tech: "", description: "" },
        newAchievement: data.newAchievement || { title: "", description: "" },
        newInternship: data.newInternship || { role: "", company: "", startDate: "", endDate: "", description: "" },
        newCertification: data.newCertification || { name: "", issuer: "", date: "" },
      });
      setTitle(data.Name ? `${data.Name}'s Resume` : "Untitled Resume");
      if (state.resumeId || resumeId) {
        setResumeId(state.resumeId || resumeId);
      }
    }
  }, [location.state, resumeData, resumeId, setManualForm, setResumeId, reset, dataToBuild]);

  // Debug manualForm changes
  useEffect(() => {
    console.log("Current manualForm:", JSON.stringify(manualForm, null, 2));
  }, [manualForm]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("Clearing state before page unload");
      reset();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [reset]);

  // Merge dataToBuild with manualForm
  useEffect(() => {
    console.log(
      "BUILDER MOUNTED: Received dataToBuild:",
      JSON.stringify(dataToBuild, null, 2)
    );
    if (
      dataToBuild &&
      typeof dataToBuild === "object" &&
      Object.keys(dataToBuild).length > 0
    ) {
      console.log("Merging form with dataToBuild...");
      setManualForm((prev) => ({
        ...prev,
        ...dataToBuild,
        projects: dataToBuild.projects || prev.projects || [],
        experience: dataToBuild.experience || prev.experience || [],
        education: dataToBuild.education || prev.education || [],
        skills: dataToBuild.skills || prev.skills || [],
        languages: dataToBuild.languages || prev.languages || [],
        interests: dataToBuild.interests || prev.interests || [],
        achievements: dataToBuild.achievements || prev.achievements || [],
        internships: dataToBuild.internships || prev.internships || [],
        certifications: dataToBuild.certifications || prev.certifications || [],
      }));
      if (dataToBuild.Name && !title) {
        setTitle(`${dataToBuild.Name}'s Resume`);
      }
    } else {
      console.log(
        "No valid dataToBuild found. Form will use default or existing data."
      );
    }
  }, [dataToBuild, setManualForm, title]);

  // Cleanup dataToBuild on unmount
  useEffect(() => {
    return () => {
      console.log("BUILDER UNMOUNTING: Clearing dataToBuild from store.");
      setDataToBuild(null);
    };
  }, [setDataToBuild]);

  // Merge resumeData with manualForm for existing resumes
  useEffect(() => {
    if (resumeData && Object.keys(resumeData).length > 0) {
      console.log(
        "Merging form with resumeData:",
        JSON.stringify(resumeData, null, 2)
      );
      setManualForm((prev) => ({
        ...prev,
        ...resumeData,
        projects: resumeData.projects || prev.projects || [],
        experience: resumeData.experience || prev.experience || [],
        education: resumeData.education || prev.education || [],
        skills: resumeData.skills || prev.skills || [],
        languages: resumeData.languages || prev.languages || [],
        interests: resumeData.interests || prev.interests || [],
        achievements: resumeData.achievements || prev.achievements || [],
        internships: resumeData.internships || prev.internships || [],
        certifications: resumeData.certifications || prev.certifications || [],
      }));
      if (resumeData.Name && !title) {
        setTitle(`${resumeData.Name}'s Resume`);
      }
    }
    if (resumeId) {
      setResumeId(resumeId);
    }
  }, [resumeData, resumeId, setManualForm, setResumeId, title]);

  // Update step when template is selected
  useEffect(() => {
    if (templateId) {
      console.log("Template changed:", templateId);
      setCurrentStep(1);
      setCompletedSteps([1]);
    }
  }, [templateId]);

  // Update step when required fields are filled
  useEffect(() => {
    const isFilled = checkRequiredFieldsFilled();
    if (templateId && isFilled) {
      if (currentStep < 2) setCurrentStep(2);
      setCompletedSteps((prev) => [...new Set([...prev, 2])]);
    } else {
      setCompletedSteps((prev) => prev.filter((s) => s !== 2 && s !== 3));
      if (currentStep >= 2) setCurrentStep(1);
    }
  }, [manualForm, templateId, currentStep]);

  // Handle step navigation
  const handleStepClick = (step) => {
    setCurrentStep(step);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    if (step < 3) {
      setCompletedSteps((prev) => prev.filter((s) => s !== 3));
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      let bodyContent = previewRef.current.innerHTML;
      console.log("Raw HTML from previewRef:", bodyContent);
      bodyContent = juice(bodyContent);
      console.log("Inlined HTML:", bodyContent);
      const response = await fetch("http://127.0.0.1:5000/download_pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: bodyContent, template: templateId }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Failed to generate PDF"
        );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("PDF generation failed: " + error.message);
    } finally {
      setDownloadLoading(false);
    }
  };

  // Manual Save Function
  const defaultTemplateId = "microsoft";
  const isSaving = useRef(false);

  const saveResume = async () => {
    if (isSaving.current) {
      console.log("⚠️ Skipping save: Previous save still in progress");
      return;
    }

    console.log("🟡 Save triggered", {
      manualForm: JSON.stringify(manualForm, null, 2),
      title,
      templateId,
      resumeId,
    });

    if (!manualForm || !Object.keys(manualForm).length) {
      console.log("⚠️ Skipping save: Missing form data");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
      return;
    }

    const currentPayload = {
      title: title || "Untitled Resume",
      content: manualForm,
      template: templateId || defaultTemplateId,
    };

    isSaving.current = true;
    setSaveLoading(true);
    setSaveStatus("saving");
    try {
      let response;
      if (resumeId) {
        console.log(`Updating resume with ID: ${resumeId}`);
        response = await axios.put(
          `http://localhost:5000/update/${resumeId}`,
          currentPayload,
          { withCredentials: true }
        );
        console.log("✅ Saved (updated)", response.data);
      } else {
        console.log("Creating new resume");
        response = await axios.post(
          "http://localhost:5000/save",
          currentPayload,
          {
            withCredentials: true,
          }
        );
        console.log("✅ Saved (created)", response.data);
        if (response.data._id) {
          console.log("Setting new resumeId:", response.data._id);
          setResumeId(response.data._id);
        }
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("❌ Save failed:", err.response?.data || err.message);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    } finally {
      isSaving.current = false;
      setSaveLoading(false);
    }
  };

  // Render preview based on selected template
  const renderPreview = () => {
    const props = {
      data:
        manualForm && Object.keys(manualForm).length ? manualForm : resumeData,
    };
    switch (templateId) {
      case "google":
        return <Google {...props} ref={previewRef} />;
      case "meta":
        return <Meta {...props} ref={previewRef} />;
      case "microsoft":
        return <Microsoft {...props} ref={previewRef} />;
      case "template4":
        return <Template4 {...props} ref={previewRef}/>

      case "template5":
        return <Template5 {...props} ref={previewRef}/>
      case "template6":
        return <Template6 {...props} ref={previewRef}/>
      default:
        return <Microsoft {...props} ref={previewRef} />;
    }
  };

  // Mobile view toggle with template selection button
const MobileViewToggle = () => (
  <div className="lg:hidden  flex justify-between items-center mb-4 bg-white p-2 rounded-lg shadow-sm">
    <button
      onClick={() => setIsMobileSidebarOpen(true)}
      className="flex items-center gap-2 px-3 py-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
    >
      <Menu size={16} />
      Templates
    </button>
    
    <div className="flex border border-blue-200 rounded-md overflow-hidden">
      <button
        className={`px-4 py-2 text-sm font-medium ${
          activeView === "form" 
            ? "bg-blue-600 text-white" 
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => setActiveView("form")}
      >
        Edit Resume
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium ${
          activeView === "preview" 
            ? "bg-blue-600 text-white" 
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => setActiveView("preview")}
      >
        Preview
      </button>
    </div>
  </div>
);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50" ref={topRef}>
      {/* Mobile Header */}
    

      {/* Step Indicator - Mobile Version */}
      <div className="sticky top-0 z-40 bg-white shadow-md py-3 px-2 border-b border-gray-200 lg:top-0">
        <div className="max-w-5xl mx-auto flex justify-between items-center relative">
          {[
            { step: 1, label: "Template" },
            { step: 2, label: "Details" },
          ].map(({ step, label }, idx, arr) => {
            const isActive = currentStep === step;
            const isComplete = completedSteps.includes(step);
            const isNextStepCompleted =
              idx < arr.length - 1 &&
              completedSteps.includes(arr[idx + 1].step);
            const isStepDisabled = step === 2 && !checkRequiredFieldsFilled();
            const canClickStep =
              !isStepDisabled &&
              (step === 1 || (step === 2 && checkRequiredFieldsFilled()));

            return (
              <div
                key={step}
                onClick={() => canClickStep && handleStepClick(step)}
                className={`flex-1 flex flex-col items-center relative ${
                  canClickStep ? "cursor-pointer group" : "cursor-not-allowed"
                }`}
              >
                {idx < arr.length - 1 && (
                  <div
                    className={`absolute top-1/2 left-full h-0.5 z-[-1] ${
                      isNextStepCompleted ||
                      (isComplete && completedSteps.includes(step + 1))
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                    style={{ 
                      width: "calc(100% - 2rem)", 
                      transform: "translateY(-50%)",
                      maxWidth: "80px"
                    }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: canClickStep ? 0.9 : 1 }}
                  whileHover={{ scale: canClickStep ? 1.05 : 1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition
              ${
                isComplete
                  ? "bg-green-600 border-green-600 text-white"
                  : isActive
                  ? "bg-blue-600 border-blue-600 text-white"
                  : !canClickStep
                  ? "bg-gray-100 border-gray-200 text-gray-400"
                  : "bg-gray-200 border-gray-300 text-gray-600 group-hover:border-blue-400 group-hover:text-blue-600"
              }`}
                >
                  {isComplete ? <Check className="w-3 h-3" /> : step}
                </motion.div>
                <span
                  className={`mt-1 text-xs font-medium transition-colors text-center ${
                    isActive || isComplete
                      ? "text-gray-900"
                      : !canClickStep
                      ? "text-gray-400"
                      : "text-gray-400 group-hover:text-blue-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Menu Button for Mobile */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        onClick={() => setIsMobileSidebarOpen(true)}
        whileTap={{ scale: 0.9 }}
      >
        <Menu size={24} />
      </motion.button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", ease: "easeInOut" }}
              className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Templates</h2>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-full">
                <TemplateSelection onSelect={() => setIsMobileSidebarOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="flex flex-grow">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-55 min-w-[240px] border-r border-blue-100 bg-white shadow-md sticky top-0 h-screen">
          <TemplateSelection />
        </div>
        
        <div className="flex  flex-col lg:flex-row gap-4  w-full mx-auto">
          {/* Mobile View Toggle */}
          <MobileViewToggle />
          
          {/* Form Section - Hidden on mobile when preview is active */}
          <section className={`w-full lg:w-1/2 bg-white rounded-lg shadow-md transition-all ${activeView === "preview" ? "hidden lg:block" : "block"}`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-blue-600">
                <div className="w-10 h-10 border-4 border-blue-300 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-medium">Processing your resume...</p>
              </div>
            ) : (
              <ResumeForm />
            )}
          </section>
          
          {/* Preview Section - Hidden on mobile when form is active */}
          <section className={`w-full lg:w-1/2 bg-white rounded-lg p-4 lg:sticky lg:top-4 ${activeView === "form" ? "hidden lg:block" : "block"}`}>
            <div className="sticky top-0 bg-white pb-3 z-10 flex flex-col gap-2 border-0 border-gray-200 mb-4">
              <div className="flex items-center gap-2 flex-1 flex-wrap">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[140px] justify-center"
                  disabled={downloadLoading}
                >
                  {downloadLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Downloading...
                    </div>
                  ) : (
                    <>
                      <Download size={16} className="inline" />
                      Download PDF
                    </>
                  )}
                </button>
                <button
                  onClick={saveResume}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[140px] justify-center"
                  disabled={saveLoading}
                >
                  {saveLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save size={16} className="inline" />
                      Save Resume
                    </>
                  )}
                </button>
              </div>
              
              {/* Save Status Indicator */}
              {saveStatus !== "idle" && (
                <div className={`text-xs mt-1 px-2 py-1 rounded ${
                  saveStatus === "saving" ? "bg-blue-100 text-blue-800" :
                  saveStatus === "saved" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {saveStatus === "saving" && "Saving..."}
                  {saveStatus === "saved" && "Resume saved successfully!"}
                  {saveStatus === "error" && "Error saving resume. Please try again."}
                </div>
              )}
            </div>
            
            <div className="max-h-[calc(100vh-180px)] fixed overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {renderPreview()}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}