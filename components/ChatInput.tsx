
import React, { useState } from 'react';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
      <textarea
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask Melisa anything..."
        className="flex-grow bg-gray-900/80 border border-gray-600 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200 disabled:opacity-50"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed transform active:scale-95"
      >
        <SendIcon />
      </button>
    </form>
  );
};

export default ChatInput;
