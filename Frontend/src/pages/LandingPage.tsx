import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Zap, Brain, TrendingUp, Users, Shield, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage: React.FC = () => {
  console.log('TAGZILLA: LandingPage component rendering...');
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show dinosaur intro for 3 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setShowContent(true), 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/home');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            {/* Dinosaur Animation */}
            <motion.div
              initial={{ scale: 0.5, rotateY: 0 }}
              animate={{ 
                scale: [0.5, 1.2, 1],
                rotateY: [0, 180, 360],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 2.5,
                ease: "easeInOut"
              }}
              className="text-center"
            >
              <div className="text-8xl mb-4">🦖</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-4xl font-bold text-white mb-2"
              >
                TAGZILLA
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-xl text-primary-200"
              >
                AI-Powered Movie Metadata Tagging
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Navigation */}
            <nav className="absolute top-0 left-0 right-0 z-20 p-6">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-bold text-white"
                >
                  🦖 TAGZILLA
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex space-x-4"
                >
                  <Button
                    onClick={handleLogin}
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-primary-700"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={handleSignUp}
                    className="text-white border-white hover:bg-white hover:text-primary-700"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-6">
              <div className="max-w-7xl mx-auto text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-6xl md:text-7xl font-bold text-white mb-6"
                >
                  AI-Powered Movie
                  <br />
                  <span className="text-primary-300">Metadata Tagging</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="text-xl text-primary-200 mb-8 max-w-3xl mx-auto"
                >
                  Leverage Generative AI and NLP to automatically extract rich, structured metadata 
                  from movie transcripts. Enhance discoverability, enable efficient indexing, and 
                  accelerate time-to-market.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    onClick={handleGetStarted}
                    size="lg"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 text-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => navigate('/predictions')}
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 text-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Try Demo
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="px-6 pb-20"
            >
              <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Brain,
                      title: "AI Metadata Extraction",
                      description: "Extract key themes, subjects, and frequently mentioned terms using advanced NLP."
                    },
                    {
                      icon: Users,
                      title: "Named Entity Recognition",
                      description: "Identify people, organizations, locations, products, and more from transcripts."
                    },
                    {
                      icon: TrendingUp,
                      title: "Sentiment Analysis",
                      description: "Analyze tone and emotional context of conversations and dialogues."
                    },
                    {
                      icon: Shield,
                      title: "Speaker Identification",
                      description: "Tag who said what with advanced speaker diarization technology."
                    },
                    {
                      icon: Zap,
                      title: "Content Classification",
                      description: "Automatically categorize content by genre, type, and audience."
                    },
                    {
                      icon: Play,
                      title: "Real-time Processing",
                      description: "Process transcripts instantly with our optimized AI pipeline."
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-primary-200">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="border-t border-white/20 px-6 py-8"
            >
              <div className="max-w-7xl mx-auto text-center">
                <p className="text-primary-300">
                  © 2025 Tagzilla. All rights reserved. AI-Powered Movie Metadata Tagging Platform.
                </p>
              </div>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
