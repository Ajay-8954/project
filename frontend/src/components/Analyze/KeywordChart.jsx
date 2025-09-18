import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChartIcon } from "lucide-react";

const KeywordChart = ({ keywordGaps }) => {
  if (!keywordGaps) return null;
  const data = [
    {
      name: "Keywords Fit",
      Matched:
        (keywordGaps.present_keywords?.length || 0) +
        (keywordGaps.matched_qualifications?.length || 0),
      Missing:
        (keywordGaps.missing_keywords?.length || 0) +
        (keywordGaps.missing_qualifications?.length || 0),
    },
  ];
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border">
      <h4 className="font-semibold text-lg mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
        <BarChartIcon size={20} /> Resume vs. Job Description Fit
      </h4>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={data} layout="vertical" barSize={30}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip cursor={{ fill: "rgba(240, 240, 240, 0.5)" }} />
          <Legend wrapperStyle={{ position: "relative", marginTop: "10px" }} />
          <Bar
            dataKey="Matched"
            stackId="a"
            fill="#16a34a"
            name="Matched Keywords"
          />
          <Bar
            dataKey="Missing"
            stackId="a"
            fill="#dc2626"
            name="Missing Keywords"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KeywordChart;