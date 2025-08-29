import React, { useState } from 'react';
import { BarChart3, TrendingUp, Filter, Download, Calendar, DollarSign, Award, Users, PieChart, LineChart, Target } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Analytics: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const timeRanges = [
    { value: '1m', label: 'Last Month' },
    { value: '3m', label: 'Last 3 Months' },
    { value: '6m', label: 'Last 6 Months' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const genres = ['All', 'Drama', 'Action', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi'];

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', movies: 18, revenue: 24.5, rating: 7.2 },
    { month: 'Feb', movies: 22, revenue: 31.2, rating: 7.8 },
    { month: 'Mar', movies: 25, revenue: 28.9, rating: 8.1 },
    { month: 'Apr', movies: 19, revenue: 22.7, rating: 7.5 },
    { month: 'May', movies: 28, revenue: 35.6, rating: 8.3 },
    { month: 'Jun', movies: 31, revenue: 42.1, rating: 8.0 }
  ];

  const genrePerformance = [
    { genre: 'Drama', count: 89, avgRating: 8.2, revenue: 245.6, percentage: 36 },
    { genre: 'Action', count: 67, avgRating: 7.8, revenue: 198.3, percentage: 27 },
    { genre: 'Comedy', count: 45, avgRating: 7.1, revenue: 156.7, percentage: 18 },
    { genre: 'Thriller', count: 34, avgRating: 8.0, revenue: 134.2, percentage: 14 },
    { genre: 'Sci-Fi', count: 12, avgRating: 8.5, revenue: 98.1, percentage: 5 }
  ];

  const sentimentData = [
    { category: 'Positive', value: 65, color: 'bg-green-500' },
    { category: 'Neutral', value: 25, color: 'bg-gray-400' },
    { category: 'Negative', value: 10, color: 'bg-red-500' }
  ];

  const topKeywords = [
    { word: 'love', frequency: 1234, sentiment: 'positive' },
    { word: 'death', frequency: 987, sentiment: 'negative' },
    { word: 'hope', frequency: 876, sentiment: 'positive' },
    { word: 'fear', frequency: 654, sentiment: 'negative' },
    { word: 'family', frequency: 543, sentiment: 'positive' },
    { word: 'revenge', frequency: 432, sentiment: 'negative' },
    { word: 'victory', frequency: 321, sentiment: 'positive' },
    { word: 'betrayal', frequency: 298, sentiment: 'negative' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-peachy-blush via-white to-secondary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights across movie dataset and performance metrics</p>
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
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            
            <select 
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {genres.map(genre => (
                <option key={genre} value={genre.toLowerCase()}>{genre} Genre</option>
              ))}
            </select>

            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="revenue">Revenue</option>
              <option value="rating">Rating</option>
              <option value="views">Views</option>
              <option value="engagement">Engagement</option>
            </select>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-primary-900">$47.2M</p>
                <p className="text-sm text-primary-600 mt-1">↑ 18% vs last period</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-peachy-rose/20 to-peachy-coral/20 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Average Rating</p>
                <p className="text-2xl font-bold text-primary-900">8.2/10</p>
                <p className="text-sm text-primary-600 mt-1">↑ 0.3 vs last period</p>
              </div>
              <Award className="h-8 w-8 text-primary-600" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Total Views</p>
                <p className="text-2xl font-bold text-secondary-900">2.8M</p>
                <p className="text-sm text-secondary-600 mt-1">↑ 24% vs last period</p>
              </div>
              <Users className="h-8 w-8 text-secondary-600" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-peachy-mint/30 to-peachy-blush border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">AI Accuracy</p>
                <p className="text-2xl font-bold text-primary-900">94.7%</p>
                <p className="text-sm text-primary-600 mt-1">↑ 2.1% vs last period</p>
              </div>
              <Target className="h-8 w-8 text-primary-600" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trends */}
          <Card title="Revenue Trends" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <LineChart className="w-4 h-4 mr-2" />
                Monthly Performance
              </div>
              <Button size="sm" variant="ghost">View Details</Button>
            </div>
            
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">{data.month}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{data.movies} movies</span>
                    <span className="font-semibold text-primary-600">${data.revenue}M</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-700">Total Revenue (6 months)</span>
                <span className="text-lg font-bold text-primary-900">$185.0M</span>
              </div>
            </div>
          </Card>

          {/* Genre Performance */}
          <Card title="Genre Performance" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <PieChart className="w-4 h-4 mr-2" />
                Market Share Analysis
              </div>
              <Button size="sm" variant="ghost">View All</Button>
            </div>

            <div className="space-y-4">
              {genrePerformance.map((genre, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{genre.genre}</span>
                    <span className="text-sm text-gray-500">{genre.count} movies</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${genre.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{genre.percentage}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Avg Rating: {genre.avgRating}</span>
                    <span>Revenue: ${genre.revenue}M</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Sentiment Analysis */}
          <Card title="Sentiment Analysis" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="mb-4 flex items-center text-sm text-gray-500">
              <BarChart3 className="w-4 h-4 mr-2" />
              Script Sentiment Distribution
            </div>

            <div className="space-y-6">
              {sentimentData.map((sentiment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{sentiment.category}</span>
                    <span className="text-lg font-bold text-gray-900">{sentiment.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${sentiment.color} h-3 rounded-full transition-all duration-500`} 
                      style={{ width: `${sentiment.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-800">
                <strong>Insight:</strong> 65% of analyzed scripts show positive sentiment, indicating strong audience appeal potential.
              </div>
            </div>
          </Card>

          {/* Top Keywords */}
          <Card title="Script Keywords Analysis" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="mb-4 flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-2" />
              Most Frequent Words in Scripts
            </div>

            <div className="grid grid-cols-2 gap-3">
              {topKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div>
                    <span className="font-medium text-gray-900">{keyword.word}</span>
                    <div className="text-xs text-gray-500">{keyword.frequency} occurrences</div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    keyword.sentiment === 'positive' ? 'bg-green-400' : 
                    keyword.sentiment === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                  }`}></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Character Analysis */}
        <Card title="Character Analysis" className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Gender Distribution</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Male Characters</span>
                  <span className="font-bold text-blue-600">62%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Female Characters</span>
                  <span className="font-bold text-pink-600">38%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Character Complexity</h4>
              <div className="space-y-3">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">7.2</div>
                  <div className="text-sm text-primary-700">Avg Dialogue Lines</div>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary-600">4.8</div>
                  <div className="text-sm text-secondary-700">Character Arcs</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Script Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Script Length</span>
                  <span className="font-medium">124 pages</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dialogue/Action Ratio</span>
                  <span className="font-medium">65:35</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reading Time</span>
                  <span className="font-medium">2.1 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Complexity Score</span>
                  <span className="font-medium text-primary-600">8.4/10</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

       
      </div>
    </div>
  );
};

export default Analytics;
