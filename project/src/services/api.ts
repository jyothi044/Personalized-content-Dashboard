// API configuration and service functions
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY || '0b1564e0524432cdd218cdf5f6bf5bb8';
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'd65eb1b3';

// Base URLs
const MEDIASTACK_BASE_URL = 'https://api.mediastack.com/v1';
const OMDB_BASE_URL = 'https://www.omdbapi.com';
const SOCIAL_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Track API status to avoid repeated failed requests
let mediastackApiStatus = 'active'; // 'active', 'rate_limited', 'error'
let lastRateLimitCheck = 0;
const RATE_LIMIT_COOLDOWN = 60000; // 1 minute cooldown

// High-quality news images from Pexels categorized by topic
const NEWS_IMAGES = {
  technology: [
    'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  business: [
    'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/265073/pexels-photo-265073.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/265125/pexels-photo-265125.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  entertainment: [
    'https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/274131/pexels-photo-274131.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/274140/pexels-photo-274140.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/274200/pexels-photo-274200.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/274230/pexels-photo-274230.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/274234/pexels-photo-274234.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/274240/pexels-photo-274240.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/274260/pexels-photo-274260.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/274290/pexels-photo-274290.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  health: [
    'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/433267/pexels-photo-433267.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  science: [
    'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2280551/pexels-photo-2280551.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/256559/pexels-photo-256559.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/256621/pexels-photo-256621.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  sports: [
    'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248548/pexels-photo-248548.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248549/pexels-photo-248549.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248550/pexels-photo-248550.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248551/pexels-photo-248551.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248552/pexels-photo-248552.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248553/pexels-photo-248553.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248554/pexels-photo-248554.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248555/pexels-photo-248555.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/248556/pexels-photo-248556.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  general: [
    'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/518544/pexels-photo-518544.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/518545/pexels-photo-518545.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/518546/pexels-photo-518546.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/518547/pexels-photo-518547.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/518548/pexels-photo-518548.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/518549/pexels-photo-518549.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/518550/pexels-photo-518550.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/518551/pexels-photo-518551.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/518552/pexels-photo-518552.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]
};

// News API service using Mediastack
export const newsApi = {
  getTopHeadlines: async (categories: string[], countries: string[] = ['us'], page: number = 1) => {
    // Check if we're in a rate limit cooldown period
    const now = Date.now();
    if (mediastackApiStatus === 'rate_limited' && (now - lastRateLimitCheck) < RATE_LIMIT_COOLDOWN) {
      console.info('Mediastack API is in cooldown period, using mock data');
      return generateMockNews(categories, page);
    }

    try {
      const category = categories[0] || 'general';
      const country = countries[0] || 'us';
      
      // Mediastack API parameters
      const params = new URLSearchParams({
        access_key: MEDIASTACK_API_KEY,
        countries: country,
        categories: category,
        limit: '20',
        offset: ((page - 1) * 20).toString(),
        sort: 'published_desc'
      });
      
      const url = `${MEDIASTACK_BASE_URL}/news?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PersonalizedContentDashboard/1.0',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText } };
        }
        
        if (response.status === 401) {
          console.warn('Mediastack API authentication failed. Using mock data.');
          console.info('To use real news data, get a free API key at: https://mediastack.com and set VITE_MEDIASTACK_API_KEY in your .env file');
          mediastackApiStatus = 'error';
        } else if (response.status === 429) {
          console.warn('Mediastack API rate limit exceeded. Using mock data for the next minute.');
          console.info('To avoid rate limits, get your own API key at: https://mediastack.com and set VITE_MEDIASTACK_API_KEY in your .env file');
          mediastackApiStatus = 'rate_limited';
          lastRateLimitCheck = now;
        } else {
          console.warn(`Mediastack API error (${response.status}): ${errorData.error?.message || 'Unknown error'}. Using mock data.`);
          mediastackApiStatus = 'error';
        }
        
        return generateMockNews(categories, page);
      }
      
      const data = await response.json();
      
      // Check for API errors in response
      if (data.error) {
        console.warn('Mediastack API error:', data.error.message || 'Unknown error');
        console.info('Using mock data. For real news data, get your own API key at: https://mediastack.com');
        mediastackApiStatus = 'error';
        return generateMockNews(categories, page);
      }
      
      // Reset status on successful request
      mediastackApiStatus = 'active';
      return data.data || [];
    } catch (error) {
      console.warn('Mediastack API connection error. Using mock data.');
      console.info('For real news data, ensure you have a valid API key from https://mediastack.com');
      mediastackApiStatus = 'error';
      return generateMockNews(categories, page);
    }
  },

  searchNews: async (query: string) => {
    // Check if we're in a rate limit cooldown period
    const now = Date.now();
    if (mediastackApiStatus === 'rate_limited' && (now - lastRateLimitCheck) < RATE_LIMIT_COOLDOWN) {
      console.info('Mediastack API is in cooldown period, using mock search data');
      return generateMockNewsSearch(query);
    }

    try {
      const params = new URLSearchParams({
        access_key: MEDIASTACK_API_KEY,
        keywords: query,
        limit: '10',
        sort: 'published_desc'
      });
      
      const url = `${MEDIASTACK_BASE_URL}/news?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PersonalizedContentDashboard/1.0',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText } };
        }

        if (response.status === 401) {
          console.warn('Mediastack API authentication failed. Using mock search data.');
          console.info('To use real news search, get a free API key at: https://mediastack.com and set VITE_MEDIASTACK_API_KEY in your .env file');
          mediastackApiStatus = 'error';
        } else if (response.status === 429) {
          console.warn('Mediastack API rate limit exceeded. Using mock search data for the next minute.');
          console.info('To avoid rate limits, get your own API key at: https://mediastack.com and set VITE_MEDIASTACK_API_KEY in your .env file');
          mediastackApiStatus = 'rate_limited';
          lastRateLimitCheck = now;
        } else {
          console.warn(`Mediastack search error (${response.status}): ${errorData.error?.message || 'Unknown error'}. Using mock data.`);
          mediastackApiStatus = 'error';
        }

        return generateMockNewsSearch(query);
      }
      
      const data = await response.json();
      
      // Check for API errors in response
      if (data.error) {
        console.warn('Mediastack search error:', data.error.message || 'Unknown error');
        console.info('Using mock search data. For real news search, get your own API key at: https://mediastack.com');
        mediastackApiStatus = 'error';
        return generateMockNewsSearch(query);
      }
      
      // Reset status on successful request
      mediastackApiStatus = 'active';
      return data.data || [];
    } catch (error) {
      console.warn('Mediastack search connection error. Using mock data.');
      console.info('For real news search, ensure you have a valid API key from https://mediastack.com');
      mediastackApiStatus = 'error';
      return generateMockNewsSearch(query);
    }
  }
};

// OMDb API service for movies
export const omdbApi = {
  getPopularMovies: async (page: number = 1) => {
    try {
      // OMDb doesn't have a "popular movies" endpoint, so we'll search for popular movie titles
      const popularMovieTitles = [
        'Avengers', 'Spider-Man', 'Batman', 'Superman', 'Iron Man', 'Thor', 'Captain America',
        'Guardians of the Galaxy', 'Wonder Woman', 'Black Panther', 'Deadpool', 'X-Men',
        'Fast and Furious', 'Mission Impossible', 'John Wick', 'Matrix', 'Star Wars', 'Jurassic Park',
        'Transformers', 'Pirates of the Caribbean', 'Harry Potter', 'Lord of the Rings', 'Hobbit',
        'Inception', 'Interstellar', 'Dark Knight', 'Joker', 'Aquaman', 'Shazam', 'Venom'
      ];
      
      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      const moviesToFetch = popularMovieTitles.slice(startIndex, endIndex);
      
      const moviePromises = moviesToFetch.map(async (title) => {
        try {
          const response = await fetch(
            `${OMDB_BASE_URL}/?s=${encodeURIComponent(title)}&type=movie&apikey=${OMDB_API_KEY}`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'PersonalizedContentDashboard/1.0',
              }
            }
          );
          const data = await response.json();
          
          if (data.Search && data.Search.length > 0) {
            // Get detailed info for the first result
            const detailResponse = await fetch(
              `${OMDB_BASE_URL}/?i=${data.Search[0].imdbID}&apikey=${OMDB_API_KEY}`,
              {
                headers: {
                  'Accept': 'application/json',
                  'User-Agent': 'PersonalizedContentDashboard/1.0',
                }
              }
            );
            return await detailResponse.json();
          }
          return null;
        } catch (error) {
          console.error(`Error fetching movie ${title}:`, error);
          return null;
        }
      });
      
      const movies = await Promise.all(moviePromises);
      return movies.filter(movie => movie && movie.Response === 'True');
    } catch (error) {
      console.error('OMDb API error:', error);
      return generateMockMovies(page);
    }
  },

  getMoviesByGenre: async (genres: string[], page: number = 1) => {
    try {
      // OMDb doesn't support genre filtering directly, so we'll search by genre keywords
      const genreKeywords = {
        'Action': ['action', 'adventure', 'superhero'],
        'Comedy': ['comedy', 'funny', 'humor'],
        'Drama': ['drama', 'emotional', 'story'],
        'Horror': ['horror', 'scary', 'thriller'],
        'Romance': ['romance', 'love', 'romantic'],
        'Sci-Fi': ['science fiction', 'sci-fi', 'space'],
        'Fantasy': ['fantasy', 'magic', 'wizard'],
        'Animation': ['animation', 'animated', 'cartoon']
      };
      
      const selectedGenre = genres[0] || 'Action';
      const keywords = genreKeywords[selectedGenre] || ['movie'];
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      const response = await fetch(
        `${OMDB_BASE_URL}/?s=${encodeURIComponent(keyword)}&type=movie&page=${page}&apikey=${OMDB_API_KEY}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'PersonalizedContentDashboard/1.0',
          }
        }
      );
      
      const data = await response.json();
      
      if (data.Search) {
        // Get detailed info for each movie
        const detailPromises = data.Search.slice(0, 10).map(async (movie: any) => {
          try {
            const detailResponse = await fetch(
              `${OMDB_BASE_URL}/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`,
              {
                headers: {
                  'Accept': 'application/json',
                  'User-Agent': 'PersonalizedContentDashboard/1.0',
                }
              }
            );
            return await detailResponse.json();
          } catch (error) {
            return null;
          }
        });
        
        const detailedMovies = await Promise.all(detailPromises);
        return detailedMovies.filter(movie => movie && movie.Response === 'True');
      }
      
      return [];
    } catch (error) {
      console.error('OMDb genre search error:', error);
      return generateMockMovies(page);
    }
  },

  searchMovies: async (query: string) => {
    try {
      const response = await fetch(
        `${OMDB_BASE_URL}/?s=${encodeURIComponent(query)}&type=movie&apikey=${OMDB_API_KEY}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'PersonalizedContentDashboard/1.0',
          }
        }
      );
      
      const data = await response.json();
      
      if (data.Search) {
        // Get detailed info for first 5 results
        const detailPromises = data.Search.slice(0, 5).map(async (movie: any) => {
          try {
            const detailResponse = await fetch(
              `${OMDB_BASE_URL}/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`,
              {
                headers: {
                  'Accept': 'application/json',
                  'User-Agent': 'PersonalizedContentDashboard/1.0',
                }
              }
            );
            return await detailResponse.json();
          } catch (error) {
            return null;
          }
        });
        
        const detailedMovies = await Promise.all(detailPromises);
        return detailedMovies.filter(movie => movie && movie.Response === 'True');
      }
      
      return [];
    } catch (error) {
      console.error('OMDb search error:', error);
      return [];
    }
  }
};

// Social API service (using JSONPlaceholder as mock)
export const socialApi = {
  getPosts: async (page: number = 1) => {
    try {
      const response = await fetch(`${SOCIAL_BASE_URL}/posts?_page=${page}&_limit=20`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PersonalizedContentDashboard/1.0',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Social API error: ${response.status}`);
      }
      
      const posts = await response.json();
      
      // Get users for additional data
      const usersResponse = await fetch(`${SOCIAL_BASE_URL}/users`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PersonalizedContentDashboard/1.0',
        }
      });
      const users = await usersResponse.json();
      
      return posts.map((post: any) => {
        const user = users.find((u: any) => u.id === post.userId);
        return {
          ...post,
          username: user?.username || `user${post.userId}`,
          hashtags: generateHashtags(),
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
      });
    } catch (error) {
      console.error('Social API error:', error);
      return generateMockSocialPosts(page);
    }
  },

  searchPosts: async (query: string) => {
    try {
      const response = await fetch(`${SOCIAL_BASE_URL}/posts`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PersonalizedContentDashboard/1.0',
        }
      });
      const posts = await response.json();
      
      const filtered = posts.filter((post: any) => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      
      const usersResponse = await fetch(`${SOCIAL_BASE_URL}/users`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PersonalizedContentDashboard/1.0',
        }
      });
      const users = await usersResponse.json();
      
      return filtered.map((post: any) => {
        const user = users.find((u: any) => u.id === post.userId);
        return {
          ...post,
          username: user?.username || `user${post.userId}`,
          hashtags: generateHashtags(),
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
      });
    } catch (error) {
      console.error('Social search error:', error);
      return [];
    }
  }
};

// Helper function to get category-specific image
function getCategoryImage(category: string, index: number): string {
  const categoryImages = NEWS_IMAGES[category] || NEWS_IMAGES.general;
  return categoryImages[index % categoryImages.length];
}

// Helper functions for mock data fallbacks
function generateMockNews(categories: string[], page: number) {
  const categoryTitles = {
    'general': ['Breaking News', 'Latest Updates', 'Current Events', 'Today\'s Headlines'],
    'business': ['Market Update', 'Economic News', 'Business Report', 'Financial Analysis'],
    'technology': ['Tech Innovation', 'Digital Trends', 'Software Update', 'AI Development'],
    'sports': ['Sports Update', 'Game Results', 'Athletic Performance', 'Championship News'],
    'entertainment': ['Celebrity News', 'Movie Release', 'Entertainment Update', 'Show Review'],
    'health': ['Health Study', 'Medical Breakthrough', 'Wellness Tips', 'Healthcare News'],
    'science': ['Scientific Discovery', 'Research Findings', 'Space Exploration', 'Innovation']
  };

  const category = categories[0] || 'general';
  const titles = categoryTitles[category] || categoryTitles['general'];

  return Array.from({ length: 20 }, (_, i) => ({
    title: `${titles[i % titles.length]} ${page * 20 + i + 1}`,
    description: `This is a sample news description for ${category} category. It provides relevant information about current events and developments in the field. Stay informed with the latest updates and analysis.`,
    url: `https://example.com/news/${page * 20 + i + 1}`,
    image: getCategoryImage(category, page * 20 + i),
    published_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'NewsSource',
    author: 'News Reporter',
    category: category,
    country: 'us',
    language: 'en'
  }));
}

function generateMockNewsSearch(query: string) {
  return Array.from({ length: 10 }, (_, i) => ({
    title: `${query} Related News Story ${i + 1}`,
    description: `This is a search result for "${query}". The article covers relevant topics and provides detailed information about your search query with expert analysis and insights.`,
    url: `https://example.com/search/${query}/${i + 1}`,
    image: getCategoryImage('general', i),
    published_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'SearchNews',
    author: 'Search Reporter',
    category: 'general',
    country: 'us',
    language: 'en'
  }));
}

function generateMockMovies(page: number) {
  const movieTitles = [
    'Epic Adventure', 'Mystery Thriller', 'Romantic Comedy', 'Action Hero',
    'Space Odyssey', 'Fantasy Quest', 'Horror Night', 'Drama Story',
    'Animated Fun', 'Superhero Rise', 'Crime Investigation', 'War Story'
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    imdbID: `tt${page}${i.toString().padStart(6, '0')}`,
    Title: `${movieTitles[i % movieTitles.length]} ${page * 10 + i + 1}`,
    Plot: `This is an exciting movie that falls into your preferred genres. A thrilling story with great characters and stunning visuals that will keep you entertained from start to finish.`,
    Poster: `https://images.pexels.com/photos/${2000000 + (page * 10 + i)}?auto=compress&cs=tinysrgb&w=300&h=450`,
    Year: (2020 + Math.floor(Math.random() * 5)).toString(),
    imdbRating: (7.5 + Math.random() * 2).toFixed(1),
    Runtime: `${90 + Math.floor(Math.random() * 60)} min`,
    Genre: 'Action, Adventure, Drama',
    Director: 'Famous Director',
    Actors: 'Star Actor, Leading Actress, Supporting Actor',
    Response: 'True',
  }));
}

function generateMockSocialPosts(page: number) {
  const hashtags = ['tech', 'design', 'programming', 'innovation', 'startup', 'ai', 'web', 'mobile'];
  const postTopics = [
    'Latest tech trends', 'Design inspiration', 'Programming tips', 'Innovation insights',
    'Startup journey', 'AI developments', 'Web development', 'Mobile apps',
    'User experience', 'Digital transformation', 'Creative process', 'Industry news'
  ];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: page * 20 + i + 1,
    title: `${postTopics[i % postTopics.length]} ${page * 20 + i + 1}`,
    body: `This is a social media post discussing current trends in technology and innovation. It's engaging content that sparks conversation and provides value to the community. Join the discussion!`,
    userId: (i % 10) + 1,
    username: `user${(i % 10) + 1}`,
    hashtags: hashtags.slice(0, Math.floor(Math.random() * 3) + 1),
    createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

function generateHashtags() {
  const allHashtags = ['tech', 'design', 'programming', 'innovation', 'startup', 'ai', 'web', 'mobile', 'ux', 'ui'];
  const count = Math.floor(Math.random() * 3) + 1;
  return allHashtags.sort(() => 0.5 - Math.random()).slice(0, count);
}

// Image URL helpers
export const getImageUrl = {
  omdb: (url: string) => {
    if (!url || url === 'N/A' || url.includes('null')) {
      return 'https://images.pexels.com/photos/436413?auto=compress&cs=tinysrgb&w=400';
    }
    return url;
  },
  
  news: (url: string) => {
    if (!url || url.includes('null')) {
      return 'https://images.pexels.com/photos/518543?auto=compress&cs=tinysrgb&w=400';
    }
    return url;
  }
};