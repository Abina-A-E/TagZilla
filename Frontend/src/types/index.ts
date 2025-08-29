// User and Authentication Types
export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  loginDate?: string;
  memberSince?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Movie and Media Types
export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  director: string;
  cast: string[];
  rating: number;
  poster: string;
  plot: string;
  duration: number;
  language: string;
  country: string;
}

export interface Transcript {
  id: string;
  movieId: string;
  content: string;
  characters: Character[];
  scenes: Scene[];
  metadata: TranscriptMetadata;
}

export interface Character {
  name: string;
  lineCount: number;
  sentimentScore: number;
  keyWords: string[];
}

export interface Scene {
  id: string;
  startTime: number;
  endTime: number;
  characters: string[];
  setting: string;
  mood: string;
}

export interface TranscriptMetadata {
  totalWords: number;
  totalLines: number;
  avgWordsPerLine: number;
  readingTime: number;
  complexity: 'low' | 'medium' | 'high';
}

// Analytics and Prediction Types
export interface PredictionResult {
  id: string;
  movieTitle: string;
  predictions: {
    imdbRating: {
      predicted: number;
      confidence: number;
    };
    genre: {
      primary: string;
      confidence: number;
      alternatives: Array<{genre: string; confidence: number}>;
    };
    boxOffice: {
      predicted: number;
      confidence: number;
    };
    awards: {
      likelihood: 'low' | 'medium' | 'high';
      confidence: number;
    };
  };
  similarMovies: SimilarMovie[];
  createdAt: string;
}

export interface SimilarMovie {
  title: string;
  year: number;
  similarity: number;
  genre: string;
}

export interface AnalyticsData {
  overview: {
    totalMovies: number;
    averageRating: number;
    totalRevenue: number;
    awardWinners: number;
  };
  trends: {
    monthlyData: MonthlyData[];
    genrePerformance: GenrePerformance[];
    sentimentTrends: SentimentData[];
  };
  insights: {
    topKeywords: string[];
    characterDistribution: {male: number; female: number};
    averageComplexity: number;
  };
}

export interface MonthlyData {
  month: string;
  movies: number;
  revenue: number;
  avgRating: number;
}

export interface GenrePerformance {
  genre: string;
  count: number;
  avgRating: number;
  totalRevenue: number;
  performance: number;
}

export interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

// User Activity Types
export interface UserActivity {
  id: string;
  type: 'viewed' | 'predicted' | 'favorited' | 'downloaded';
  movieTitle: string;
  timestamp: string;
  details?: any;
}

export interface UserStats {
  totalMoviesViewed: number;
  totalPredictions: number;
  favoriteGenres: Array<{genre: string; count: number; percentage: number}>;
  activityTimeline: UserActivity[];
  watchingPattern: Array<{day: string; hours: number}>;
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface PredictionForm {
  title?: string;
  transcript: string;
  genre?: string[];
  year?: number;
}

// Navigation Types
export type PageType = 'login' | 'home' | 'analytics' | 'predictions' | 'dashboard' | 'profile';

export interface NavigationItem {
  key: PageType;
  label: string;
  icon: string;
  path: string;
  requiredRole?: 'user' | 'admin';
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export type Page = 'home' | 'movie' | 'prediction' | 'analytics' | 'dashboard' | 'activities';

export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  genre: string;
  poster: string;
}

export interface User {
  name: string;
  email: string;
  loginDate: string;
  memberSince: string;
  avatar: string;
  moviesWatched: number;
  favoriteMovies: number;
  totalWatchTime: { hours: number; minutes: number };
  avgSessionTime: { hours: number; minutes: number };
  recentActivity: Activity[];
  favoriteGenres: GenreData[];
  watchingJourney: JourneyData[];
  sentimentAnalysis: SentimentData;
  dailyActivity: DailyActivityData[];
}

export interface Activity {
  type: 'watched' | 'favorited' | 'reviewed';
  movie: string;
  time: string;
  rating: number;
}

export interface GenreData {
  genre: string;
  count: number;
  percentage: number;
}

export interface JourneyData {
  month: string;
  movies: number;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface DailyActivityData {
  day: string;
  hours: number;
}

export interface LoginFormData {
  username: string;
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
