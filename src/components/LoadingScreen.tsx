import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
