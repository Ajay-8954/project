import { useNavigate } from "react-router-dom";
import Microsoft from "./templates/Microsoft";
import Google from "./templates/Google";
import Meta from "./templates/Meta";
import useResumeStore from "../store/useResumeStore"; // Import useResumeStore to access manualForm and resumeId
import Template4 from "./templates/Template4";
import Template5 from "./templates/Template5";
import Template6 from "./templates/Template6"

// Dummy data for template previews
const dummyData = {
  Name: "Rahul Verma",
  jobTitle: "Full Stack Developer",
  email: "rahul.verma@example.com",
  phone: "+91-9876543210",
  location: "Bangalore, India",
  linkedin: "https://linkedin.com/in/rahulverma",
  github: "https://github.com/rahulverma",
  summary:
    "Detail-oriented and passionate full stack developer with 2+ years of experience building scalable web applications using MERN stack. Adept at solving complex problems and delivering high-quality code.",
  objective:
    "To leverage my technical and problem-solving skills to contribute to a forward-thinking tech company and grow as a software engineer.",
  experience: [
    {
      jobTitle: "Software Engineer",
      company: "TechNova Solutions",
      startDate: "June 2022",
      endDate: "Present",
      description:
        "Developed and maintained full stack web applications using React, Node.js, and MongoDB. Implemented RESTful APIs and optimized performance by 30%.",
    },
  ],
  internship: [
    {
      jobTitle: "Web Development Intern",
      company: "CodeWave",
      startDate: "Jan 2022",
      endDate: "May 2022",
      description:
        "Worked on frontend modules using HTML, CSS, JavaScript, and React. Collaborated in Agile sprints and contributed to bug fixes and feature development.",
    },
  ],
  education: [
    {
      degree: "Bachelor of Technology",
      school: "Indian Institute of Technology, Delhi",
      level: "Undergraduate",
      startDate: "2018",
      endDate: "2022",
      cgpa: "8.5/10",
    },
  ],
  skills: [
    "JavaScript",
    "React.js",
    "Node.js",
    "MongoDB",
    "Express",
    "Git",
    "HTML",
    "CSS",
  ],
  languages: ["English", "Hindi"],
  interests: ["Photography", "Open Source Contribution", "Chess"],
  achievements: [
    {
      title: "LeetCode 500+ Problems Solved",
      description:
        "Solved over 500 algorithmic problems on LeetCode with consistent top 10% rankings in contests.",
    },
    {
      title: "Winner - Smart India Hackathon 2021",
      description:
        "Led a team of 4 to build a government-approved solution for road safety and traffic analysis.",
    },
  ],
  projects: [
    {
      title: "College Connect Portal",
      startDate: "Feb 2022",
      endDate: "May 2022",
      tech: "React, Node.js, MongoDB, Express",
      description: [
        "Built a MERN-based platform for students to share notes, schedule events, and form project groups.",
        "Implemented authentication, file uploads, and real-time chat using Socket.io.",
      ],
    },
    {
      title: "Personal Portfolio Website",
      startDate: "Aug 2021",
      endDate: "Sept 2021",
      tech: "React, TailwindCSS",
      description: [
        "Created a personal website to showcase projects and blog posts.",
        "Deployed on Netlify with responsive design and smooth scroll features.",
      ],
    },
  ],
  certifications: [
    {
      name: "Full Stack Web Development",
      issuer: "Coursera - Meta",
      Date: "April 2023",
    },
    {
      name: "Data Structures & Algorithms",
      issuer: "Udemy",
      Date: "December 2022",
    },
  ],
};

// Template configurations
const templates = [
  {
    id: "microsoft",
    name: "Modern",
    description: "Clean, corporate style",
    PreviewComponent: Microsoft,
  },
  {
    id: "google",
    name: "Classic",
    description: "Modern and minimalistic",
    PreviewComponent: Google,
  },
  {
    id: "meta",
    name: "Slate",
    description: "Elegant, serif font style",
    PreviewComponent: Meta,
  },
  {
      id: "template4",
    name: "simple",
    description: "non-ats",
    PreviewComponent: Template4,
  },
  {
    id: "template5",
    name:"management",
    description:"",
    PreviewComponent: Template5,
  },{
    id: "template6",
    name: "marketing manager",
    description:"marketing manager ",
    PreviewComponent: Template6,
  }
];

export default function TemplateSelection() {
  const navigate = useNavigate();
  // Access manualForm, resumeId, and setTemplate from useResumeStore
  const { manualForm, resumeId, setTemplate, template } = useResumeStore();

  // Handle template selection
  const handleSelect = (id) => {
    console.log("Selecting template:", id);
    setTemplate(id); // Update template in store
    // Navigate to builder with current manualForm and resumeId to preserve form data
    navigate(`/builder/${id}`, {
      state: {
        content: manualForm || {}, // Pass current manualForm to prevent reset
        resumeId: resumeId || null,
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-white via-blue-50 to-blue-100">
      <div className="w-[240px] overflow-y-auto h-screen border-0 border-blue-100 bg-white p-4">
        <h1 className="font-bold text-center text-blue-800 mb-6">
          Choose Resume Template
        </h1>

        <div>
          {templates.map(({ id, name, description, PreviewComponent }) => {
            const isActive = template === id; // ✅ check active

            return (
              <div
                key={id}
                onClick={() => handleSelect(id)}
                className={`bg-white rounded-xl p-3 cursor-pointer transition-all duration-200 group
                  ${isActive 
                    ? "border-2 border-blue-500 shadow-lg scale-[1.02]" // Highlight style
                    : "border border-blue-100 shadow-sm hover:shadow-lg hover:scale-[1.01]"
                  }`}
                title={`Click to build with the ${name} template`}
              >
                <div className="text-center mb-2">
                  <h3 className="text-md font-semibold text-blue-800">{name}</h3>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>

                <div className="h-[170px] overflow-hidden bg-white rounded-md border border-gray-200 shadow-inner p-2">
                  <div className="transform scale-[0.21] origin-top-left pointer-events-none w-[650px]">
                    <PreviewComponent data={dummyData} />
                  </div>
                </div>

                <div className={`mt-2 text-center text-xs font-medium transition-opacity
                  ${isActive 
                    ? "text-blue-600 opacity-100" 
                    : "text-gray-400 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {isActive ? "✔ Selected" : "Click to select this template"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}