import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Save, Settings as SettingsIcon, Sparkles, Zap, Globe, Film, Hash, CheckCircle } from 'lucide-react';
import { RootState } from '../../store';
import { toggleSettings } from '../../store/slices/uiSlice';
import { setPreferences, UserPreferences } from '../../store/slices/userSlice';

const SettingsPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { settingsOpen } = useSelector((state: RootState) => state.ui);
  const { preferences } = useSelector((state: RootState) => state.user);
  
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);

  const categories = [
    { id: 'technology', label: 'Technology', icon: '💻', color: 'from-blue-500 to-cyan-500' },
    { id: 'business', label: 'Business', icon: '💼', color: 'from-green-500 to-emerald-500' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'from-purple-500 to-pink-500' },
    { id: 'health', label: 'Health', icon: '🏥', color: 'from-red-500 to-orange-500' },
    { id: 'science', label: 'Science', icon: '🔬', color: 'from-indigo-500 to-blue-500' },
    { id: 'sports', label: 'Sports', icon: '⚽', color: 'from-orange-500 to-yellow-500' },
    { id: 'general', label: 'General', icon: '📰', color: 'from-gray-500 to-gray-600' },
    { id: 'politics', label: 'Politics', icon: '🏛️', color: 'from-slate-500 to-gray-500' }
  ];

  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
  ];

  const movieGenres = [
    { id: 'Action', label: 'Action', icon: '💥', color: 'from-red-500 to-orange-500' },
    { id: 'Comedy', label: 'Comedy', icon: '😂', color: 'from-yellow-500 to-orange-500' },
    { id: 'Drama', label: 'Drama', icon: '🎭', color: 'from-purple-500 to-indigo-500' },
    { id: 'Horror', label: 'Horror', icon: '👻', color: 'from-gray-800 to-red-900' },
    { id: 'Romance', label: 'Romance', icon: '💕', color: 'from-pink-500 to-rose-500' },
    { id: 'Sci-Fi', label: 'Sci-Fi', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
    { id: 'Fantasy', label: 'Fantasy', icon: '🧙', color: 'from-purple-500 to-pink-500' },
    { id: 'Animation', label: 'Animation', icon: '🎨', color: 'from-green-500 to-teal-500' }
  ];

  const handleSave = () => {
    dispatch(setPreferences(localPreferences));
    dispatch(toggleSettings());
  };

  const updateCategories = (category: string) => {
    const newCategories = localPreferences.categories.includes(category)
      ? localPreferences.categories.filter(c => c !== category)
      : [...localPreferences.categories, category];
    
    setLocalPreferences({
      ...localPreferences,
      categories: newCategories,
    });
  };

  const updateCountries = (country: string) => {
    const newCountries = localPreferences.newsCountries.includes(country)
      ? localPreferences.newsCountries.filter(c => c !== country)
      : [...localPreferences.newsCountries, country];
    
    setLocalPreferences({
      ...localPreferences,
      newsCountries: newCountries,
    });
  };

  const updateGenres = (genre: string) => {
    const newGenres = localPreferences.movieGenres.includes(genre)
      ? localPreferences.movieGenres.filter(g => g !== genre)
      : [...localPreferences.movieGenres, genre];
    
    setLocalPreferences({
      ...localPreferences,
      movieGenres: newGenres,
    });
  };

  const updateHashtags = (hashtags: string) => {
    setLocalPreferences({
      ...localPreferences,
      socialHashtags: hashtags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
  };

  if (!settingsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20 pointer-events-none" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-8 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Content Preferences
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Customize your AI-powered content recommendations
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleSettings())}
            className="p-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-2xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto p-8 space-y-8">
          {/* News Categories */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                News Categories
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-11">
              Select the news topics you're most interested in
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-11">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => updateCategories(category.id)}
                  className={`group relative p-4 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    localPreferences.categories.includes(category.id)
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {localPreferences.categories.includes(category.id) && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-2xl blur-xl opacity-30 -z-10`} />
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.label}</span>
                  </div>
                  {localPreferences.categories.includes(category.id) && (
                    <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* News Countries */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                News Countries
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-11">
              Choose which countries' news you'd like to see
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-11">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => updateCountries(country.code)}
                  className={`group relative p-4 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    localPreferences.newsCountries.includes(country.code)
                      ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {localPreferences.newsCountries.includes(country.code) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl blur-xl opacity-30 -z-10" />
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                  {localPreferences.newsCountries.includes(country.code) && (
                    <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Movie Genres */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Movie Genres
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-11">
              Pick your favorite movie genres for personalized recommendations
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-11">
              {movieGenres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => updateGenres(genre.id)}
                  className={`group relative p-4 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    localPreferences.movieGenres.includes(genre.id)
                      ? `bg-gradient-to-r ${genre.color} text-white shadow-lg`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {localPreferences.movieGenres.includes(genre.id) && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${genre.color} rounded-2xl blur-xl opacity-30 -z-10`} />
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{genre.icon}</span>
                    <span>{genre.label}</span>
                  </div>
                  {localPreferences.movieGenres.includes(genre.id) && (
                    <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Social Hashtags */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Hash className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Social Media Hashtags
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-11">
              Enter hashtags to follow trending social media content
            </p>
            <div className="ml-11">
              <input
                type="text"
                placeholder="Enter hashtags separated by commas (e.g., tech, design, programming)"
                value={localPreferences.socialHashtags.join(', ')}
                onChange={(e) => updateHashtags(e.target.value)}
                className="w-full px-4 py-4 bg-gray-100/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white placeholder-gray-500 transition-all duration-200 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* API Status */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-green-50/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-800 dark:text-green-200 text-lg mb-2">
                    ✅ API Services Connected
                  </h4>
                  <p className="text-green-700 dark:text-green-300 mb-4 leading-relaxed">
                    Your dashboard is connected to real-time data sources for the best content experience:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4">
                      <h5 className="font-semibold text-green-800 dark:text-green-200 mb-1">📰 Mediastack API</h5>
                      <p className="text-sm text-green-700 dark:text-green-300">Real news from trusted global sources</p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4">
                      <h5 className="font-semibold text-green-800 dark:text-green-200 mb-1">🎬 OMDb API</h5>
                      <p className="text-sm text-green-700 dark:text-green-300">Comprehensive movie database</p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4">
                      <h5 className="font-semibold text-green-800 dark:text-green-200 mb-1">💬 Social API</h5>
                      <p className="text-sm text-green-700 dark:text-green-300">Social media content simulation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex justify-end space-x-4 p-8 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={() => dispatch(toggleSettings())}
            className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-2xl transition-all duration-200 hover:scale-105 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="relative group px-8 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex items-center space-x-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <Save className="relative w-5 h-5" />
            <span className="relative">Save Preferences</span>
            <Sparkles className="relative w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;