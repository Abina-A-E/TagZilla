import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity as ActivityIcon, 
  Clock, 
  FileText, 
  Brain, 
  TrendingUp, 
  Users, 
  Zap,
  Eye,
  Download,
  Share2,
  Filter,
  Calendar,
  RefreshCw
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface ActivityItem {
  id: string;
  type: 'analysis' | 'upload' | 'download' | 'share';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  metadata?: {
    fileSize?: string;
    duration?: string;
    accuracy?: number;
    entities?: number;
    sentiment?: string;
  };
  status: 'completed' | 'processing' | 'failed';
}

const Activity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Mock data for demonstration
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'analysis',
      title: 'Movie Transcript Analysis',
      description: 'Analyzed "The Shawshank Redemption" transcript using AI',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      user: 'Current User',
      metadata: {
        fileSize: '2.3 MB',
        duration: '3m 24s',
        accuracy: 94.2,
        entities: 156,
        sentiment: 'Mixed'
      },
      status: 'completed'
    },
    {
      id: '2',
      type: 'upload',
      title: 'Transcript Upload',
      description: 'Uploaded "Pulp Fiction" transcript file',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      user: 'Current User',
      metadata: {
        fileSize: '1.8 MB'
      },
      status: 'completed'
    },
    {
      id: '3',
      type: 'analysis',
      title: 'AI Metadata Extraction',
      description: 'Extracted themes and entities from "Inception" script',
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      user: 'Current User',
      metadata: {
        fileSize: '3.1 MB',
        duration: '4m 12s',
        accuracy: 91.8,
        entities: 203,
        sentiment: 'Positive'
      },
      status: 'completed'
    },
    {
      id: '4',
      type: 'share',
      title: 'Results Shared',
      description: 'Shared analysis results with team members',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      user: 'Current User',
      status: 'completed'
    },
    {
      id: '5',
      type: 'download',
      title: 'Report Download',
      description: 'Downloaded comprehensive analysis report',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      user: 'Current User',
      status: 'completed'
    },
    {
      id: '6',
      type: 'analysis',
      title: 'Real-time Processing',
      description: 'Currently analyzing "The Dark Knight" transcript',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      user: 'Current User',
      metadata: {
        fileSize: '2.7 MB',
        duration: '1m 45s',
        accuracy: 0,
        entities: 0,
        sentiment: 'Processing...'
      },
      status: 'processing'
    }
  ];

  useEffect(() => {
    setActivities(mockActivities);
  }, []);

  const refreshActivities = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'analysis':
        return <Brain className="h-5 w-5 text-blue-600" />;
      case 'upload':
        return <FileText className="h-5 w-5 text-green-600" />;
      case 'download':
        return <Download className="h-5 w-5 text-purple-600" />;
      case 'share':
        return <Share2 className="h-5 w-5 text-orange-600" />;
      case 'login':
        return <Users className="h-5 w-5 text-indigo-600" />;
      case 'settings':
        return <Zap className="h-5 w-5 text-yellow-600" />;
      default:
        return <ActivityIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'processing':
        return '⟳';
      case 'failed':
        return '✗';
      default:
        return '•';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const activityStats = {
    total: activities.length,
    completed: activities.filter(a => a.status === 'completed').length,
    processing: activities.filter(a => a.status === 'processing').length,
    failed: activities.filter(a => a.status === 'failed').length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Monitor</h1>
            <p className="text-gray-600">Track your real-time activities and system usage</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={refreshActivities}
              disabled={isLoading}
              variant="outline"
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <span className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <ActivityIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{activityStats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{activityStats.completed}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">{activityStats.processing}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{activityStats.failed}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          
          {['all', 'analysis', 'upload', 'download', 'share'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Activity Icon */}
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{activity.description}</p>
                        
                        {/* Metadata */}
                        {activity.metadata && (
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            {activity.metadata.fileSize && (
                              <span className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {activity.metadata.fileSize}
                              </span>
                            )}
                            {activity.metadata.duration && (
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.metadata.duration}
                              </span>
                            )}
                            {activity.metadata.accuracy && activity.metadata.accuracy > 0 && (
                              <span className="flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {activity.metadata.accuracy}% accuracy
                              </span>
                            )}
                            {activity.metadata.entities && activity.metadata.entities > 0 && (
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {activity.metadata.entities} entities
                              </span>
                            )}
                            {activity.metadata.sentiment && activity.metadata.sentiment !== 'Processing...' && (
                              <span className="flex items-center">
                                <Brain className="h-3 w-3 mr-1" />
                                {activity.metadata.sentiment} sentiment
                              </span>
                            )}
                          </div>
                        )}

                        {/* User and Time */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            by <span className="font-medium text-gray-700">{activity.user}</span>
                          </span>
                          <span className="text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          <span className="mr-1">{getStatusIcon(activity.status)}</span>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <Card className="p-12 text-center">
            <ActivityIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'No activities have been recorded yet.'
                : `No ${filter} activities found. Try adjusting your filters.`
              }
            </p>
            <Button onClick={() => setFilter('all')} variant="outline">
              View All Activities
            </Button>
          </Card>
        )}

        {/* Real-time Updates Info */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Real-time Monitoring</h3>
                  <p className="text-blue-700">Your activities are monitored in real-time for security and analytics</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  Live activity tracking
                </div>
                <div className="flex items-center text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  Instant notifications
                </div>
                <div className="flex items-center text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  Performance analytics
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Activity;
