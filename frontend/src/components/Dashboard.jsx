import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Edit2,
  Trash2,
  PlusCircle,
  Check,
  X,
  Sparkles,
  PenTool,
} from "lucide-react";
import useResumeStore from "../store/useResumeStore"; // Import useResumeStore to set template
// Import your template components
import Google from "./templates/Google";
import Meta from "./templates/Meta";
import Microsoft from "./templates/Microsoft";
import Template4 from "./templates/Template4";
import Template5 from "./templates/Template5";
import Template6 from "./templates/Template6";

const Dashboard = () => {
  const [editingResumeId, setEditingResumeId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const navigate = useNavigate();
  const { setTemplate } = useResumeStore(); // Access setTemplate from store

  const handleEditTitle = (resumeId, currentTitle) => {
    console.log(`Editing title for resume ID: ${resumeId}`);
    setEditingResumeId(resumeId);
    setNewTitle(currentTitle || "Untitled Resume");
  };

  const handleSaveTitle = async (resumeId) => {
    console.log(`Saving title for resume ID: ${resumeId}`, { newTitle });
    try {
      await axios.put(
        `http://localhost:5000/update-title/${resumeId}`,
        { title: newTitle },
        { withCredentials: true }
      );
      setResumes(
        resumes.map((resume) =>
          resume._id === resumeId ? { ...resume, title: newTitle } : resume
        )
      );
      setToast({
        message: "Title updated successfully",
        type: "success",
        visible: true,
      });
      setTimeout(
        () => setToast({ message: "", type: "", visible: false }),
        3000
      );
      setEditingResumeId(null);
      setNewTitle("");
    } catch (err) {
      console.error(
        "Failed to update title:",
        err.response?.data || err.message
      );
      setToast({
        message: "Failed to update title",
        type: "error",
        visible: true,
      });
      setTimeout(
        () => setToast({ message: "", type: "", visible: false }),
        3000
      );
    }
  };

  const handleCancelEdit = () => {
    console.log("Cancelled title edit");
    setEditingResumeId(null);
    setNewTitle("");
  };

  const renderPreview = (templateId, data) => {
    const props = { data };
    switch (templateId) {
      case "google":
        return <Google {...props} />;
      case "meta":
        return <Meta {...props} />;
      case "microsoft":
        return <Microsoft {...props} />;
      case "template4":
        return <Template4 {...props}/>
      case "template5":
        return <Template5 {...props}/>
      case "template6":
        return <Template6 {...props}/>
      default:
        return (
          <div className="text-center text-gray-500 py-10 px-4">
            {templateId
              ? `Template "${templateId}" not supported`
              : "Template not specified"}
          </div>
        );
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/validate",
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);
    } catch (err) {
      console.error("Failed to validate user:", err);
      navigate("/login");
    }
  };

  const fetchResumes = async () => {
    setLoadingResumes(true);
    try {
      const response = await axios.get("http://localhost:5000/my-resumes", {
        withCredentials: true,
      });
      setResumes(response.data.resumes || []);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      setResumes([]);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleCreateNew = () => {
    console.log("Action: Navigate to create new resume.");
    setTemplate("microsoft"); // Set default template in store
    navigate("/builder/microsoft", {
      state: {
        content: {},
        resumeId: null,
        template: "microsoft", // Explicitly pass template
      },
    });
  };

  const handleAnalyzeScore = () => {
    console.log("Action: Navigate to analyze resume.");
    navigate("/analyze");
  };

  const handleSelect = (resume) => {
    console.log("Selecting resume:", resume._id, resume.template);
    setTemplate(resume.template); // Update template in store
    navigate(`/builder/${resume.template}`, {
      state: {
        content: resume.content || {},
        resumeId: resume._id,
        template: resume.template, // Pass template for consistency
      },
    });
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await axios.delete(`http://localhost:5000/delete_resume/${resumeId}`, {
        withCredentials: true,
      });
      alert("Resume deleted!");
      setResumes(resumes.filter((r) => r._id !== resumeId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete resume");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchResumes();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-700 font-sans">
        <div className="animate-pulse">
          <PlusCircle size={64} className="text-blue-400 mb-4" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
        <p className="text-lg">Authenticating and loading your resumes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toast.visible && (
          <div
            className={`fixed top-4 right-4 px-4 py-2 rounded-md text-white text-sm font-medium shadow-lg transition-all duration-300 z-50 ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 lg:mb-12 border-b-2 border-gray-200 pb-4 md:pb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 text-gray-900">
              Hello, {user.username}!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Manage your professional profiles here.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto mt-4 md:mt-0">
            <button
              onClick={handleCreateNew}
              className="group flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-white bg-blue-500 hover:bg-purple-400 rounded-lg text-base sm:text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
              aria-label="Create New Resume"
            >
              <PenTool
                className="mr-1 sm:mr-2 transition-transform duration-300 group-hover:rotate-12"
                size={18}
              />
              <span className="text-sm sm:text-base">Create New</span>
            </button>
            <button
              onClick={handleAnalyzeScore}
              className="group flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 border border-slate-300 text-slate-700 bg-green-400 hover:bg-slate-400 rounded-lg text-base sm:text-lg font-semibold shadow-sm transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
              aria-label="Analyze Score"
            >
              <Sparkles size={18} className="mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Analyze Score</span>
            </button>
          </div>
        </div>

        {/* Your Resumes Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
            Your Resumes
          </h2>

          {loadingResumes ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg sm:text-xl font-medium text-gray-600">
                Loading your resumes...
              </p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 bg-white rounded-xl shadow-lg border border-gray-200 px-4">
              <p className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4 text-center">
                Ready to make an impression?
              </p>
              <p className="text-base sm:text-lg text-gray-500 mb-4 sm:mb-6 text-center max-w-md">
                You haven't created any resumes yet. Let's get started with your
                first one!
              </p>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 md:px-7 md:py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-75 transform hover:-translate-y-1"
                aria-label="Create Your First Resume"
              >
                <PlusCircle size={20} className="sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base md:text-lg">Create Your First Resume</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {resumes.map((resume) => {
                const previewScale = 0.35;
                const previewHeight = 200;
                const aspectRatio = 0.79;
                const previewWidth = previewHeight * aspectRatio;

                return (
                  <div
                    key={resume._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border border-gray-200 flex flex-col"
                    style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
                  >
                    {/* Resume Preview Area */}
                    <div
                      className="relative overflow-hidden bg-white cursor-pointer"
                      style={{
                        width: `${previewWidth}px`,
                        height: `${previewHeight}px`,
                        margin: "0 auto",
                      }}
                      onClick={() => handleSelect(resume)}
                    >
                      <div
                        className="absolute top-0 left-0"
                        style={{
                          width: `${previewWidth / previewScale}px`,
                          height: `${previewHeight / previewScale}px`,
                          transform: `scale(${previewScale})`,
                          transformOrigin: "top left",
                        }}
                      >
                        {renderPreview(resume.template, resume.content)}
                      </div>
                    </div>

                    {/* Title and Actions */}
                    <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 bg-gray-50 border-t border-gray-200">
                      {editingResumeId === resume._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="border border-gray-300 px-2 py-1 text-sm rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveTitle(resume._id);
                            }}
                            className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                            title="Save Title"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelEdit();
                            }}
                            className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                            title="Cancel Edit"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                            {resume.title || "Untitled Resume"}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTitle(resume._id, resume.title);
                            }}
                            className="p-1 text-blue-500 hover:text-blue-600 transition-colors duration-200"
                            title="Edit Title"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-gray-500">
                        Template:{" "}
                        {resume.template
                          ? resume.template.charAt(0).toUpperCase() +
                            resume.template.slice(1)
                          : "N/A"}
                      </p>
                      <div className="flex gap-2 sm:gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resume._id);
                          }}
                          className="flex-1 py-1.5 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-xs sm:text-sm font-medium"
                          title="Delete Resume"
                        >
                          <Trash2 size={14} className="inline mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;