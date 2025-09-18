import { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Target, FileText, BookOpen, PenTool, Palette } from "lucide-react";

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

export default AnalysisCategory;