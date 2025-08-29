import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Star, Users, BarChart3, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(1);
  const totalScenes = 24;

  // Mock movie data - in a real app, this would come from an API
  const movie = {
    id: 1,
    title: 'The Shawshank Redemption',
    year: 1994,
    rating: 9.3,
    genre: 'Drama',
    director: 'Christopher Nolan',
    writers: 'Jonathan Nolan',
    stars: 'Leonardo DiCaprio, Tom Hardy',
    poster: '/api/placeholder/300/400',
    scenes: [
      {
        id: 1,
        image: '/api/placeholder/400/250',
        dialogue: [
          { character: 'COBB', text: "Dreams, they feel real while we're in them, right?", color: '#3B82F6' },
          { character: 'ARTHUR', text: "That's because time passes so much slower in dreams.", color: '#10B981' },
          { character: 'ARIADNE', text: "But whose subconscious are we going into exactly?", color: '#8B5CF6' },
          { character: 'COBB', text: "We're going into Fischer's mind. The question is are you prepared for this?", color: '#3B82F6' },
        ]
      }
    ]
  };

  const characters = [
    { name: 'Cobb', lines: 234, color: '#3B82F6' },
    { name: 'Arthur', lines: 189, color: '#10B981' },
    { name: 'Ariadne', lines: 156, color: '#8B5CF6' },
  ];

  const topKeywords = [
    { word: 'dream', color: '#3B82F6' },
    { word: 'reality', color: '#10B981' },
    { word: 'time', color: '#F59E0B' },
    { word: 'limbo', color: '#EF4444' },
  ];

  const handleSceneNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentScene > 1) {
      setCurrentScene(currentScene - 1);
    } else if (direction === 'next' && currentScene < totalScenes) {
      setCurrentScene(currentScene + 1);
    }
  };

  const currentSceneData = movie.scenes[0]; // For demo, using first scene

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <Button
          onClick={() => navigate('/home')}
          variant="ghost"
          className="mb-6 text-primary-600 hover:bg-primary-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Movies
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Movie Info */}
          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <div className="text-center">
                <img
                  src={currentSceneData.image}
                  alt={movie.title}
                  className="w-full h-48 object-cover rounded-lg mb-4 bg-gray-100"
                />
                <img
                  src="/api/placeholder/400/200"
                  alt="Cinema seats"
                  className="w-full h-32 object-cover rounded-lg mb-6 bg-gray-200"
                />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{movie.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{movie.year}</span>
              </div>

              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="font-bold text-lg">{movie.rating}/10</span>
              </div>

              <div className="flex items-center text-gray-600 mb-6">
                <Users className="w-4 h-4 mr-2" />
                <span>{movie.genre}</span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Director: </span>
                  <span className="text-gray-600">{movie.director}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Writers: </span>
                  <span className="text-gray-600">{movie.writers}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Stars: </span>
                  <span className="text-gray-600">{movie.stars}</span>
                </div>
              </div>

              <Button className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download Script
              </Button>
            </Card>
          </div>

          {/* Right Column - Script & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Script Viewer */}
            <Card title="Script Viewer" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <div className="space-y-4">
                {currentSceneData.dialogue.map((line, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center">
                      <span 
                        className="font-bold text-sm"
                        style={{ color: line.color }}
                      >
                        {line.character}:
                      </span>
                    </div>
                    <p className="text-gray-800 ml-4">{line.text}</p>
                  </div>
                ))}
                
                <p className="text-gray-500 italic mt-4">Scene continues...</p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">Scene {currentScene} of {totalScenes}</span>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleSceneNavigation('prev')}
                    disabled={currentScene === 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => handleSceneNavigation('next')}
                    disabled={currentScene === totalScenes}
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Character Analysis */}
            <Card title="Character Analysis" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    {characters.map((character, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: character.color }}
                          ></div>
                          <span className="font-medium text-gray-900">{character.name}</span>
                        </div>
                        <span className="text-gray-600 text-sm">{character.lines} lines</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Top Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {topKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: keyword.color }}
                      >
                        {keyword.word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Visualizations */}
            <Card title="Visualizations" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h4 className="font-medium text-gray-900 mb-2">Dialogue Distribution Chart</h4>
                  <p className="text-sm text-gray-600">Visual breakdown of character dialogue distribution</p>
                </div>
                
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h4 className="font-medium text-gray-900 mb-2">Character Interaction Network</h4>
                  <p className="text-sm text-gray-600">Network graph showing character relationships</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
