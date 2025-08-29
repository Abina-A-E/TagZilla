import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Brain,
  LayoutDashboard,
  User,
  Settings,
  HelpCircle,
  Activity,
  Zap
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Home',
      path: '/home',
      icon: Home,
      description: 'Movie library and search'
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      description: 'Data insights and trends'
    },
    {
      name: 'Predictions',
      path: '/predictions',
      icon: Brain,
      description: 'AI-powered predictions'
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'Executive overview'
    }
  ];

  const bottomItems = [
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      description: 'User account settings'
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      description: 'App configuration'
    },
    {
      name: 'Activity',
      path: '/activity',
      icon: Activity,
      description: 'User activity monitoring'
    },
    {
      name: 'Help',
      path: '/help',
      icon: HelpCircle,
      description: 'Support and documentation'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Main Navigation */}
      <nav className="flex-1 px-4 pt-6 pb-4 space-y-2">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
            Navigation
          </h2>
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 ${
                  active ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                }`}
              />
              <div className="flex-1 text-left">
                <div className="font-medium">{item.name}</div>
                <div className={`text-xs ${active ? 'text-primary-600' : 'text-gray-500'}`}>
                  {item.description}
                </div>
              </div>
              {active && (
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              )}
            </button>
          );
        })}

        {/* AI Features Section */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
              AI Features
            </h2>
          </div>
          
          <div className="bg-gradient-to-r from-primary-50 to-peachy-blush p-4 rounded-lg border border-primary-100">
            <div className="flex items-center mb-2">
              <Zap className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="font-medium text-primary-800">Smart Insights</h3>
            </div>
            <p className="text-sm text-primary-700 mb-3">
              Get AI-powered recommendations and analytics for your movie database.
            </p>
            <button 
              onClick={() => navigate('/predictions')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm py-2 px-3 rounded-md transition-colors duration-200"
            >
              Try Now
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 pb-4 border-t border-gray-200">
        <div className="space-y-1 pt-4">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`}
              >
                <Icon
                  className={`mr-3 h-4 w-4 ${
                    active ? 'text-primary-600' : 'text-gray-400'
                  }`}
                />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Version Info */}
        <div className="mt-4 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">
            <div className="font-medium">Tagzilla v1.0.0</div>
            <div>AI Metadata Tagging</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
