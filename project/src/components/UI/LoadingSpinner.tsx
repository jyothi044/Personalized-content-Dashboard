import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-500 dark:border-t-blue-400" />
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
        </div>
        
        {/* Sparkle effects */}
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -left-2">
          <Sparkles className="w-3 h-3 text-purple-500 animate-pulse delay-300" />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Loading amazing content...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Curating the best for you
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;