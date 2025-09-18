const EngagingLoader = () => (
  <div className="relative w-40 h-40">
    <div className="absolute inset-0 rounded-full border-2 border-purple-300 opacity-50 animate-pulse"></div>
    <div
      className="absolute inset-3 rounded-full border-2 border-purple-400 opacity-50 animate-pulse"
      style={{ animationDelay: "0.2s" }}
    ></div>
    <div
      className="absolute inset-6 rounded-full border-2 border-purple-500 opacity-50 animate-pulse"
      style={{ animationDelay: "0.4s" }}
    ></div>
    <div
      className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent to-purple-500 origin-left animate-spin"
      style={{ animationDuration: "2s" }}
    ></div>
  </div>
);

const LoadingView = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-purple-600">
    <EngagingLoader />
    <p className="text-2xl font-medium mt-8 tracking-wider text-gray-700">
      ANALYZING YOUR FUTURE...
    </p>
    <p className="text-gray-500 mt-2">
      Our AI is meticulously scanning your resume.
    </p>
  </div>
);

export default LoadingView;