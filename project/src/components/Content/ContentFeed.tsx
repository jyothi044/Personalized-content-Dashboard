import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { RootState } from '../../store';
import { fetchNews, fetchMovies, fetchSocialPosts, ContentItem } from '../../store/slices/contentSlice';
import { updateContentOrder } from '../../store/slices/userSlice';
import ContentCard from './ContentCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import EmptyState from '../UI/EmptyState';

const ContentFeed: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    news, 
    movies, 
    social, 
    searchResults, 
    loading, 
    error, 
    hasMore, 
    page 
  } = useSelector((state: RootState) => state.content);
  const { preferences, favorites, contentOrder } = useSelector((state: RootState) => state.user);
  const { activeSection, searchQuery } = useSelector((state: RootState) => state.ui);

  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Initial data fetch
  useEffect(() => {
    if (activeSection === 'feed') {
      dispatch(fetchNews({ 
        categories: preferences.categories, 
        countries: preferences.newsCountries,
        page: 1 
      }));
      dispatch(fetchMovies({ 
        genres: preferences.movieGenres, 
        page: 1 
      }));
      dispatch(fetchSocialPosts({ 
        hashtags: preferences.socialHashtags, 
        page: 1 
      }));
    }
  }, [dispatch, preferences, activeSection]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (activeSection === 'feed' && !loading.news && hasMore.news) {
      dispatch(fetchNews({ 
        categories: preferences.categories, 
        countries: preferences.newsCountries,
        page: page.news + 1 
      }));
    }
    if (activeSection === 'feed' && !loading.movies && hasMore.movies) {
      dispatch(fetchMovies({ 
        genres: preferences.movieGenres, 
        page: page.movies + 1 
      }));
    }
    if (activeSection === 'feed' && !loading.social && hasMore.social) {
      dispatch(fetchSocialPosts({ 
        hashtags: preferences.socialHashtags, 
        page: page.social + 1 
      }));
    }
  }, [dispatch, activeSection, loading, hasMore, page, preferences]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  const getAllContent = (): ContentItem[] => {
    switch (activeSection) {
      case 'search':
        return searchResults;
      case 'favorites':
        return [...news, ...movies, ...social].filter(item => favorites.includes(item.id));
      case 'trending':
        // Mock trending logic - in real app, this would be from API
        return [...news, ...movies, ...social]
          .slice(0, 20)
          .sort((a, b) => {
            // Prioritize by type and recency
            if (a.type === 'news' && b.type !== 'news') return -1;
            if (a.type !== 'news' && b.type === 'news') return 1;
            return Math.random() - 0.5;
          });
      case 'feed':
      default:
        const allItems = [...news, ...movies, ...social];
        
        // Apply custom order if available
        if (contentOrder.length > 0) {
          const orderedItems: ContentItem[] = [];
          const remainingItems = [...allItems];
          
          contentOrder.forEach(id => {
            const item = remainingItems.find(item => item.id === id);
            if (item) {
              orderedItems.push(item);
              remainingItems.splice(remainingItems.indexOf(item), 1);
            }
          });
          
          return [...orderedItems, ...remainingItems];
        }
        
        // Default: interleave content types for better variety
        const newsItems = allItems.filter(item => item.type === 'news');
        const movieItems = allItems.filter(item => item.type === 'movie');
        const socialItems = allItems.filter(item => item.type === 'social');
        
        const interleavedItems: ContentItem[] = [];
        const maxLength = Math.max(newsItems.length, movieItems.length, socialItems.length);
        
        for (let i = 0; i < maxLength; i++) {
          if (newsItems[i]) interleavedItems.push(newsItems[i]);
          if (movieItems[i]) interleavedItems.push(movieItems[i]);
          if (socialItems[i]) interleavedItems.push(socialItems[i]);
        }
        
        return interleavedItems;
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || activeSection !== 'feed') return;

    const items = getAllContent();
    const newOrder = Array.from(items);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    dispatch(updateContentOrder(newOrder.map(item => item.id)));
  };

  const content = getAllContent();
  const isLoading = loading.news || loading.movies || loading.social || loading.search;
  const hasError = error.news || error.movies || error.social || error.search;

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'search':
        return `Search Results for "${searchQuery}"`;
      case 'favorites':
        return 'Your Favorites';
      case 'trending':
        return 'Trending Content';
      case 'feed':
      default:
        return 'Personalized Feed';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'search':
        return `${content.length} results found across all content types`;
      case 'favorites':
        return `${content.length} items you've saved for later`;
      case 'trending':
        return 'Popular content across all categories right now';
      case 'feed':
      default:
        return 'AI-curated content based on your preferences. Drag and drop to customize your layout.';
    }
  };

  const getEmptyMessage = () => {
    switch (activeSection) {
      case 'search':
        return 'No search results found. Try different keywords or check your spelling.';
      case 'favorites':
        return 'No favorites yet. Start adding content to your favorites by clicking the heart icon!';
      case 'trending':
        return 'No trending content available right now. Check back later for updates.';
      case 'feed':
      default:
        return 'No content available. Check your preferences in settings or verify your API keys.';
    }
  };

  if (hasError) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/50 dark:border-red-800/50 rounded-3xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full translate-y-12 -translate-x-12" />
            
            <div className="relative">
              <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-3">
                Content Loading Error
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4 leading-relaxed">
                {hasError}
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm mb-6 leading-relaxed">
                This might be due to missing API keys or API rate limits. The app will use mock data as fallback.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10 transition-all duration-500">
      <div className="p-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 rounded-3xl blur-3xl" />
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-3">
                {getSectionTitle()}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {getSectionDescription()}
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {content.length === 0 && !isLoading ? (
          <div className="max-w-4xl mx-auto">
            <EmptyState message={getEmptyMessage()} />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="content-feed">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  >
                    {content.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        isDragDisabled={activeSection !== 'feed'}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all duration-300 ${
                              snapshot.isDragging 
                                ? 'transform rotate-3 scale-105 shadow-2xl z-50' 
                                : 'hover:z-10'
                            }`}
                          >
                            <ContentCard
                              item={item}
                              draggable={activeSection === 'feed'}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {/* Infinite scroll trigger */}
        {activeSection === 'feed' && (hasMore.news || hasMore.movies || hasMore.social) && (
          <div ref={ref} className="mt-12 flex justify-center">
            {isLoading && <LoadingSpinner />}
          </div>
        )}

        {/* Loading overlay for initial load */}
        {isLoading && content.length === 0 && (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentFeed;