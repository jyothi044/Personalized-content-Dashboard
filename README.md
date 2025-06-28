# Personalized Content Dashboard

A modern, dashboard that curates news, movies, and social media content based on your preferences. Built with React, TypeScript, and Tailwind CSS.

![Dashboard Preview](https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

- **📰 Real-time News**: Latest news from trusted global sources via Mediastack API
- **🎬 Movie Database**: Comprehensive movie information powered by OMDb API
- **💬 Social Content**: Trending social media posts and discussions
- **🔍 Universal Search**: Search across all content types simultaneously
- **❤️ Favorites System**: Save and organize your favorite content
- **🎨 Beautiful UI**: Modern, responsive design with dark/light mode
- **📱 Mobile Responsive**: Optimized for all device sizes
- **🎯 Drag & Drop**: Customize your feed layout with intuitive drag-and-drop
- **⚡ Real-time Updates**: Live content updates and infinite scrolling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys (optional - app works with mock data)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/personalized-content-dashboard.git
   cd personalized-content-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (Optional)**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   # Get your free API key at: https://mediastack.com
   VITE_MEDIASTACK_API_KEY=your_mediastack_api_key_here
   
   # Get your free API key at: https://www.omdbapi.com/apikey.aspx
   VITE_OMDB_API_KEY=your_omdb_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Getting API Keys (Optional)

The app works perfectly with mock data, but for real-time content:

### Mediastack API (News)
1. Visit [mediastack.com](https://mediastack.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env` as `VITE_MEDIASTACK_API_KEY`

### OMDb API (Movies)
1. Visit [omdbapi.com](https://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Check your email for the key
4. Add to `.env` as `VITE_OMDB_API_KEY`

## 🎨 Customization

### Content Preferences
- Click the settings icon in the header
- Customize news categories, countries, movie genres, and social hashtags
- Your preferences are automatically saved

### Theme Customization
- Toggle between light and dark modes
- Responsive design adapts to all screen sizes
- Modern glassmorphism effects and smooth animations

### Layout Customization
- Drag and drop content cards to reorder your feed
- Custom content ordering is preserved across sessions

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Content/        # Content-related components
│   ├── Layout/         # Layout components (Header, Sidebar)
│   ├── Settings/       # Settings panel
│   └── UI/            # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # API services and utilities
├── store/              # Redux store and slices
│   └── slices/        # Redux slices for state management
├── styles/             # Global styles and Tailwind config
└── types/              # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **State Management**: Redux Toolkit
- **Icons**: Lucide React
- **Build Tool**: Vite
- **APIs**: Mediastack (News), OMDb (Movies), JSONPlaceholder (Social)
- **Features**: Drag & Drop, Infinite Scroll, Search, Dark Mode

## 🌟 Key Features Explained

### Smart Content Curation
The dashboard uses your preferences to fetch and display relevant content:
- **News**: Filtered by categories and countries
- **Movies**: Filtered by preferred genres
- **Social**: Filtered by hashtags and topics

### Advanced UI/UX
- **Glassmorphism Design**: Modern translucent effects
- **Smooth Animations**: Micro-interactions and hover effects
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: Keyboard navigation and screen reader support

### Performance Optimizations
- **Infinite Scrolling**: Efficient content loading
- **Image Optimization**: Lazy loading and fallbacks
- **Debounced Search**: Optimized search performance
- **Local Storage**: Persistent user preferences

## 🔒 Privacy & Data

- All user preferences are stored locally in your browser
- No personal data is sent to external servers
- API calls are made directly from your browser
- Content is fetched in real-time from public APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**API Rate Limits**
- The app automatically falls back to mock data when API limits are reached
- Get your own API keys for unlimited access

**Build Errors**
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

**Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check browser console for any CSS errors

### Support

If you encounter any issues:
1. Check the browser console for error messages
2. Ensure all dependencies are installed correctly
3. Verify API keys are correctly set (if using real APIs)
4. Open an issue on GitHub with detailed error information

## 🎉 Acknowledgments

- [Mediastack](https://mediastack.com) for news API
- [OMDb](https://www.omdbapi.com) for movie data
- [Pexels](https://pexels.com) for high-quality images
- [Lucide](https://lucide.dev) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com) for styling framework

-
