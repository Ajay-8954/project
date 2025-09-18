import React, { useRef, useState, useEffect } from "react";
import { CloudUpload, Trash2, Pencil } from "lucide-react";
import useResumeStore from "../store/useResumeStore";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { format, parse, isValid } from "date-fns";

export default function ResumeForm() {
  const {
    resumeFiles,
    setResumeFiles,
    manualForm,
    setManualForm,
    toggle,
    setToggle,
  } = useResumeStore();
  const reset = useResumeStore((state) => state.reset);

  // Default to fresher
  const [uploadLoading, setUploadLoading] = useState(false);
  const [enhancingField, setEnhancingField] = useState(null); // 'experience', 'project', etc.

  const [interestSuggestions, setInterestSuggestions] = useState([]);
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);
  const [activeInterestSuggestionIndex, setActiveInterestSuggestionIndex] =
    useState(0);

  const [languageSuggestions, setLanguageSuggestions] = useState([]);
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);
  const [activeLanguageSuggestionIndex, setActiveLanguageSuggestionIndex] =
    useState(0);

  const fileInputRef = useRef(null);
  const [newExperience, setNewExperience] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [newEducation, setNewEducation] = useState({
    degree: "",
    school: "",
    level: "",
    startDate: "",
    endDate: "",
    cgpa: "", // Add this line
  });

  const [newProject, setNewProject] = useState({
    title: "",
    startDate: "",
    endDate: "",
    tech: "",
    description: "",
  });
  const [newPoint, setNewPoint] = useState("");

  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
  });

  // New sections state
  const [newInternship, setNewInternship] = useState({
    role: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    date: "",
  });

  // new code for toggles
  const [showSections, setShowSections] = useState({
    achievements: false,
    certifications: false,
    internships: toggle === "fresher",
  });

  const [editingIndex, setEditingIndex] = useState({
    experience: null,
    education: null,
    project: null,
    // achievement: null,
    // internship: null,
  });

  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  // Add API functions for fetching suggestions
  const fetchInterestSuggestions = async (input) => {
    try {
      const response = await fetch("http://localhost:5000/suggest-interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefix: input,
          interests: manualForm.interests || [], // Existing interests to avoid duplicates
        }),
      });

      const data = await response.json();
      setInterestSuggestions(data.suggestions || []);
      setShowInterestSuggestions(true);
    } catch (error) {
      console.error("Error fetching interest suggestions:", error);
      setInterestSuggestions([]);
    }
  };

  const fetchLanguageSuggestions = async (input) => {
    try {
      const response = await fetch("http://localhost:5000/suggest-languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefix: input,
          languages: manualForm.languages || [], // Existing languages to avoid duplicates
        }),
      });

      const data = await response.json();
      setLanguageSuggestions(data.suggestions || []);
      setShowLanguageSuggestions(true);
    } catch (error) {
      console.error("Error fetching language suggestions:", error);
      setLanguageSuggestions([]);
    }
  };

  const fetchSkillSuggestions = async (input) => {
    try {
      const response = await fetch("http://localhost:5000/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefix: input,
          skills: manualForm.skills || [], // Existing skills to avoid duplicates
        }),
      });

      const data = await response.json();
      setSkillSuggestions(data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching skill suggestions:", error);
      setSkillSuggestions([]);
    }
  };

  const enhanceField = async (fieldType, currentText, context = {}) => {
    setEnhancingField(fieldType);
    try {
      const response = await fetch("http://localhost:5000/enhance-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldType,
          text: currentText,
          context,
        }),
      });
      if (!response.ok) throw new Error("Enhancement failed");
      const data = await response.json();
      setEnhancingField(null);
      return data.enhancedText; // Assuming API returns { enhancedText: "..." }
    } catch (error) {
      console.error("Error enhancing field:", error);
      setEnhancingField(null);
      return currentText; // Fallback to original text if error
    }
  };

  const uploadAndExtractResume = async (file) => {
    setUploadLoading(true); // Set loading to true
    setResumeFiles(file);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:5000/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to upload resume");
      }

      const data = await res.json();
      console.log("Data received from backend:", data);

      // Transform the data to match your form structure
      const transformedData = {
        Name: data.Name || "",
        jobTitle: data.jobTitle || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || data.Location || "",
        linkedin: data.linkedin || "",
        github: data.github || "",
        objective: data.objective || "",
        summary: data.summary || "",
        experience: data.experience || [],
        education: data.education || [],
        projects: data.projects || [],
        skills: data.skills || [],
        languages: data.languages || [],
        interests: data.interests || [],
        achievements: data.achievements || [],
        internships: data.internship || [],
        certifications: data.certifications || [],
      };

      // Update the form state
      setManualForm(transformedData);
      console.log("Updated manualForm:", transformedData);

      // Auto-toggle to "experienced" if experience data exists and is non-empty
      if (transformedData.experience && transformedData.experience.length > 0) {
        setToggle("experienced");
      } else {
        setToggle("fresher"); // Optional: Explicitly set to fresher if no experience
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Error: ${err.message || "Failed to process resume"}`);
    } finally {
      setUploadLoading(false); // Reset loading
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const generateCareerObjective = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:5000/generate-objective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          education: manualForm.education || [],
          projects: manualForm.projects || [],
          internships: manualForm.internships || [],
        }),
      });
      const data = await response.json();
      if (data.objective) {
        handleFieldChange("objective", data.objective);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadAndExtractResume(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) uploadAndExtractResume(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFieldChange = (field, value) => {
    setManualForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (field, value) => {
    if (!value) return;
    setManualForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value],
    }));
  };

  const handleRemoveItem = (field, index) => {
    setManualForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // const handleExperienceChange = (field, value) => {
  //   setNewExperience((prev) => ({ ...prev, [field]: value }));
  // };

  // const handleProjectChange = (field, value) => {
  //   setNewProject((prev) => ({ ...prev, [field]: value }));
  // };

  const handleProjectChange = (index, field, value) => {
    setManualForm((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      ),
    }));
  };

  const handleAddEducation = () => {
    const lastEducation =
      manualForm.education[manualForm.education.length - 1] || {};
    if (
      manualForm.education.length === 0 ||
      (lastEducation.school &&
        lastEducation.degree &&
        lastEducation.level &&
        lastEducation.location &&
        lastEducation.startDate &&
        lastEducation.cgpa)
    ) {
      setManualForm((prev) => ({
        ...prev,
        education: [
          ...(prev.education || []),
          {
            school: "",
            degree: "",
            level: "",
            location: "",
            startDate: "",
            endDate: "",
            cgpa: "",
          },
        ],
      }));
    }
  };

  // Handle changes to education fields, similar to handleProjectChange
  const handleEducationChange = (index, field, value) => {
    setManualForm((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleAddInternship = () => {
    // Only add a new internship if the last one is complete or if there are no internships
    const lastInternship =
      manualForm.internships[manualForm.internships.length - 1] || {};
    if (
      manualForm.internships.length === 0 ||
      (lastInternship.role &&
        lastInternship.company &&
        lastInternship.location &&
        lastInternship.startDate &&
        lastInternship.description)
    ) {
      setManualForm((prev) => ({
        ...prev,
        internships: [
          ...(prev.internships || []),
          {
            role: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "• ",
          },
        ],
      }));
    }
  };

  const handleRemoveInternship = (index) => {
    setManualForm((prev) => ({
      ...prev,
      internships: prev.internships.filter((_, i) => i !== index),
    }));
  };

  const handleAddProject = () => {
    const lastProject =
      manualForm.projects[manualForm.projects.length - 1] || {};
    if (
      manualForm.projects.length === 0 ||
      (lastProject.title && lastProject.startDate && lastProject.description)
    ) {
      setManualForm((prev) => ({
        ...prev,
        projects: [
          ...(prev.projects || []),
          {
            title: "",
            tech: "",
            startDate: "",
            endDate: "",
            description: "• ",
          },
        ],
      }));
    }
  };

  const handleRemoveProject = (index) => {
    setManualForm((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleInternshipChange = (index, field, value) => {
    setManualForm((prev) => ({
      ...prev,
      internships: prev.internships.map((internship, i) =>
        i === index ? { ...internship, [field]: value } : internship
      ),
    }));
  };

  const handleAchievementChange = (index, field, value) => {
    setManualForm((prev) => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) =>
        i === index ? { ...ach, [field]: value } : ach
      ),
    }));
  };

  const handleAddAchievement = () => {
    // Only add a new achievement if the last one is complete or if there are no achievements
    const lastAchievement =
      manualForm.achievements[manualForm.achievements.length - 1] || {};
    if (
      manualForm.achievements.length === 0 ||
      (lastAchievement.title && lastAchievement.description)
    ) {
      setManualForm((prev) => ({
        ...prev,
        achievements: [
          ...(prev.achievements || []),
          { title: "", description: "• " },
        ],
      }));
    }
  };

  const handleRemoveAchievement = (index) => {
    setManualForm((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleCertificationChange = (index, field, value) => {
    setManualForm((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const handleAddCertification = () => {
    const lastCertification =
      manualForm.certifications[manualForm.certifications.length - 1] || {};
    if (
      manualForm.certifications.length === 0 ||
      (lastCertification.name &&
        lastCertification.issuer &&
        lastCertification.date)
    ) {
      setManualForm((prev) => ({
        ...prev,
        certifications: [
          ...(prev.certifications || []),
          {
            name: "",
            issuer: "",
            date: "",
          },
        ],
      }));
    }
  };

  // const handleInternshipChange = (index, field, value) => {
  //   const updated = [...(manualForm.internships || [])];
  //   updated[index][field] = value;
  //   setManualForm((prev) => ({ ...prev, internships: updated }));
  // };

  const handleEditItem = (field, index, updatedValue) => {
    setManualForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? updatedValue : item
      ),
    }));
  };

  const handleEditAchievement = (index) => {
    const achievement = manualForm.achievements[index];
    setEditingIndex({ ...editingIndex, achievement: index });
    setNewAchievement({
      title: achievement.title,
      description:
        achievement.description || achievement.points?.join("\n") || "",
    });
  };

  const handleEditExperience = (index) => {
    setEditingIndex({ ...editingIndex, experience: index });
    setNewExperience(manualForm.experience[index]);
  };

  const handleEditEducation = (index) => {
    setEditingIndex({ ...editingIndex, education: index });
    setNewEducation(manualForm.education[index]);
  };

  const handleEditProject = (index) => {
    setEditingIndex({ ...editingIndex, project: index });
    setNewProject({
      ...manualForm.projects[index],
    });
  };

  const handleEditInternship = (index) => {
    setEditingIndex((prev) => ({ ...prev, internship: index }));
    // No newInternship needed, editing happens directly on manualForm
  };

  // const handleAddExperience = () => {
  //   if (!newExperience.jobTitle || !newExperience.company) return;

  //   if (editingIndex.experience !== null) {
  //     handleEditItem("experience", editingIndex.experience, newExperience);
  //     setEditingIndex({ ...editingIndex, experience: null });
  //   } else {
  //     setManualForm((prev) => ({
  //       ...prev,
  //       experience: [...(prev.experience || []), newExperience],
  //     }));
  //   }

  //   setNewExperience({
  //     jobTitle: "",
  //     company: "",
  //     startDate: "",
  //     endDate: "",
  //     description: "",
  //   });
  // };

  const handleExperienceChange = (index, field, value) => {
    setManualForm((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleAddExperience = () => {
    const lastExperience =
      manualForm.experience[manualForm.experience.length - 1] || {};
    if (
      manualForm.experience.length === 0 ||
      (lastExperience.jobTitle &&
        lastExperience.company &&
        lastExperience.location &&
        lastExperience.startDate &&
        lastExperience.description)
    ) {
      setManualForm((prev) => ({
        ...prev,
        experience: [
          ...(prev.experience || []),
          {
            jobTitle: "",
            company: "",
            location: "", // Add this
            startDate: "",
            endDate: "",
            description: "• ",
          },
        ],
      }));
    }
  };

  const handleRemoveExperience = (index) => {
    setManualForm((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // const handleAddEducation = () => {
  //   if (!newEducation.degree || !newEducation.school) return;

  //   if (editingIndex.education !== null) {
  //     handleEditItem("education", editingIndex.education, newEducation);
  //     setEditingIndex({ ...editingIndex, education: null });
  //   } else {
  //     setManualForm((prev) => ({
  //       ...prev,
  //       education: [...(prev.education || []), newEducation],
  //     }));
  //   }

  //   setNewEducation({
  //     degree: "",
  //     school: "",
  //     startDate: "",
  //     endDate: "",
  //     cgpa: "", // Add this line
  //   });
  // };

  const handleRemoveEducation = (index) => {
    setManualForm((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index),
    }));
  };

  const handleRemoveCertification = (index) => {
    setManualForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  // const handleAddProject = () => {
  //   if (!newProject.title || !newProject.description) return;

  //   if (editingIndex.project !== null) {
  //     handleEditItem("projects", editingIndex.project, newProject);
  //     setEditingIndex({ ...editingIndex, project: null });
  //   } else {
  //     setManualForm((prev) => ({
  //       ...prev,
  //       projects: [...(prev.projects || []), newProject],
  //     }));
  //   }

  //   setNewProject({
  //     title: "",
  //     startDate: "",
  //     endDate: "",
  //     tech: "",
  //     description: "",
  //   });
  // };

  // const handleAddAchievement = () => {
  //   if (!newAchievement.title || !newAchievement.description) return;

  //   const achievementToAdd = {
  //     title: newAchievement.title,
  //     description: newAchievement.description,
  //   };

  //   if (editingIndex.achievement !== null) {
  //     handleEditItem(
  //       "achievements",
  //       editingIndex.achievement,
  //       achievementToAdd
  //     );
  //   } else {
  //     setManualForm((prev) => ({
  //       ...prev,
  //       achievements: [...(prev.achievements || []), achievementToAdd],
  //     }));
  //   }

  //   setNewAchievement({
  //     title: "",
  //     description: "",
  //   });
  //   setEditingIndex({ ...editingIndex, achievement: null });
  // };

  useEffect(() => {
    setShowSections((prev) => ({
      ...prev,
      internships: toggle === "fresher" ? true : prev.internships,
    }));
  }, [toggle]);

  useEffect(() => {
    console.log("Current manualForm state:", manualForm);
  }, [manualForm]);

  // on reload , the manual form fields should be empty

  // Month/Year Picker Component
  const MonthYearPicker = ({ label, value, onChange, required, disabled }) => {
    const parseDate = (value) => {
      console.log(`Parsing date for ${label}:`, value); // Debug log
      if (!value || value === "Present" || typeof value !== "string") {
        console.warn(`Invalid input for ${label}:`, value);
        return null;
      }
      const dateFormatRegex = /^[A-Za-z]{3}\s\d{4}$/;
      if (!dateFormatRegex.test(value.trim())) {
        console.warn(`Invalid date format for ${label}:`, value);
        return null;
      }
      try {
        const parsedDate = parse(value.trim(), "MMM yyyy", new Date());
        if (!isValid(parsedDate)) {
          console.warn(`Parsed date is invalid for ${label}:`, value);
          return null;
        }
        return parsedDate;
      } catch (error) {
        console.warn(`Error parsing date for ${label}:`, value, error);
        return null;
      }
    };

    const formatDate = (date) => {
      if (!date || !isValid(date)) {
        console.warn(`Invalid date object for ${label}:`, date);
        return "";
      }
      try {
        return format(date, "MMM yyyy");
      } catch (error) {
        console.warn(`Error formatting date for ${label}:`, date, error);
        return "";
      }
    };

    const selectedDate = parseDate(value);

    return (
      <div>
        <label className="block text-sm text-gray-500 mb-1">{label}</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            console.log(`Selected date for ${label}:`, date); // Debug log
            onChange(formatDate(date));
          }}
          dateFormat="MMM yyyy"
          showMonthYearPicker
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          placeholderText="Select Month Year"
          disabled={disabled}
          required={required}
        />
        {required && !value && (
          <p className="text-red-500 text-xs mt-1">{label} is required</p>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-1 max-w-3xl mx-auto bg-white shadow-lg p-5 rounded-xl ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Resume Builder</h1>
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-md transition-all duration-300 transform ${
              toggle === "fresher"
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setToggle("fresher")}
            aria-pressed={toggle === "fresher"}
            aria-label="Switch to Fresher mode"
          >
            Fresher
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md transition-all duration-300 transform ${
              toggle === "experienced"
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setToggle("experienced")}
            aria-pressed={toggle === "experienced"}
            aria-label="Switch to Experienced mode"
          >
            Experienced
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        <button
          type="button"
          className="cursor-pointer px-4 py-2 rounded-md transition-all duration-300 bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={() => reset()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          RESET FORM
        </button>
      </div>

     <div className="text-sm">
          <a
            href="/sample-resume.pdf" // Replace with the actual path or URL to your sample resume
            download="sample-resume.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            aria-label="Download a sample resume to use as a template"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Download Sample Resume</span>
          </a>
        </div>

      {/* Upload Box */}
      <div className="space-y-4">
        {/* <h3 className="text-lg font-semibold text-gray-700">Upload Resume</h3> */}
        <div
          className={`flex items-center justify-center border border-dashed border-blue-400 rounded-md p-4 text-blue-600 bg-blue-50 hover:bg-blue-100 transition cursor-pointer ${
            uploadLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => !uploadLoading && fileInputRef.current.click()}
          onDrop={uploadLoading ? null : handleDrop}
          onDragOver={uploadLoading ? null : handleDragOver}
        >
          <div className="flex items-center gap-3">
            {uploadLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-6 w-6 text-blue-500"
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
                <span className="font-medium">Uploading...</span>
              </div>
            ) : (
              <>
                <CloudUpload className="w-6 h-6 text-blue-500" />
                <div className="text-sm">
                  {resumeFiles ? (
                    <>
                      <div className="font-medium">{resumeFiles.name}</div>
                      <div className="text-xs text-gray-600">
                        Click or drag to change
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-medium">
                        Click or drag to upload resume
                      </div>
                      <div className="text-xs text-gray-500">
                        (.pdf, .docx, .txt)
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadLoading} // Disable input during loading
          />
        </div>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      {/* Personal Details Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Personal Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              value={manualForm.Name || ""}
              onChange={(e) => handleFieldChange("Name", e.target.value)}
            />
            {!manualForm.Name && (
              <p className="text-red-500 text-xs mt-1">Name is required</p>
            )}
          </div>
          {/* <div>
            <label className="block text-sm text-gray-500 mb-1">
              Job Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              value={manualForm.jobTitle || ""}
              onChange={(e) => handleFieldChange("jobTitle", e.target.value)}
            />
          </div> */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              value={manualForm.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="your.email@example.com"
            />
            {!manualForm.email && (
              <p className="text-red-500 text-xs mt-1">Email is required</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Phone</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              value={manualForm.phone || ""}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              placeholder="123-456-7890"
            />
            {!manualForm.phone && (
              <p className="text-red-500 text-xs mt-1">Phone is required</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Location</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              value={manualForm.location || ""}
              onChange={(e) => handleFieldChange("location", e.target.value)}
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">LinkedIn</label>
            <input
              type="url"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              value={manualForm.linkedin || ""}
              onChange={(e) => handleFieldChange("linkedin", e.target.value)}
              placeholder="LinkedIn URL"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">GitHub</label>
            <input
              type="url"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              value={manualForm.github || ""}
              onChange={(e) => handleFieldChange("github", e.target.value)}
              placeholder="GitHub URL"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      {/* Add the gamification component here */}
      {/* <ResumeGamification resumeData={manualForm} /> */}

      <div className="border-t border-gray-300 my-4"></div>

      {/* Professional Summary (for Experienced) */}
      {toggle === "experienced" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Professional Summary
            </h2>
            <button
              onClick={async () => {
                setIsGenerating(true);
                try {
                  const response = await fetch(
                    "http://localhost:5000/api/generate-or-enhance-summary",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        existingSummary: manualForm.summary || "",
                        experience: manualForm.experience || [],
                        skills: manualForm.skills || [],
                        projects: manualForm.projects || [], // Include projects
                      }),
                    }
                  );
                  const data = await response.json();
                  console.log(data);
                  if (data.summary) {
                    handleFieldChange("summary", data.summary);
                  } else {
                    alert("Error:" + data.error);
                  }
                } catch (error) {
                  alert("Error processing summary: " + error.message);
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${
                isGenerating
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-800"
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="4"
                    />
                  </svg>
                  {manualForm.summary ? "Enhancing..." : "Generating..."}
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {manualForm.summary ? "Enhance with AI" : "Generate with AI"}
                </>
              )}
            </button>
          </div>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            value={manualForm.summary || ""}
            onChange={(e) => handleFieldChange("summary", e.target.value)}
            placeholder="At least one of experience, skills, or projects o existing summary is required when generating or enhancing a summary..."
          />
        </div>
      )}

      {/* Experience Section */}
      {/* Experience Section - Only shown for experienced candidates */}
      {toggle === "experienced" && (
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">Experience</h2>
            <div className="text-sm text-gray-500">
              {(manualForm.experience ?? []).length} experience(s) added
            </div>
          </div>

          {(manualForm.experience || []).map((exp, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md p-4 relative group hover:bg-gray-50 transition-colors"
            >
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Role*
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    value={exp.jobTitle || ""}
                    onChange={(e) =>
                      handleExperienceChange(index, "jobTitle", e.target.value)
                    }
                    required
                  />
                  {!exp.jobTitle && (
                    <p className="text-red-500 text-xs mt-1">
                      Role is required
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Company*
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    value={exp.company || ""}
                    onChange={(e) =>
                      handleExperienceChange(index, "company", e.target.value)
                    }
                    required
                  />
                  {!exp.company && (
                    <p className="text-red-500 text-xs mt-1">
                      Company is required
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    value={exp.location || ""}
                    onChange={(e) =>
                      handleExperienceChange(index, "location", e.target.value)
                    }
                    required
                    placeholder="City, Country"
                  />
                  {!exp.location && (
                    <p className="text-red-500 text-xs mt-1">
                      Location is required
                    </p>
                  )}
                </div>
                <div>
                  <MonthYearPicker
                    label="Start Date*"
                    value={exp.startDate || ""}
                    onChange={(value) =>
                      handleExperienceChange(index, "startDate", value)
                    }
                    required
                  />
                  {!exp.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      Start Date is required
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {exp.endDate === "Present" ? (
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-100"
                        value="Present"
                        disabled
                      />
                    ) : (
                      <MonthYearPicker
                        label="End Date"
                        value={exp.endDate || ""}
                        onChange={(value) =>
                          handleExperienceChange(index, "endDate", value)
                        }
                      />
                    )}
                    <label className="text-sm whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={exp.endDate === "Present"}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "endDate",
                            e.target.checked ? "Present" : ""
                          )
                        }
                      />
                      Currently working here
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm text-gray-500">
                    Responsibilities*
                  </label>
                  <button
                    onClick={async () => {
                      const enhanced = await enhanceField(
                        "experience",
                        exp.description || "",
                        { role: exp.role, company: exp.company }
                      );
                      handleExperienceChange(index, "description", enhanced);
                    }}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-200 flex items-center gap-1"
                    disabled={enhancingField === "experience"}
                  >
                    {enhancingField === "experience" ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="11"
                            cy="11"
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
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Enhance with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={exp.description || ""}
                  onChange={(e) =>
                    handleExperienceChange(index, "description", e.target.value)
                  }
                  onFocus={(e) => {
                    const value = exp.description || "";
                    if (!value || !value.endsWith("• ")) {
                      handleExperienceChange(
                        index,
                        "description",
                        value + "• "
                      );
                      // Move cursor to the end
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd =
                          value.length + 2;
                      }, 0);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      exp.description &&
                      exp.description.endsWith("• ")
                    ) {
                      e.preventDefault();
                      handleExperienceChange(
                        index,
                        "description",
                        exp.description.slice(0, -2)
                      );
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      handleExperienceChange(
                        index,
                        "description",
                        exp.description + "\n• "
                      );
                    }
                  }}
                  placeholder="Start typing (bullet points auto-added)..."
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
                <p className="text-xs text-gray-500 mb-1">
                  Tip: Press{" "}
                  <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> to
                  create bullet points.
                </p>
              </div>

              <div className="flex gap-2 absolute bottom-2 right-2">
                <button
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                  onClick={() => handleRemoveExperience(index)}
                  title="Delete Experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              onClick={handleAddExperience}
              disabled={
                manualForm.experience.length > 0 &&
                (!manualForm.experience[manualForm.experience.length - 1]
                  ?.jobTitle ||
                  !manualForm.experience[manualForm.experience.length - 1]
                    ?.company ||
                  !manualForm.experience[manualForm.experience.length - 1]
                    ?.startDate ||
                  !manualForm.experience[manualForm.experience.length - 1]
                    ?.description)
              }
            >
              Add Experience
            </button>
          </div>
        </div>
      )}
      <div className="border-t border-gray-300 my-4"></div>

      {/* Education Section */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Education</h2>
          <div className="text-sm text-gray-500">
            {(manualForm.education ?? []).length} education(s) added
          </div>
        </div>

        {(manualForm.education || []).map((edu, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md p-4 relative group hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Education Level*
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={edu.level || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "level", e.target.value)
                  }
                  required
                >
                  <option value="" disabled>
                    Select Education Level
                  </option>
                  <option value="High School">High School</option>
                  <option value="Senior Secondary School">
                    Senior Secondary School
                  </option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduation">Undergraduation</option>
                  <option value="Postgraduation">Postgraduation</option>
                  <option value="PhD">PhD</option>
                  <option value="Postdoctoral">Postdoctoral</option>
                  <option value="Other">Other</option>
                </select>
                {!edu.level && (
                  <p className="text-red-500 text-xs mt-1">
                    Education Level is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Degree*
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "degree", e.target.value)
                  }
                  required
                />
                {!edu.degree && (
                  <p className="text-red-500 text-xs mt-1">
                    Degree is required
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Institution*
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={edu.school || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "school", e.target.value)
                  }
                  required
                />
                {!edu.school && (
                  <p className="text-red-500 text-xs mt-1">
                    Institution is required
                  </p>
                )}
              </div>

              <div>
                <MonthYearPicker
                  label="Start Date*"
                  value={edu.startDate || ""}
                  onChange={(value) =>
                    handleEducationChange(index, "startDate", value)
                  }
                  required
                />
                {/* {!edu.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    Start Date is required
                  </p>
                )} */}
              </div>
              <div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    End Date
                  </label>
                  <div className="space-y-2">
                    {edu.endDate === "Present" ? (
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                        value="Present"
                        disabled
                        aria-disabled="true"
                      />
                    ) : (
                      <MonthYearPicker
                        value={edu.endDate || ""}
                        onChange={(value) =>
                          handleEducationChange(index, "endDate", value)
                        }
                        disabled={edu.endDate === "Present"}
                      />
                    )}
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-300 transition-colors"
                        checked={edu.endDate === "Present"}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "endDate",
                            e.target.checked ? "Present" : ""
                          )
                        }
                        aria-label="Mark education as currently enrolled"
                      />
                      <span>Currently Enrolled</span>
                      <span
                        className="relative group"
                        title="Check this if you are still pursuing this education (sets End Date to 'Present')"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  CGPA{" "}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={edu.cgpa || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "cgpa", e.target.value)
                  }
                  required
                />
                {!edu.cgpa && (
                  <p className="text-red-500 text-xs mt-1">
                    CGPA/Percentage is required
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Location*
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={edu.location || ""}
                  onChange={(e) =>
                    handleEducationChange(index, "location", e.target.value)
                  }
                  required
                  placeholder="City, Country"
                />
                {!edu.location && (
                  <p className="text-red-500 text-xs mt-1">
                    Location is required
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 absolute bottom-2 right-2">
              <button
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                onClick={() => handleRemoveEducation(index)}
                title="Delete Education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
            onClick={handleAddEducation}
            disabled={
              manualForm.education.length > 0 &&
              (!manualForm.education[manualForm.education.length - 1]?.school ||
                !manualForm.education[manualForm.education.length - 1]
                  ?.degree ||
                !manualForm.education[manualForm.education.length - 1]
                  ?.startDate ||
                !manualForm.education[manualForm.education.length - 1]?.cgpa)
            }
          >
            Add Education
          </button>
        </div>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      {/* Skills Section */}
      {/* Skills Section */}
      <div className="space-y-4 relative">
        <h2 className="text-xl font-semibold text-gray-700">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {(manualForm.skills || []).map((skill, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {skill}
              <button
                className="ml-1 text-blue-600"
                onClick={() => handleRemoveItem("skills", index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 relative">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            placeholder="Add a skill (start typing for suggestions)"
            value={newSkill}
            onChange={(e) => {
              setNewSkill(e.target.value);
              if (e.target.value.length > 0) {
                fetchSkillSuggestions(e.target.value);
              } else {
                setShowSuggestions(false);
              }
            }}
            onKeyDown={(e) => {
              // Handle arrow keys and enter for suggestions
              if (showSuggestions && skillSuggestions.length > 0) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveSuggestionIndex((prev) =>
                    Math.min(prev + 1, skillSuggestions.length - 1)
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveSuggestionIndex((prev) => Math.max(prev - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (skillSuggestions[activeSuggestionIndex]) {
                    handleAddItem(
                      "skills",
                      skillSuggestions[activeSuggestionIndex]
                    );
                    setNewSkill("");
                    setShowSuggestions(false);
                  }
                }
              } else if (e.key === "Enter" && newSkill) {
                handleAddItem("skills", newSkill);
                setNewSkill("");
              }
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
            onClick={() => {
              if (newSkill) {
                handleAddItem("skills", newSkill);
                setNewSkill("");
                setShowSuggestions(false);
              }
            }}
          >
            Add
          </button>
        </div>

        {/* Skill Suggestions Dropdown */}
        {showSuggestions && newSkill && skillSuggestions.length > 0 && (
          <ul className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {skillSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`p-2 cursor-pointer hover:bg-blue-50 ${
                  index === activeSuggestionIndex ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  handleAddItem("skills", suggestion);
                  setNewSkill("");
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t border-gray-300 my-4"></div>

      {/* Languages Section */}
      <div className="space-y-4 relative">
        <h2 className="text-xl font-semibold text-gray-700">Languages</h2>
        <div className="flex flex-wrap gap-2">
          {(manualForm.languages || []).map((language, index) => (
            <div
              key={index}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {language}
              <button
                className="ml-1 text-green-600"
                onClick={() => handleRemoveItem("languages", index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 relative">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            placeholder="Add a language (start typing for suggestions)"
            value={newLanguage}
            onChange={(e) => {
              setNewLanguage(e.target.value);
              if (e.target.value.length > 0) {
                fetchLanguageSuggestions(e.target.value);
              } else {
                setShowLanguageSuggestions(false);
              }
            }}
            onKeyDown={(e) => {
              if (showLanguageSuggestions && languageSuggestions.length > 0) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveLanguageSuggestionIndex((prev) =>
                    Math.min(prev + 1, languageSuggestions.length - 1)
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveLanguageSuggestionIndex((prev) =>
                    Math.max(prev - 1, 0)
                  );
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (languageSuggestions[activeLanguageSuggestionIndex]) {
                    handleAddItem(
                      "languages",
                      languageSuggestions[activeLanguageSuggestionIndex]
                    );
                    setNewLanguage("");
                    setShowLanguageSuggestions(false);
                  }
                }
              } else if (e.key === "Enter" && newLanguage) {
                handleAddItem("languages", newLanguage);
                setNewLanguage("");
              }
            }}
            onBlur={() =>
              setTimeout(() => setShowLanguageSuggestions(false), 200)
            }
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
            onClick={() => {
              if (newLanguage) {
                handleAddItem("languages", newLanguage);
                setNewLanguage("");
                setShowLanguageSuggestions(false);
              }
            }}
          >
            Add
          </button>
        </div>

        {/* Language Suggestions Dropdown */}
        {showLanguageSuggestions &&
          newLanguage &&
          languageSuggestions.length > 0 && (
            <ul className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {languageSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer hover:bg-blue-50 ${
                    index === activeLanguageSuggestionIndex ? "bg-blue-100" : ""
                  }`}
                  onClick={() => {
                    handleAddItem("languages", suggestion);
                    setNewLanguage("");
                    setShowLanguageSuggestions(false);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      {/* Interests & Hobbies Section */}
      <div className="space-y-4 relative">
        <h2 className="text-xl font-semibold text-gray-700">
          Interests & Hobbies
        </h2>
        <div className="flex flex-wrap gap-2">
          {(manualForm.interests || []).map((interest, index) => (
            <div
              key={index}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {interest}
              <button
                className="ml-1 text-purple-600"
                onClick={() => handleRemoveItem("interests", index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 relative">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            placeholder="Add an interest or hobby (start typing for suggestions)"
            value={newInterest}
            onChange={(e) => {
              setNewInterest(e.target.value);
              if (e.target.value.length > 0) {
                fetchInterestSuggestions(e.target.value);
              } else {
                setShowInterestSuggestions(false);
              }
            }}
            onKeyDown={(e) => {
              if (showInterestSuggestions && interestSuggestions.length > 0) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveInterestSuggestionIndex((prev) =>
                    Math.min(prev + 1, interestSuggestions.length - 1)
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveInterestSuggestionIndex((prev) =>
                    Math.max(prev - 1, 0)
                  );
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (interestSuggestions[activeInterestSuggestionIndex]) {
                    handleAddItem(
                      "interests",
                      interestSuggestions[activeInterestSuggestionIndex]
                    );
                    setNewInterest("");
                    setShowInterestSuggestions(false);
                  }
                }
              } else if (e.key === "Enter" && newInterest) {
                handleAddItem("interests", newInterest);
                setNewInterest("");
              }
            }}
            onBlur={() =>
              setTimeout(() => setShowInterestSuggestions(false), 200)
            }
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
            onClick={() => {
              if (newInterest) {
                handleAddItem("interests", newInterest);
                setNewInterest("");
                setShowInterestSuggestions(false);
              }
            }}
          >
            Add
          </button>
        </div>

        {/* Interest Suggestions Dropdown */}
        {showInterestSuggestions &&
          newInterest &&
          interestSuggestions.length > 0 && (
            <ul className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {interestSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer hover:bg-blue-50 ${
                    index === activeInterestSuggestionIndex ? "bg-blue-100" : ""
                  }`}
                  onClick={() => {
                    handleAddItem("interests", suggestion);
                    setNewInterest("");
                    setShowInterestSuggestions(false);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      {/* Projects Section */}
      {/* Projects Section */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Projects</h2>
          <div className="text-sm text-gray-500">
            {(manualForm.projects ?? []).length} project(s) added
          </div>
        </div>

        {(manualForm.projects || []).map((project, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md p-4 relative group hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-2 gap-4 mb-3">
              {/* Title */}
              <div className="col-span-2">
                <label className="block text-sm text-gray-500 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                  value={project.title || ""}
                  onChange={(e) =>
                    handleProjectChange(index, "title", e.target.value)
                  }
                  required
                />
                {!project.title && (
                  <p className="text-red-500 text-xs mt-1">Title is required</p>
                )}
              </div>

              {/* Tech Stack (Commented Out) */}
              {/* <div>
          <label className="block text-sm text-gray-500 mb-1">Tech Stack*</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            value={project.tech || ""}
            onChange={(e) => handleProjectChange(index, "tech", e.target.value)}
            required
          />
          {!project.tech && (
            <p className="text-red-500 text-xs mt-1">Tech Stack is required</p>
          )}
        </div> */}

              {/* Start Date */}
              <div>
                <MonthYearPicker
                  label="Start Date*"
                  value={project.startDate || ""}
                  onChange={(value) =>
                    handleProjectChange(index, "startDate", value)
                  }
                  required
                />
                {/* {!project.startDate && (
            <p className="text-red-500 text-xs mt-1">Start Date is required</p>
          )} */}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  End Date
                </label>
                <div className="space-y-2">
                  {project.endDate === "Present" ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                      value="Present"
                      disabled
                      aria-disabled="true"
                    />
                  ) : (
                    <MonthYearPicker
                      value={project.endDate || ""}
                      onChange={(value) =>
                        handleProjectChange(index, "endDate", value)
                      }
                      disabled={project.endDate === "Present"}
                    />
                  )}
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-300 transition-colors"
                      checked={project.endDate === "Present"}
                      onChange={(e) =>
                        handleProjectChange(
                          index,
                          "endDate",
                          e.target.checked ? "Present" : ""
                        )
                      }
                      aria-label="Mark project as currently ongoing"
                    />
                    <span>Currently Ongoing</span>
                    <span
                      className="relative group"
                      title="Check this if you are still working on this project (sets End Date to 'Present')"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-3 col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-gray-500">
                  Description*
                </label>
                <button
                  onClick={async () => {
                    const enhanced = await enhanceField(
                      "project",
                      project.description || "",
                      { title: project.title, tech: project.tech || "" } // Include tech for context, even if commented out
                    );
                    handleProjectChange(index, "description", enhanced);
                  }}
                  className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-200 flex items-center gap-1"
                  disabled={enhancingField === "project"}
                >
                  {enhancingField === "project" ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Enhance with AI
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={4}
                value={project.description || ""}
                onChange={(e) =>
                  handleProjectChange(index, "description", e.target.value)
                }
                onFocus={(e) => {
                  const value = project.description || "";
                  if (!value || !value.endsWith("• ")) {
                    handleProjectChange(index, "description", value + "• ");
                    setTimeout(() => {
                      e.target.selectionStart = e.target.selectionEnd =
                        value.length + 2;
                    }, 0);
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    project.description &&
                    project.description.endsWith("• ")
                  ) {
                    e.preventDefault();
                    handleProjectChange(
                      index,
                      "description",
                      project.description.slice(0, -2)
                    );
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    handleProjectChange(
                      index,
                      "description",
                      project.description + "\n• "
                    );
                  }
                }}
                placeholder="Start typing (bullet points auto-added)..."
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
              />
              {!project.description && (
                <p className="text-red-500 text-xs mt-1">
                  Description is required
                </p>
              )}
              <p className="text-xs text-gray-500 mb-1">
                Tip: Press <kbd className="bg-gray-100 px-1 rounded">Enter</kbd>{" "}
                to create bullet points.
              </p>
            </div>

            <div className="flex gap-2 absolute bottom-2 right-2">
              <button
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                onClick={() => handleRemoveProject(index)}
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
            onClick={handleAddProject}
            disabled={
              manualForm.projects.length > 0 &&
              (!manualForm.projects[manualForm.projects.length - 1]?.title ||
                !manualForm.projects[manualForm.projects.length - 1]
                  ?.startDate ||
                !manualForm.projects[manualForm.projects.length - 1]
                  ?.description)
            }
          >
            Add Project
          </button>
        </div>
      </div>
      {/* Internships Section */}
      {(toggle === "fresher" || showSections.internships) && (
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              {toggle === "fresher" ? "Internships" : "Additional Internships"}
            </h2>
            {/* {toggle==="fresher" && (
              <button
                onClick={() =>
                  setShowSections((prev) => ({ ...prev, internships: false }))
                }
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Hide Section
              </button>
            )} */}
          </div>

          {(manualForm.internships || []).map((internship, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md p-4 relative group hover:bg-gray-50 transition-colors"
            >
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Role*
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    value={internship.role || ""}
                    onChange={(e) =>
                      handleInternshipChange(index, "role", e.target.value)
                    }
                    required
                  />
                  {!internship.role && (
                    <p className="text-red-500 text-xs mt-1">
                      Role is required
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Company*
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    value={internship.company || ""}
                    onChange={(e) =>
                      handleInternshipChange(index, "company", e.target.value)
                    }
                    required
                  />
                  {!internship.company && (
                    <p className="text-red-500 text-xs mt-1">
                      Company is required
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    value={internship.location || ""}
                    onChange={(e) =>
                      handleInternshipChange(index, "location", e.target.value)
                    }
                    required
                    placeholder="City, Country"
                  />
                  {!internship.location && (
                    <p className="text-red-500 text-xs mt-1">
                      Location is required
                    </p>
                  )}
                </div>
                <div>
                  <MonthYearPicker
                    label="Start Date*"
                    value={internship.startDate || ""}
                    onChange={(value) =>
                      handleInternshipChange(index, "startDate", value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    End Date
                  </label>
                  <div className="space-y-2">
                    {internship.endDate === "Present" ? (
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                        value="Present"
                        disabled
                        aria-disabled="true"
                      />
                    ) : (
                      <MonthYearPicker
                        value={internship.endDate || ""}
                        onChange={(value) =>
                          handleInternshipChange(index, "endDate", value)
                        }
                        disabled={internship.endDate === "Present"}
                      />
                    )}
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-300 transition-colors"
                        checked={internship.endDate === "Present"}
                        onChange={(e) =>
                          handleInternshipChange(
                            index,
                            "endDate",
                            e.target.checked ? "Present" : ""
                          )
                        }
                        aria-label="Mark internship as currently ongoing"
                      />
                      <span>Currently Ongoing</span>
                      <span
                        className="relative group"
                        title="Check this if you are still working on this internship (sets End Date to 'Present')"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm text-gray-500">
                    Responsibilities*
                  </label>
                  <button
                    onClick={async () => {
                      const enhanced = await enhanceField(
                        "internship",
                        internship.description || "",
                        { role: internship.role, company: internship.company }
                      );
                      handleInternshipChange(index, "description", enhanced);
                    }}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-200 flex items-center gap-1"
                    disabled={enhancingField === "internship"}
                  >
                    {enhancingField === "internship" ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
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
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Enhance with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={internship.description || ""}
                  onChange={(e) =>
                    handleInternshipChange(index, "description", e.target.value)
                  }
                  onFocus={(e) => {
                    const value = internship.description || "";
                    if (!value || !value.endsWith("• ")) {
                      handleInternshipChange(
                        index,
                        "description",
                        value + "• "
                      );
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd =
                          value.length + 2;
                      }, 0);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      internship.description &&
                      internship.description.endsWith("• ")
                    ) {
                      e.preventDefault();
                      handleInternshipChange(
                        index,
                        "description",
                        internship.description.slice(0, -2)
                      );
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      handleInternshipChange(
                        index,
                        "description",
                        internship.description + "\n• "
                      );
                    }
                  }}
                  placeholder="Start typing (bullet points auto-added)..."
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
                <p className="text-xs text-gray-500 mb-1">
                  Tip: Press{" "}
                  <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> to
                  create bullet points.
                </p>
              </div>

              <div className="flex gap-2 absolute bottom-2 right-2">
                <button
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                  onClick={() => handleRemoveInternship(index)}
                  title="Delete Internship"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              onClick={handleAddInternship}
              disabled={
                manualForm.internships.length > 0 &&
                (!manualForm.internships[manualForm.internships.length - 1]
                  ?.role ||
                  !manualForm.internships[manualForm.internships.length - 1]
                    ?.company ||
                  !manualForm.internships[manualForm.internships.length - 1]
                    ?.startDate ||
                  !manualForm.internships[manualForm.internships.length - 1]
                    ?.description)
              }
            >
              Add Internship
            </button>
          </div>
        </div>
      )}

      {/* Career Objective (for Freshers) */}
      {toggle === "fresher" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Career Objective
            </h2>
            <button
              onClick={generateCareerObjective}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${
                isGenerating
                  ? "bg-gray-200"
                  : "bg-green-100 hover:bg-green-200 text-green-800"
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="4"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                "✨ Generate with AI"
              )}
            </button>
          </div>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            value={manualForm.objective || ""}
            onChange={(e) => handleFieldChange("objective", e.target.value)}
            placeholder="Example: 'Detail-oriented Computer Science graduate seeking a software developer role...'"
          />
        </div>
      )}

      {/* Achievements Section */}
      {showSections.achievements && (
        <div className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Achievements
            </h2>
            <div className="text-sm text-gray-500">
              {(manualForm.achievements ?? []).length} achievement(s) added
            </div>
          </div>

          {(manualForm.achievements || []).map((ach, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md p-4 relative group hover:bg-gray-50 transition-colors"
            >
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    value={ach.title || ""}
                    onChange={(e) =>
                      handleAchievementChange(index, "title", e.target.value)
                    }
                    required
                  />
                  {!ach.title && (
                    <p className="text-red-500 text-xs mt-1">
                      Title is required
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm text-gray-500">
                    Description*
                  </label>
                  <button
                    onClick={async () => {
                      const enhanced = await enhanceField(
                        "achievements",
                        ach.description || "",
                        { title: ach.title }
                      );
                      handleAchievementChange(index, "description", enhanced);
                    }}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-200 flex items-center gap-1"
                    disabled={enhancingField === "achievements"}
                  >
                    {enhancingField === "achievements" ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
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
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Enhance with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={ach.description || ""}
                  onChange={(e) =>
                    handleAchievementChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  onFocus={(e) => {
                    const value = ach.description || "";
                    if (!value || !value.endsWith("• ")) {
                      handleAchievementChange(
                        index,
                        "description",
                        value + "• "
                      );
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd =
                          value.length + 2;
                      }, 0);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      ach.description &&
                      ach.description.endsWith("• ")
                    ) {
                      e.preventDefault();
                      handleAchievementChange(
                        index,
                        "description",
                        ach.description.slice(0, -2)
                      );
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      handleAchievementChange(
                        index,
                        "description",
                        ach.description + "\n• "
                      );
                    }
                  }}
                  placeholder="Start typing (bullet points auto-added)..."
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
                <p className="text-xs text-gray-500 mb-1">
                  Tip: Press{" "}
                  <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> to
                  create bullet points.
                </p>
              </div>

              <div className="flex gap-2 absolute bottom-2 right-2">
                <button
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                  onClick={() => handleRemoveAchievement(index)}
                  title="Delete Achievement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              onClick={handleAddAchievement}
              disabled={
                manualForm.achievements.length > 0 &&
                (!manualForm.achievements[manualForm.achievements.length - 1]
                  ?.title ||
                  !manualForm.achievements[manualForm.achievements.length - 1]
                    ?.description)
              }
            >
              Add Achievement
            </button>
          </div>
        </div>
      )}
      {/* Certifications Section */}
      {showSections.certifications && (
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Certifications
            </h2>
            <div className="text-sm text-gray-500">
              {(manualForm.certifications ?? []).length} certification(s) added
            </div>
          </div>

          {(manualForm.certifications || []).map((cert, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md p-4 relative group hover:bg-gray-50 transition-all duration-200 
             shadow-sm hover:shadow-md"
            >
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    value={cert.name || ""}
                    onChange={(e) =>
                      handleCertificationChange(index, "name", e.target.value)
                    }
                    required
                  />
                  {!cert.name && (
                    <p className="text-red-500 text-xs mt-1">
                      Title is required
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Issuer*
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    value={cert.issuer || ""}
                    onChange={(e) =>
                      handleCertificationChange(index, "issuer", e.target.value)
                    }
                    required
                  />
                  {!cert.issuer && (
                    <p className="text-red-500 text-xs mt-1">
                      Issuer is required
                    </p>
                  )}
                </div>
                <div>
                  <MonthYearPicker
                    label="Date*"
                    value={cert.date || ""}
                    onChange={(value) =>
                      handleCertificationChange(index, "date", value)
                    }
                    required
                  />
                  {/* {!cert.date && (
                    <p className="text-red-500 text-xs mt-1">
                      Date is required
                    </p>
                  )} */}
                </div>
              </div>

              <div className="flex gap-2 absolute bottom-2 right-2">
                <button
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                  onClick={() => handleRemoveCertification(index)}
                  title="Delete Certification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              onClick={handleAddCertification}
              disabled={
                manualForm.certifications.length > 0 &&
                (!manualForm.certifications[
                  manualForm.certifications.length - 1
                ]?.name ||
                  !manualForm.certifications[
                    manualForm.certifications.length - 1
                  ]?.issuer ||
                  !manualForm.certifications[
                    manualForm.certifications.length - 1
                  ]?.date)
              }
            >
              Add Certification
            </button>
          </div>
        </div>
      )}
      {/* new sections */}
      <div className="animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-700">
          Additional Sections
        </h2>
        <div className="flex flex-wrap gap-3 my-4">
          {/* Internships Toggle (only for Experienced when not already shown) */}
          {toggle === "experienced" && !showSections.internships && (
            <button
              onClick={() =>
                setShowSections((prev) => ({
                  ...prev,
                  internships: true,
                }))
              }
              className="px-4 py-2 rounded-md text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 transition-all duration-300 transform hover:scale-105"
            >
              + Add Internships
            </button>
          )}

          {/* Achievements Toggle */}
          <button
            onClick={() =>
              setShowSections((prev) => ({
                ...prev,
                achievements: !prev.achievements,
              }))
            }
            className={`px-4 py-2 rounded-md text-sm transition-all duration-300 transform hover:scale-105 ${
              showSections.achievements
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {showSections.achievements
              ? "▲ Hide Achievements"
              : "+ Add Achievements"}
          </button>

          {/* Certifications Toggle */}
          <button
            onClick={() =>
              setShowSections((prev) => ({
                ...prev,
                certifications: !prev.certifications,
              }))
            }
            className={`px-4 py-2 rounded-md text-sm transition-all duration-300 transform hover:scale-105 ${
              showSections.certifications
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
            }`}
          >
            {showSections.certifications
              ? "▲ Hide Certifications"
              : "+ Add Certifications"}
          </button>
        </div>
      </div>
    </section>
  );
}