import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { newsApi, omdbApi, socialApi, getImageUrl } from '../../services/api';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
  author?: string;
  type: 'news';
}

export interface MovieItem {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime?: string;
  genre?: string;
  director?: string;
  actors?: string;
  type: 'movie';
}

export interface SocialItem {
  id: string;
  title: string;
  body: string;
  userId: number;
  username: string;
  hashtags: string[];
  type: 'social';
  createdAt: string;
}

export type ContentItem = NewsItem | MovieItem | SocialItem;

interface ContentState {
  news: NewsItem[];
  movies: MovieItem[];
  social: SocialItem[];
  trending: ContentItem[];
  searchResults: ContentItem[];
  loading: {
    news: boolean;
    movies: boolean;
    social: boolean;
    search: boolean;
  };
  error: {
    news: string | null;
    movies: string | null;
    social: string | null;
    search: string | null;
  };
  hasMore: {
    news: boolean;
    movies: boolean;
    social: boolean;
  };
  page: {
    news: number;
    movies: number;
    social: number;
  };
}

const initialState: ContentState = {
  news: [],
  movies: [],
  social: [],
  trending: [],
  searchResults: [],
  loading: {
    news: false,
    movies: false,
    social: false,
    search: false,
  },
  error: {
    news: null,
    movies: null,
    social: null,
    search: null,
  },
  hasMore: {
    news: true,
    movies: true,
    social: true,
  },
  page: {
    news: 1,
    movies: 1,
    social: 1,
  },
};

// News API thunk (using Mediastack)
export const fetchNews = createAsyncThunk(
  'content/fetchNews',
  async ({ categories, countries, page = 1 }: { categories: string[]; countries?: string[]; page?: number }) => {
    try {
      const articles = await newsApi.getTopHeadlines(categories, countries, page);
      
      const newsItems: NewsItem[] = articles.map((article: any, index: number) => ({
        id: `news-${page}-${index}-${Date.now()}`,
        title: article.title || 'No title available',
        description: article.description || 'No description available',
        url: article.url || '#',
        urlToImage: getImageUrl.news(article.image || article.urlToImage),
        publishedAt: article.published_at || article.publishedAt || new Date().toISOString(),
        source: { name: article.source || 'Unknown Source' },
        author: article.author,
        type: 'news' as const,
      }));
      
      return { news: newsItems, page };
    } catch (error) {
      throw new Error('Failed to fetch news');
    }
  }
);

// Movies API thunk (using OMDb)
export const fetchMovies = createAsyncThunk(
  'content/fetchMovies',
  async ({ genres, page = 1 }: { genres: string[]; page?: number }) => {
    try {
      const movies = genres.length > 0 
        ? await omdbApi.getMoviesByGenre(genres, page)
        : await omdbApi.getPopularMovies(page);
      
      const movieItems: MovieItem[] = movies.map((movie: any) => ({
        id: `movie-${movie.imdbID}`,
        title: movie.Title || 'Unknown Title',
        overview: movie.Plot || 'No plot available',
        poster_path: getImageUrl.omdb(movie.Poster),
        release_date: movie.Year || '2024',
        vote_average: parseFloat(movie.imdbRating) || 0,
        runtime: movie.Runtime,
        genre: movie.Genre,
        director: movie.Director,
        actors: movie.Actors,
        type: 'movie' as const,
      }));
      
      return { movies: movieItems, page };
    } catch (error) {
      throw new Error('Failed to fetch movies');
    }
  }
);

// Social posts thunk
export const fetchSocialPosts = createAsyncThunk(
  'content/fetchSocialPosts',
  async ({ hashtags, page = 1 }: { hashtags: string[]; page?: number }) => {
    try {
      const posts = await socialApi.getPosts(page);
      
      const socialItems: SocialItem[] = posts.map((post: any) => ({
        id: `social-${post.id}-${page}`,
        title: post.title || 'Untitled Post',
        body: post.body || 'No content available',
        userId: post.userId || 1,
        username: post.username || `user${post.userId}`,
        hashtags: post.hashtags || hashtags.slice(0, 2),
        type: 'social' as const,
        createdAt: post.createdAt || new Date().toISOString(),
      }));
      
      return { social: socialItems, page };
    } catch (error) {
      throw new Error('Failed to fetch social posts');
    }
  }
);

// Search content thunk
export const searchContent = createAsyncThunk(
  'content/searchContent',
  async (query: string) => {
    try {
      const [newsResults, movieResults, socialResults] = await Promise.allSettled([
        newsApi.searchNews(query),
        omdbApi.searchMovies(query),
        socialApi.searchPosts(query),
      ]);
      
      const results: ContentItem[] = [];
      
      // Process news results (Mediastack format)
      if (newsResults.status === 'fulfilled') {
        const newsItems: NewsItem[] = newsResults.value.slice(0, 5).map((article: any, index: number) => ({
          id: `search-news-${index}-${Date.now()}`,
          title: article.title || 'No title available',
          description: article.description || 'No description available',
          url: article.url || '#',
          urlToImage: getImageUrl.news(article.image || article.urlToImage),
          publishedAt: article.published_at || article.publishedAt || new Date().toISOString(),
          source: { name: article.source || 'Unknown Source' },
          author: article.author,
          type: 'news' as const,
        }));
        results.push(...newsItems);
      }
      
      // Process movie results
      if (movieResults.status === 'fulfilled') {
        const movieItems: MovieItem[] = movieResults.value.slice(0, 5).map((movie: any) => ({
          id: `search-movie-${movie.imdbID}`,
          title: movie.Title || 'Unknown Title',
          overview: movie.Plot || 'No plot available',
          poster_path: getImageUrl.omdb(movie.Poster),
          release_date: movie.Year || '2024',
          vote_average: parseFloat(movie.imdbRating) || 0,
          runtime: movie.Runtime,
          genre: movie.Genre,
          director: movie.Director,
          actors: movie.Actors,
          type: 'movie' as const,
        }));
        results.push(...movieItems);
      }
      
      // Process social results
      if (socialResults.status === 'fulfilled') {
        const socialItems: SocialItem[] = socialResults.value.slice(0, 5).map((post: any) => ({
          id: `search-social-${post.id}-${Date.now()}`,
          title: post.title || 'Untitled Post',
          body: post.body || 'No content available',
          userId: post.userId || 1,
          username: post.username || `user${post.userId}`,
          hashtags: post.hashtags || ['search'],
          type: 'social' as const,
          createdAt: post.createdAt || new Date().toISOString(),
        }));
        results.push(...socialItems);
      }
      
      return results;
    } catch (error) {
      throw new Error('Search failed');
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    resetContent: (state) => {
      state.news = [];
      state.movies = [];
      state.social = [];
      state.page = { news: 1, movies: 1, social: 1 };
      state.hasMore = { news: true, movies: true, social: true };
    },
  },
  extraReducers: (builder) => {
    builder
      // News
      .addCase(fetchNews.pending, (state) => {
        state.loading.news = true;
        state.error.news = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading.news = false;
        if (action.payload.page === 1) {
          state.news = action.payload.news;
        } else {
          state.news.push(...action.payload.news);
        }
        state.page.news = action.payload.page;
        state.hasMore.news = action.payload.news.length === 20;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading.news = false;
        state.error.news = action.error.message || 'Failed to fetch news';
      })
      // Movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading.movies = true;
        state.error.movies = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading.movies = false;
        if (action.payload.page === 1) {
          state.movies = action.payload.movies;
        } else {
          state.movies.push(...action.payload.movies);
        }
        state.page.movies = action.payload.page;
        state.hasMore.movies = action.payload.movies.length === 10;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading.movies = false;
        state.error.movies = action.error.message || 'Failed to fetch movies';
      })
      // Social
      .addCase(fetchSocialPosts.pending, (state) => {
        state.loading.social = true;
        state.error.social = null;
      })
      .addCase(fetchSocialPosts.fulfilled, (state, action) => {
        state.loading.social = false;
        if (action.payload.page === 1) {
          state.social = action.payload.social;
        } else {
          state.social.push(...action.payload.social);
        }
        state.page.social = action.payload.page;
        state.hasMore.social = action.payload.social.length === 20;
      })
      .addCase(fetchSocialPosts.rejected, (state, action) => {
        state.loading.social = false;
        state.error.social = action.error.message || 'Failed to fetch social posts';
      })
      // Search
      .addCase(searchContent.pending, (state) => {
        state.loading.search = true;
        state.error.search = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload;
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.loading.search = false;
        state.error.search = action.error.message || 'Search failed';
      });
  },
});

export const { clearSearchResults, resetContent } = contentSlice.actions;
export default contentSlice.reducer;