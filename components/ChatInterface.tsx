import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender } from '../types';
import { getChatStream } from '../services/geminiService';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyKey = 'chatHistory_main';

  // Load chat history from localStorage on initial render
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(historyKey);
      if (storedHistory) {
        setMessages(JSON.parse(storedHistory));
      } else {
        setMessages([
          {
            id: '0',
            text: "Hello! I'm Melisa. How can I help you today?",
            sender: Sender.Bot,
          },
        ]);
      }
    } catch (e) {
      console.error("Failed to parse chat history:", e);
       setMessages([
          {
            id: '0',
            text: "Hello! I'm Melisa. How can I help you today?",
            sender: Sender.Bot,
          },
        ]);
    }
  }, [historyKey]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 1) { // Avoid saving just the initial welcome message
      localStorage.setItem(historyKey, JSON.stringify(messages));
    }
  }, [messages, historyKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text, sender: Sender.User };
    const botMessageId = (Date.now() + 1).toString();
    
    // The state `messages` here is the history *before* the new user message. This is what we'll send to the API.
    const historyForApi = [...messages];

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: botMessageId, text: '', sender: Sender.Bot },
    ]);
    
    setIsLoading(true);
    setError(null);

    try {
      const stream = await getChatStream(text, historyForApi);
      let fullResponseText = '';
      let groundingMetadata: any[] | undefined = undefined;
      
      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponseText += chunk.text;
        }
        if(chunk.groundingMetadata) {
          groundingMetadata = chunk.groundingMetadata;
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: fullResponseText, groundingMetadata } : msg
          )
        );
      }

    } catch (e: any) {
      console.error("Error sending message:", e);
      const errorMessage = `Sorry, I encountered an error. Please try again.`;
      setError(errorMessage);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: errorMessage, sender: Sender.Bot } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-4xl h-full flex flex-col bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50">
      <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
       {isLoading && (
        <div className="p-2 text-center text-gray-400 text-sm font-medium">
          Melisa is thinking...
        </div>
      )}
      {error && <div className="p-4 text-center text-red-400 text-sm">{error}</div>}
      <div className="p-4 sm:p-6 border-t border-gray-700/50">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;