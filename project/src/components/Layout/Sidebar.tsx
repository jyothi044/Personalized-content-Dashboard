import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Home, TrendingUp, Heart, Search, X, Sparkles } from 'lucide-react';
import { RootState } from '../../store';
import { setActiveSection, toggleSidebar } from '../../store/slices/uiSlice';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, activeSection, searchQuery } = useSelector((state: RootState) => state.ui);
  const { favorites } = useSelector((state: RootState) => state.user);

  const menuItems = [
    { 
      id: 'feed' as const, 
      label: 'Personalized Feed', 
      icon: Home, 
      count: null,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Your curated content'
    },
    { 
      id: 'trending' as const, 
      label: 'Trending', 
      icon: TrendingUp, 
      count: null,
      gradient: 'from-orange-500 to-red-500',
      description: 'What\'s hot right now'
    },
    { 
      id: 'favorites' as const, 
      label: 'Favorites', 
      icon: Heart, 
      count: favorites.length,
      gradient: 'from-pink-500 to-rose-500',
      description: 'Your saved content'
    },
    ...(searchQuery ? [{ 
      id: 'search' as const, 
      label: 'Search Results', 
      icon: Search, 
      count: null,
      gradient: 'from-purple-500 to-indigo-500',
      description: 'Search findings'
    }] : []),
  ];

  const handleSectionClick = (section: typeof activeSection) => {
    dispatch(setActiveSection(section));
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-50 transform transition-all duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Dashboard
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  AI-Powered
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 hover:scale-105"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={`group relative w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] ${
                activeSection === item.id
                  ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
              }`}
            >
              {/* Background glow for active item */}
              {activeSection === item.id && (
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur-xl opacity-30 -z-10`} />
              )}
              
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                activeSection === item.id 
                  ? 'bg-white/20' 
                  : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
              }`}>
                <item.icon className={`w-5 h-5 transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold transition-all duration-300 ${
                    activeSection === item.id ? 'text-white' : ''
                  }`}>
                    {item.label}
                  </span>
                  {item.count !== null && item.count > 0 && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'text-white/80' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;