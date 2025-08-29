import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, Download, Calendar, Star, Film, Award, DollarSign, Users, Target, BarChart3, ArrowUp, ArrowDown, Activity, Zap, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  // Mock data for dashboard metrics
  const kpiMetrics = [
    {
      title: 'Total Movies Analyzed',
      value: '1,247',
      change: '+12%',
      trend: 'up' as const,
      icon: Film,
      color: 'blue'
    },
    {
      title: 'Average Rating',
      value: '8.2/10',
      change: '+0.3',
      trend: 'up' as const,
      icon: Star,
      color: 'yellow'
    },
    {
      title: 'Total Revenue',
      value: '$47.2M',
      change: '+18%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'AI Accuracy',
      value: '94.7%',
      change: '+2.1%',
      trend: 'up' as const,
      icon: Target,
      color: 'purple'
    }
  ];

  const topMovies = [
    { id: 1, title: 'The Shawshank Redemption', year: 1994, rating: 9.3, revenue: '$16.3M', trend: 'up' },
    { id: 2, title: 'The Godfather', year: 1972, rating: 9.2, revenue: '$15.8M', trend: 'up' },
    { id: 3, title: 'Pulp Fiction', year: 1994, rating: 8.9, revenue: '$14.2M', trend: 'down' },
    { id: 4, title: 'The Dark Knight', year: 2008, rating: 9.0, revenue: '$13.7M', trend: 'up' },
    { id: 5, title: 'Inception', year: 2010, rating: 8.8, revenue: '$12.9M', trend: 'up' }
  ];

  const genrePerformance = [
    { genre: 'Drama', percentage: 85, revenue: '$245.6M', count: 89 },
    { genre: 'Action', percentage: 72, revenue: '$198.3M', count: 67 },
    { genre: 'Comedy', percentage: 68, revenue: '$156.7M', count: 45 },
    { genre: 'Sci-Fi', percentage: 65, revenue: '$134.2M', count: 34 }
  ];

  const recentActivities = [
    { id: 1, type: 'prediction', title: 'New script analyzed: "Quantum Dreams"', time: '2 minutes ago', rating: 8.4 },
    { id: 2, type: 'achievement', title: 'AI accuracy improved to 94.7%', time: '1 hour ago', rating: null },
    { id: 3, type: 'milestone', title: '1000+ movies analyzed milestone reached', time: '3 hours ago', rating: null },
    { id: 4, type: 'prediction', title: 'Script analysis: "The Last Frontier"', time: '5 hours ago', rating: 7.9 },
    { id: 5, type: 'update', title: 'Database updated with 25 new movies', time: '1 day ago', rating: null }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-peachy-blush via-white to-secondary-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Executive Dashboard
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Overview</h1>
            <p className="text-gray-600">Real-time insights and analytics for movie database and AI predictions</p>
          </div>
          
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600',
              yellow: 'bg-yellow-50 text-yellow-600',
              green: 'bg-green-50 text-green-600',
              purple: 'bg-purple-50 text-purple-600'
            };
            
            return (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className={`flex items-center space-x-1 text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                        <span>{metric.change}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[metric.color]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Performing Movies */}
          <Card title="Top Performing Movies" className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="space-y-4">
              {topMovies.map((movie, index) => (
                <div key={movie.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{movie.title}</h4>
                      <div className={`flex items-center space-x-1 text-sm ${
                        movie.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movie.trend === 'up' ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                      <span>{movie.year}</span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {movie.rating}
                      </span>
                      <span className="font-medium text-green-600">{movie.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm" className="w-full">
                View All Movies
              </Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card title="AI Performance" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Prediction Accuracy</span>
                  <span className="font-bold text-primary-600">94.7%</span>
                </div>
                <div className="w-full bg-primary-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '94.7%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Processing Speed</span>
                  <span className="font-bold text-secondary-600">1.2s avg</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Scripts Analyzed</span>
                  <span className="font-bold text-gray-900">1,247</span>
                </div>
              </div>
            </Card>

            <Card title="System Health" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Uptime</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-600">99.9%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Server Load</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-yellow-600">23%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Storage Used</span>
                  <span className="font-medium text-gray-900">2.1TB</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Genre Performance */}
          <Card title="Genre Performance Analysis" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
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
                    <span>Performance Score</span>
                    <span className="font-medium text-green-600">{genre.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'prediction' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'achievement' ? 'bg-green-100 text-green-600' :
                    activity.type === 'milestone' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'prediction' && <Zap className="w-4 h-4" />}
                    {activity.type === 'achievement' && <Target className="w-4 h-4" />}
                    {activity.type === 'milestone' && <Award className="w-4 h-4" />}
                    {activity.type === 'update' && <Activity className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      {activity.rating && (
                        <div className="flex items-center text-xs">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="font-medium">{activity.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Revenue Trend Chart Placeholder */}
        <Card title="Revenue Trends" className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Monthly Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Predictions</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Revenue Chart</p>
              <p className="text-sm">Interactive chart showing monthly revenue trends and AI predictions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">$185.0M</div>
              <div className="text-sm text-primary-700">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <div className="text-2xl font-bold text-secondary-600">$31.2M</div>
              <div className="text-sm text-secondary-700">This Month</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">+18%</div>
              <div className="text-sm text-green-700">Growth Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">$42.1M</div>
              <div className="text-sm text-purple-700">Projected</div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
