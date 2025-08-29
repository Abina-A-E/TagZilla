import React, { useState, useRef } from 'react';
import { User, Settings, Camera, Mail, Phone, MapPin, Calendar, Star, Clock, Award, TrendingUp, LogOut, Edit3, Save, X, Shield, Palette, Database, Key, Upload, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Current User',
    email: user?.email || 'user@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    company: 'MovieTech Studios',
    role: 'AI Analytics Manager',
    bio: 'Passionate about leveraging AI to transform the entertainment industry. Specialized in predictive analytics and movie performance optimization.',
    joinDate: '2023-01-15'
  });
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    setShowImageOptions(false);
  };
  
  const handleCameraCapture = () => {
    // In a real app, this would open the device camera
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
    setShowImageOptions(false);
  };

  // Mock data for multiple accounts
  const [availableAccounts] = useState([
    {
      id: 1,
      name: 'Current User',
      email: 'user@example.com',
      avatar: null,
      role: 'AI Analytics Manager'
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: null,
      role: 'Senior Analyst'
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: null,
      role: 'Data Scientist'
    }
  ]);

  const [selectedAccount, setSelectedAccount] = useState(availableAccounts[0]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'prediction',
      title: 'Analyzed script "Quantum Dreams"',
      description: 'AI prediction completed with 8.4/10 rating',
      time: '2 hours ago',
      rating: 8.4,
      status: 'completed'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Milestone Achievement',
      description: 'Reached 1000+ movie analyses',
      time: '1 day ago',
      rating: null,
      status: 'achievement'
    },
    {
      id: 3,
      type: 'analysis',
      title: 'Genre performance report',
      description: 'Generated comprehensive drama genre analysis',
      time: '2 days ago',
      rating: null,
      status: 'completed'
    },
    {
      id: 4,
      type: 'prediction',
      title: 'Script analysis: "The Last Frontier"',
      description: 'Successfully predicted box office potential',
      time: '3 days ago',
      rating: 7.9,
      status: 'completed'
    },
    {
      id: 5,
      type: 'update',
      title: 'Profile updated',
      description: 'Updated contact information and preferences',
      time: '1 week ago',
      rating: null,
      status: 'info'
    }
  ];

  const stats = [
    { label: 'Movies Analyzed', value: '1,247', icon: Star },
    { label: 'Predictions Made', value: '856', icon: TrendingUp },
    { label: 'Accuracy Rate', value: '94.7%', icon: Award },
    { label: 'Time Saved', value: '2,340h', icon: Clock }
  ];

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    setIsEditing(false);
    // Show success toast
  };

  const handleCancel = () => {
    // Reset form data
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
          <div className="relative mb-4 md:mb-0">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <div className="relative">
              <button 
                onClick={() => setShowImageOptions(!showImageOptions)}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center text-white hover:bg-secondary-600 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              
              {showImageOptions && (
                <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[160px]">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                size="sm"
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
            <p className="text-secondary-600 font-medium mb-1">{profileData.role}</p>
            <p className="text-gray-600 mb-3">{profileData.company}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Joined {new Date(profileData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Profile Information */}
      <Card title="Profile Information" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {isEditing ? (
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{profileData.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{profileData.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-2 py-3 border border-gray-20 rounded-lg focus:ring-2 focus:ring-primary-5 focus:border-primary-5"
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{profileData.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              {isEditing ? (
                <input
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-2 py-3 border border-gray-20 rounded-lg focus:ring-2 focus:ring-primary-5 focus:border-primary-5"
                  placeholder="Enter your location"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{profileData.location}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              {isEditing ? (
                <input
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        className="w-full px-2 py-3 border border-gray-20 rounded-lg focus:ring-2 focus:ring-primary-5 focus:border-primary-5"
                  placeholder="Enter your company"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span>{profileData.company}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              {isEditing ? (
                <input
                  value={profileData.role}
                  onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                  className="w-full px-2 py-3 border border-gray-20 rounded-lg focus:ring-2 focus:ring-primary-5 focus:border-primary-5"
                  placeholder="Enter your role"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span>{profileData.role}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          {isEditing ? (
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{profileData.bio}</p>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </Card>
    </div>
  );


           
     

  const renderSettingsTab = () => (
    <div className="space-y-6">
      

      {/* Privacy & Security */}
      <Card title="Privacy & Security" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Key className="w-4 h-4 mr-3" />
            Change Password
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-3" />
            Two-Factor Authentication
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Database className="w-4 h-4 mr-3" />
            Download Your Data
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card title="Danger Zone" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg border-red-200">
        <div className="space-y-4">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full justify-center border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          
        
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-peachy-blush via-white to-secondary-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <User className="w-4 h-4 mr-2" />
            User Profile
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and view your activity</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
