import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, TrendingUp, Star, Calendar, Award, Play, Download, Eye, Heart } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  // Mock movie data
  const mockMovies = [
    { 
      id: 1, 
      title: "The Shawshank Redemption", 
      year: 1994, 
      rating: 9.3, 
      genre: ["Drama"], 
      poster: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop",
      director: "Frank Darabont",
      description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      views: 2543,
      favorites: 892
    },
    { 
      id: 2, 
      title: "The Godfather", 
      year: 1972, 
      rating: 9.2, 
      genre: ["Crime", "Drama"], 
      poster: "https://images.pexels.com/photos/8263297/pexels-photo-8263297.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop",
      director: "Francis Ford Coppola",
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      views: 3201,
      favorites: 1243
    },
    { 
      id: 3, 
      title: "Pulp Fiction", 
      year: 1994, 
      rating: 8.9, 
      genre: ["Crime", "Drama"], 
      poster: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop",
      director: "Quentin Tarantino",
      description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
      views: 2876,
      favorites: 765
    },
    { 
      id: 4, 
      title: "Inception", 
      year: 2010, 
      rating: 8.8, 
      genre: ["Sci-Fi", "Thriller"], 
      poster: "https://images.pexels.com/photos/8263297/pexels-photo-8263297.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop",
      director: "Christopher Nolan",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task.",
      views: 4532,
      favorites: 1654
    },
    { 
      id: 5, 
      title: "The Dark Knight", 
      year: 2008, 
      rating: 9.0, 
      genre: ["Action", "Crime"], 
      poster: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop",
      director: "Christopher Nolan",
      description: "When the menace known as the Joker wreaks havoc on Gotham City, Batman must accept one of the greatest challenges.",
      views: 3987,
      favorites: 1321
    },
    { 
      id: 6, 
      title: "Interstellar", 
      year: 2014, 
      rating: 8.6, 
      genre: ["Sci-Fi", "Drama"], 
      poster: "https://images.pexels.com/photos/8263297/pexels-photo-8263297.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop",
      director: "Christopher Nolan",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      views: 2765,
      favorites: 923
    }
  ];

  const genres = ['All', 'Drama', 'Crime', 'Sci-Fi', 'Action', 'Thriller'];
  const years = ['All', '2020s', '2010s', '2000s', '1990s', '1980s'];

  const filteredMovies = mockMovies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movie.director.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || movie.genre.some(g => g.toLowerCase() === selectedGenre.toLowerCase());
    const matchesYear = selectedYear === 'all' || 
                       (selectedYear === '2020s' && movie.year >= 2020) ||
                       (selectedYear === '2010s' && movie.year >= 2010 && movie.year < 2020) ||
                       (selectedYear === '2000s' && movie.year >= 2000 && movie.year < 2010) ||
                       (selectedYear === '1990s' && movie.year >= 1990 && movie.year < 2000) ||
                       (selectedYear === '1980s' && movie.year >= 1980 && movie.year < 1990);
    
    return matchesSearch && matchesGenre && matchesYear;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'year':
        return b.year - a.year;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            AI-Powered Movie Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Movie
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700"> Insights</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our comprehensive movie database with AI-powered analysis, script insights, and predictive analytics
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search movies, directors, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center text-gray-600">
              <Filter className="h-5 w-5 mr-2" />
              <span className="font-medium">Filters:</span>
            </div>
            
            <select 
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {genres.map(genre => (
                <option key={genre} value={genre.toLowerCase()}>{genre} Genres</option>
              ))}
            </select>
            
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {years.map(year => (
                <option key={year} value={year.toLowerCase()}>{year} Years</option>
              ))}
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="rating">Sort by Rating</option>
              <option value="year">Sort by Year</option>
              <option value="title">Sort by Title</option>
              <option value="views">Sort by Views</option>
            </select>

            <div className="ml-auto text-sm text-gray-500">
              {sortedMovies.length} movies found
            </div>
          </div>
        </Card>

        {/* Featured Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Movies</h2>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedMovies.slice(0, 8).map((movie) => (
              <Card 
                key={movie.id} 
                hoverable 
                onClick={() => handleMovieClick(movie.id)}
                className="group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="sm" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium">
                    <Star className="w-3 h-3 inline mr-1 text-yellow-400" />
                    {movie.rating}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {movie.year}
                    </div>
                    <div className="flex space-x-1">
                      {movie.genre.slice(0, 2).map((g, index) => (
                        <span key={index} className="bg-primary-50 text-primary-600 px-2 py-1 rounded text-xs">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {movie.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {movie.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {movie.favorites.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                    <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center bg-gradient-to-br from-primary-50 to-primary-100 border-0">
            <div className="text-3xl font-bold text-primary-600 mb-2">1,247</div>
            <div className="text-sm text-primary-700">Total Movies</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-secondary-100 to-secondary-200 border-0">
            <div className="text-3xl font-bold text-secondary-700 mb-2">8.2</div>
            <div className="text-sm text-secondary-800">Average Rating</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-primary-100 to-secondary-50 border-0">
            <div className="text-3xl font-bold text-primary-700 mb-2">342</div>
            <div className="text-sm text-primary-800">Award Winners</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-secondary-50 to-primary-50 border-0">
            <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
            <div className="text-sm text-primary-700">AI Accuracy</div>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="text-center bg-gradient-to-br from-primary-500 to-primary-700 text-white border-0">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Analyze Your Script?</h3>
            <p className="text-primary-100 mb-6">
              Upload your movie script and get AI-powered predictions for IMDb ratings, genre classification, and award potential.
            </p>
            <Button variant="secondary" size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white">

              Start Analysis
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
