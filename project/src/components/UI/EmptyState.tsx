import React from 'react';
import { FileText, Search, Heart, TrendingUp, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  const getIcon = () => {
    if (message.includes('search')) return Search;
    if (message.includes('favorites')) return Heart;
    if (message.includes('trending')) return TrendingUp;
    return FileText;
  };

  const Icon = getIcon();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="relative mb-8">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-full blur-3xl scale-150" />
        
        {/* Icon container */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center shadow-lg">
          <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          
          {/* Decorative sparkles */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-blue-400 opacity-60" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles className="w-4 h-4 text-purple-400 opacity-60" />
          </div>
        </div>
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Content Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
          {message}
        </p>
        
        {/* Suggestion based on message type */}
        {message.includes('preferences') && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              💡 Try updating your content preferences in the settings to get personalized recommendations.
            </p>
          </div>
        )}
        
        {message.includes('search') && (
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
            <p className="text-purple-700 dark:text-purple-300 text-sm">
              💡 Try using different keywords or check your spelling for better search results.
            </p>
          </div>
        )}
        
        {message.includes('favorites') && (
          <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-2xl border border-pink-200/50 dark:border-pink-800/50">
            <p className="text-pink-700 dark:text-pink-300 text-sm">
              💡 Browse through the feed and click the heart icon on content you'd like to save.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;