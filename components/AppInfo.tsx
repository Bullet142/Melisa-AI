import React from 'react';

const AppInfo: React.FC = () => {
  return (
    <div className="w-full max-w-4xl h-full flex flex-col bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 sm:p-8 text-gray-300 overflow-y-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text mb-4">
        About Melisa AI
      </h2>
      <p className="mb-6">
        Melisa is a conversational AI designed to be a helpful assistant. She can answer your questions and generate images from your descriptions.
      </p>
       <footer className="mt-auto pt-6 text-center text-sm text-gray-400">
        <p>Melisa is developed by BULLETXTECHNOLOGIES.</p>
      </footer>
    </div>
  );
};

export default AppInfo;