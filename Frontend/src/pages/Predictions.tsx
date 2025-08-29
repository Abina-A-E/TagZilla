import React, { useState } from 'react';
import { Brain, Upload, FileText, Sparkles, Star, Award, TrendingUp, Download, Eye, Zap, Target, BarChart3, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Predictions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'results' | 'history'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scriptText, setScriptText] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Mock prediction results
  const predictionResults = {
    imdbRating: {
      predicted: 7.8,
      confidence: 85,
      range: { min: 7.2, max: 8.4 }
    },
    genre: {
      primary: 'Sci-Fi',
      confidence: 72,
      alternatives: [
        { genre: 'Thriller', confidence: 28 },
        { genre: 'Drama', confidence: 15 },
        { genre: 'Action', confidence: 12 }
      ]
    },
    boxOffice: {
      predicted: 145.2,
      confidence: 78,
      range: { min: 98.5, max: 192.8 }
    },
    awards: {
      likelihood: 'Medium' as const,
      confidence: 65,
      categories: [
        { category: 'Best Visual Effects', probability: 73 },
        { category: 'Best Cinematography', probability: 45 },
        { category: 'Best Original Score', probability: 38 }
      ]
    },
    similarMovies: [
      { title: 'Inception', year: 2010, similarity: 92, genre: 'Sci-Fi' },
      { title: 'Interstellar', year: 2014, similarity: 87, genre: 'Sci-Fi' },
      { title: 'Blade Runner 2049', year: 2017, similarity: 81, genre: 'Sci-Fi' }
    ]
  };

  const analysisHistory = [
    { id: 1, title: 'The Quantum Paradox', date: '2024-08-25', rating: 8.2, confidence: 89 },
    { id: 2, title: 'Love in Times of AI', date: '2024-08-20', rating: 7.1, confidence: 76 },
    { id: 3, title: 'The Last Horizon', date: '2024-08-18', rating: 8.7, confidence: 92 }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScriptText(e.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScriptText(e.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!scriptText && !movieTitle) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setActiveTab('results');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-peachy-blush via-white to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Predictions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Script
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700"> Analysis</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your movie script and get AI-powered predictions for IMDb ratings, genre classification, box office potential, and award likelihood
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-gray-200 shadow-lg">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Upload Script
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'results'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Results
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card title="Script Input" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="space-y-6">
                  <Input
                    label="Movie Title (Optional)"
                    placeholder="Enter movie title"
                    value={movieTitle}
                    onChange={setMovieTitle}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Script File</label>
                    <div 
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        dragOver 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-300 hover:border-primary-400 hover:bg-primary-25'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">Drop your script file here</p>
                      <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                      <p className="text-xs text-gray-400">Supports .txt, .pdf, .docx files up to 10MB</p>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".txt,.pdf,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Or paste script text</label>
                    <textarea 
                      placeholder="Paste your script content here..."
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                      rows={8}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <Button 
                    onClick={handleAnalyze} 
                    disabled={(!scriptText && !movieTitle) || isAnalyzing}
                    loading={isAnalyzing}
                    className="w-full"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Script...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Analyze Script
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Features Section */}
              <Card title="What You'll Get" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">IMDb Rating Prediction</h4>
                      <p className="text-gray-600 text-sm">Get predicted IMDb rating with confidence intervals based on script analysis</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Genre Classification</h4>
                      <p className="text-gray-600 text-sm">AI-powered genre prediction with alternative classifications</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-peachy-coral/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Box Office Prediction</h4>
                      <p className="text-gray-600 text-sm">Estimated box office performance based on similar successful films</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-peachy-mint/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Award Potential</h4>
                      <p className="text-gray-600 text-sm">Analysis of award-winning potential in various categories</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-primary-50 to-peachy-blush rounded-lg border border-primary-100">
                    <div className="flex items-center mb-2">
                      <Sparkles className="w-5 h-5 text-primary-600 mr-2" />
                      <span className="font-medium text-primary-800">AI Accuracy: 94.7%</span>
                    </div>
                    <p className="text-sm text-primary-700">
                      Our AI model has been trained on thousands of successful scripts and their outcomes.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* IMDb Rating Prediction */}
              <Card title="IMDb Rating Prediction" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-primary-600 mb-2">
                    {predictionResults.imdbRating.predicted}/10
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Confidence: {predictionResults.imdbRating.confidence}%
                  </div>
                  <div className="w-full bg-primary-200 rounded-full h-3">
                    <div 
                      className="bg-primary-600 h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${predictionResults.imdbRating.confidence}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Predicted Range:</span>
                    <span className="font-medium">
                      {predictionResults.imdbRating.range.min} - {predictionResults.imdbRating.range.max}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Industry Average:</span>
                    <span className="font-medium">6.8/10</span>
                  </div>
                </div>
              </Card>

              {/* Genre Prediction */}
              <Card title="Genre Classification" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-secondary-600 mb-1">
                      {predictionResults.genre.primary}
                    </div>
                    <div className="text-sm text-gray-600">
                      Primary Genre ({predictionResults.genre.confidence}% confidence)
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Alternative Classifications:</h4>
                  {predictionResults.genre.alternatives.map((alt, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{alt.genre}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-secondary-500 h-2 rounded-full" 
                            style={{ width: `${alt.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{alt.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Box Office Prediction */}
              <Card title="Box Office Prediction" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${predictionResults.boxOffice.predicted}M
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Worldwide Box Office (Confidence: {predictionResults.boxOffice.confidence}%)
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${predictionResults.boxOffice.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Range:</span>
                    <span className="font-medium">
                      ${predictionResults.boxOffice.range.min}M - ${predictionResults.boxOffice.range.max}M
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Genre Average:</span>
                    <span className="font-medium">$89.2M</span>
                  </div>
                </div>
              </Card>

              {/* Award Potential */}
              <Card title="Award Potential" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {predictionResults.awards.likelihood}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Overall Award Likelihood ({predictionResults.awards.confidence}% confidence)
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Category Breakdown:</h4>
                  {predictionResults.awards.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 text-sm">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${category.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600 w-8">{category.probability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Similar Movies */}
              <Card title="Similar Movies" className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {predictionResults.similarMovies.map((movie, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{movie.title}</h4>
                          <p className="text-sm text-gray-600">{movie.year}</p>
                        </div>
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {movie.genre}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Similarity</span>
                        <span className="font-bold text-primary-600">{movie.similarity}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center space-x-4">
              <Button onClick={() => setActiveTab('upload')} variant="outline">
                Analyze Another Script
              </Button>
              <Button className="bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500 hover:border-yellow-600">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto">
            <Card title="Analysis History" className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              {analysisHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
                  <p className="text-gray-600 mb-6">You haven't analyzed any scripts yet.</p>
                  <Button onClick={() => setActiveTab('upload')}>
                    Start Your First Analysis
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysisHistory.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{analysis.title}</h4>
                          <p className="text-sm text-gray-600">Analyzed on {analysis.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-bold text-primary-600">{analysis.rating}/10</div>
                          <div className="text-xs text-gray-500">{analysis.confidence}% confidence</div>
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="max-w-md mx-4 text-center bg-white border-0 shadow-2xl">
              <div className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Script</h3>
                <p className="text-gray-600 mb-6">
                  Our AI is processing your script and generating predictions...
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mr-2"></div>
                    Processing script content
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mr-2" style={{animationDelay: '0.2s'}}></div>
                    Analyzing dialogue patterns
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mr-2" style={{animationDelay: '0.4s'}}></div>
                    Generating predictions
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictions;
