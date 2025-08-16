
import React from 'react';

export const BotIcon: React.FC = () => (
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 16l-2.5 -4.5l2.5 -4.5l5 9l5 -9l2.5 4.5l-2.5 4.5l-5 -9z" />
      <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    </svg>
  </div>
);
