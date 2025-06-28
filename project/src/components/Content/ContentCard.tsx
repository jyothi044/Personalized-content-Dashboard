import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ExternalLink, Star, Calendar, User, Hash, Clock, Film, Eye, MessageCircle, Share2 } from 'lucide-react';
import { ContentItem } from '../../store/slices/contentSlice';
import { addFavorite, removeFavorite } from '../../store/slices/userSlice';
import { RootState } from '../../store';

interface ContentCardProps {
  item: ContentItem;
  draggable?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, draggable = false }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state: RootState) => state.user);
  const isFavorite = favorites.includes(item.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(item.id));
    } else {
      dispatch(addFavorite(item.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTypeConfig = (type: ContentItem['type']) => {
    switch (type) {
      case 'news': 
        return {
          gradient: 'from-blue-500 to-cyan-500',
          bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
          label: 'News',
          icon: Eye
        };
      case 'movie': 
        return {
          gradient: 'from-purple-500 to-pink-500',
          bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
          label: 'Movie',
          icon: Film
        };
      case 'social': 
        return {
          gradient: 'from-green-500 to-teal-500',
          bgGradient: 'from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20',
          label: 'Social',
          icon: MessageCircle
        };
      default: 
        return {
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
          label: 'Content',
          icon: Eye
        };
    }
  };

  const typeConfig = getTypeConfig(item.type);

  const renderContent = () => {
    switch (item.type) {
      case 'news':
        return (
          <>
            <div className="relative overflow-hidden group/image">
              <img
                src={item.urlToImage}
                alt={item.title}
                className="w-full h-56 object-cover transition-all duration-500 group-hover/image:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/518543?auto=compress&cs=tinysrgb&w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
              
              {/* Type badge */}
              <div className={`absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r ${typeConfig.gradient} text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center space-x-1`}>
                <typeConfig.icon className="w-3 h-3" />
                <span>{typeConfig.label}</span>
              </div>

              {/* Reading time estimate */}
              <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                3 min read
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.publishedAt)}</span>
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span className="font-medium">{item.source.name}</span>
                </div>
              </div>
            </div>
          </>
        );

      case 'movie':
        return (
          <>
            <div className="relative overflow-hidden group/image">
              <img
                src={item.poster_path}
                alt={item.title}
                className="w-full h-56 object-cover transition-all duration-500 group-hover/image:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/436413?auto=compress&cs=tinysrgb&w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
              
              {/* Type badge */}
              <div className={`absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r ${typeConfig.gradient} text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center space-x-1`}>
                <typeConfig.icon className="w-3 h-3" />
                <span>{typeConfig.label}</span>
              </div>

              {/* Rating */}
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center space-x-1 font-bold">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                <span>{item.vote_average.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                {item.overview}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.release_date}</span>
                  </span>
                  {item.runtime && (
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.runtime}</span>
                    </span>
                  )}
                </div>
                {item.genre && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Film className="w-3 h-3" />
                    <span className="line-clamp-1 font-medium">{item.genre}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'social':
        return (
          <>
            <div className="relative bg-gradient-to-br from-green-400 via-teal-500 to-blue-500 h-56 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
              
              {/* Type badge */}
              <div className={`absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r ${typeConfig.gradient} text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center space-x-1`}>
                <typeConfig.icon className="w-3 h-3" />
                <span>{typeConfig.label}</span>
              </div>
              
              <div className="relative text-center text-white p-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 opacity-90" />
                </div>
                <p className="font-bold text-lg">@{item.username}</p>
                <p className="text-white/80 text-sm mt-1">Social Creator</p>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                {item.body}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {item.hashtags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium">
                      <Hash className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:scale-[1.02] ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      draggable={draggable}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative">
        {renderContent()}
        
        {/* Action bar */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            onClick={handleFavoriteToggle}
            className={`group/heart relative p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
              isFavorite
                ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-current scale-110' : 'group-hover/heart:scale-110'}`} />
            {isFavorite && (
              <div className="absolute inset-0 bg-red-500/20 rounded-2xl animate-ping" />
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-110">
              <Share2 className="w-4 h-4" />
            </button>
            
            <button
              className={`flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r ${typeConfig.gradient} text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold text-sm`}
              onClick={() => {
                if (item.type === 'news') {
                  window.open(item.url, '_blank');
                }
              }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>
                {item.type === 'news' ? 'Read More' : 
                 item.type === 'movie' ? 'View Details' : 'View Post'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;