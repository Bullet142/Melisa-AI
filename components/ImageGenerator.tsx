import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { BotIcon } from './icons/BotIcon';
import { DownloadIcon } from './icons/DownloadIcon';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const base64Image = await generateImage(prompt.trim());
      setImageUrl(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
      console.error('Image generation failed:', err);
      setError('Sorry, I couldn\'t create that image. Please try a different prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl h-full flex flex-col bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50">
      <div className="p-4 sm:p-6 border-b border-gray-700/50">
        <h2 className="text-xl font-bold text-center text-white">AI Image Generator</h2>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {isLoading ? (
          <div className="text-center">
             <div className="animate-spin mb-4">
                <BotIcon />
            </div>
            <p className="text-gray-400">Melisa is creating your image...</p>
            <p className="text-xs text-gray-500 mt-2">This may take a moment.</p>
          </div>
        ) : imageUrl ? (
          <div className="text-center">
            <img src={imageUrl} alt={prompt} className="max-w-full max-h-[calc(100%-60px)] rounded-lg shadow-lg object-contain" />
            <a
              href={imageUrl}
              download={`melisa-ai-${prompt.slice(0, 20).replace(/\s/g, '_')}.jpeg`}
              className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-green-600 rounded-xl text-white font-semibold hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-all duration-200"
            >
              <DownloadIcon />
              Download Image
            </a>
          </div>
        ) : (
          <div className="text-center text-gray-400">
             <BotIcon />
            <p className="mt-4">Describe the image you want to create.</p>
          </div>
        )}
         {error && <div className="mt-4 text-center text-red-400 text-sm">{error}</div>}
      </div>
      <div className="p-4 sm:p-6 border-t border-gray-700/50">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A robot holding a red skateboard"
            className="flex-grow bg-gray-900/80 border border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200 disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-5 py-3 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Generate
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageGenerator;
