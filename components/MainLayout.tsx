import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import ImageGenerator from './ImageGenerator';
import AppInfo from './AppInfo';
import TermsAndAgreements from './TermsAndAgreements';
import { MoreIcon } from './icons/MoreIcon';
import DropdownMenu from './DropdownMenu';
import { PlusIcon } from './icons/PlusIcon';
import { View } from '../types';

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(Date.now());

  const handleNewChat = () => {
    localStorage.removeItem('chatHistory_main');
    setChatSessionId(Date.now()); 
  };

  const renderView = () => {
    switch (currentView) {
      case 'imageGenerator':
        return <ImageGenerator />;
      case 'appInfo':
        return <AppInfo />;
      case 'terms':
        return <TermsAndAgreements />;
      case 'chat':
      default:
        // By passing a key, we ensure the component re-mounts and resets its state on new chat
        return <ChatInterface key={chatSessionId} />;
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center p-2 sm:p-4 font-sans antialiased">
      <header className="w-full max-w-4xl py-4 sm:py-6 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
              Melisa AI
            </h1>
          </div>
           {currentView === 'chat' && (
             <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-300 transition-colors"
              aria-label="Start new chat"
            >
              <PlusIcon />
              New Chat
            </button>
           )}
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
            aria-label="More options"
          >
            <MoreIcon />
          </button>
          <DropdownMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)}
            onSelect={setCurrentView}
            currentView={currentView}
          />
        </div>
      </header>
      <main className="w-full flex-grow flex flex-col items-center pb-4 min-h-0">
        {renderView()}
      </main>
    </div>
  );
};

export default MainLayout;