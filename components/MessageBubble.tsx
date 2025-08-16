import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MessageBubbleProps {
  message: Message;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-3">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
  </div>
);

const GroundingSources: React.FC<{ metadata: any[] }> = ({ metadata }) => {
  const sources = metadata.map(item => item.web || item.retrievedContext?.groundingSource);
  const validSources = sources.filter(source => source && source.uri && source.title);

  if (validSources.length === 0) return null;

  return (
    <div className="mt-3 border-t border-gray-600 pt-3">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources:</h4>
        <div className="flex flex-wrap gap-2">
            {validSources.map((source, index) => (
                <a 
                    key={index}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-gray-600/50 hover:bg-gray-600 text-indigo-300 px-2 py-1 rounded-md transition-colors truncate max-w-xs"
                    title={source.title}
                >
                   {index + 1}. {source.title}
                </a>
            ))}
        </div>
    </div>
  );
};


const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.sender === Sender.User;
  const isBotTyping = message.sender === Sender.Bot && message.text.trim() === '' && !message.groundingMetadata;

  const handleCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(message.text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const bubbleClasses = isUser
    ? 'bg-indigo-600 text-white rounded-br-none'
    : 'bg-gray-700 text-gray-200 rounded-bl-none';

  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  const avatar = isUser ? <UserIcon /> : <BotIcon />;

  return (
    <div className={`group flex items-end gap-3 ${containerClasses}`}>
      {!isUser && <div className="flex-shrink-0">{avatar}</div>}
      <div
        className={`relative max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-md ${bubbleClasses}`}
      >
        {isBotTyping ? (
          <TypingIndicator />
        ) : (
          <>
            <div className="prose prose-sm max-w-none break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {message.text}
              </ReactMarkdown>
            </div>
            {message.groundingMetadata && <GroundingSources metadata={message.groundingMetadata} />}
          </>
        )}
        {!isUser && !isBotTyping && message.text && (
          <button
            onClick={handleCopy}
            className="absolute -bottom-3 -right-3 p-1.5 bg-gray-600 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Copy message"
          >
            {isCopied ? <CheckIcon /> : <ClipboardIcon />}
          </button>
        )}
      </div>
      {isUser && <div className="flex-shrink-0">{avatar}</div>}
    </div>
  );
};

export default MessageBubble;