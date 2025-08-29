// Local Database Service using localStorage and IndexedDB
// This simulates a real database for development purposes

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  profilePicture?: string;
  createdAt: Date;
  lastLogin: Date;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
    privacy: {
      profileVisibility: 'public' | 'private';
      activityVisibility: 'public' | 'private';
    };
  };
  analytics: {
    totalAnalyses: number;
    totalUploads: number;
    averageAccuracy: number;
    favoriteGenres: string[];
  };
}

interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

interface Activity {
  id: string;
  userId: string;
  type: 'analysis' | 'upload' | 'download' | 'share' | 'login' | 'settings' | 'profile_update';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
  status: 'completed' | 'processing' | 'failed';
}

class LocalDatabase {
  private dbName = 'TagzillaDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  // Initialize database
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('TAGZILLA: Opening IndexedDB:', this.dbName, 'version:', this.version);
      
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('TAGZILLA: IndexedDB open error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log('TAGZILLA: IndexedDB opened successfully');
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log('TAGZILLA: IndexedDB upgrade needed');
        const db = (event.target as IDBOpenDBRequest).result;

        try {
          // Create users store
          if (!db.objectStoreNames.contains('users')) {
            console.log('TAGZILLA: Creating users store');
            const userStore = db.createObjectStore('users', { keyPath: 'id' });
            userStore.createIndex('email', 'email', { unique: true });
          }

          // Create sessions store
          if (!db.objectStoreNames.contains('sessions')) {
            console.log('TAGZILLA: Creating sessions store');
            const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
            sessionStore.createIndex('userId', 'userId', { unique: false });
            sessionStore.createIndex('token', 'token', { unique: true });
          }

          // Create activities store
          if (!db.objectStoreNames.contains('activities')) {
            console.log('TAGZILLA: Creating activities store');
            const activityStore = db.createObjectStore('activities', { keyPath: 'id' });
            activityStore.createIndex('userId', 'userId', { unique: false });
            activityStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          // Create movies store
          if (!db.objectStoreNames.contains('movies')) {
            console.log('TAGZILLA: Creating movies store');
            const movieStore = db.createObjectStore('movies', { keyPath: 'id' });
            movieStore.createIndex('userId', 'userId', { unique: false });
            movieStore.createIndex('title', 'title', { unique: false });
          }
          
          console.log('TAGZILLA: IndexedDB upgrade completed');
        } catch (error) {
          console.error('TAGZILLA: Error during IndexedDB upgrade:', error);
          reject(error);
        }
      };
    });
  }

  // User Management
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> {
    if (!this.db) {
      console.error('TAGZILLA: Database not initialized when creating user');
      throw new Error('Database not initialized. Please try again.');
    }

    const user: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date(),
      lastLogin: new Date(),
      settings: {
        theme: 'light',
        notifications: true,
        privacy: {
          profileVisibility: 'public',
          activityVisibility: 'public',
        },
      },
      analytics: {
        totalAnalyses: 0,
        totalUploads: 0,
        averageAccuracy: 0,
        favoriteGenres: [],
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.add(user);

        request.onsuccess = () => resolve(user);
        request.onerror = () => {
          console.error('TAGZILLA: Error creating user in database:', request.error);
          reject(new Error('Failed to create user in database'));
        };
      } catch (error) {
        console.error('TAGZILLA: Error in createUser transaction:', error);
        reject(new Error('Database transaction failed'));
      }
    });
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) {
      console.error('TAGZILLA: Database not initialized when getting user by email');
      throw new Error('Database not initialized. Please try again.');
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const index = store.index('email');
        const request = index.get(email);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => {
          console.error('TAGZILLA: Error getting user by email from database:', request.error);
          reject(new Error('Failed to get user from database'));
        };
      } catch (error) {
        console.error('TAGZILLA: Error in getUserByEmail transaction:', error);
        reject(new Error('Database transaction failed'));
      }
    });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');

    const user = await this.getUserById(id);
    if (!user) throw new Error('User not found');

    const updatedUser = { ...user, ...updates };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.put(updatedUser);

      request.onsuccess = () => resolve(updatedUser);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Session Management
  async createSession(userId: string, token: string): Promise<Session> {
    if (!this.db) throw new Error('Database not initialized');

    const session: Session = {
      id: this.generateId(),
      userId,
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      isActive: true,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      const request = store.add(session);

      request.onsuccess = () => resolve(session);
      request.onerror = () => reject(request.error);
    });
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const index = store.index('token');
      const request = index.get(token);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deactivateSession(token: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const session = await this.getSessionByToken(token);
    if (!session) throw new Error('Session not found');

    session.isActive = false;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      const request = store.put(session);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Activity Management
  async createActivity(activityData: Omit<Activity, 'id'>): Promise<Activity> {
    if (!this.db) {
      console.error('TAGZILLA: Database not initialized when creating activity');
      throw new Error('Database not initialized. Please try again.');
    }

    const activity: Activity = {
      ...activityData,
      id: this.generateId(),
    };

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(['activities'], 'readwrite');
        const store = transaction.objectStore('activities');
        const request = store.add(activity);

        request.onsuccess = () => resolve(activity);
        request.onerror = () => {
          console.error('TAGZILLA: Error creating activity in database:', request.error);
          reject(new Error('Failed to create activity in database'));
        };
      } catch (error) {
        console.error('TAGZILLA: Error in createActivity transaction:', error);
        reject(new Error('Database transaction failed'));
      }
    });
  }

  async getUserActivities(userId: string, filters?: any): Promise<Activity[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['activities'], 'readonly');
      const store = transaction.objectStore('activities');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        let activities = request.result || [];
        
        // Apply filters
        if (filters?.type && filters.type !== 'all') {
          activities = activities.filter(a => a.type === filters.type);
        }
        
        if (filters?.status) {
          activities = activities.filter(a => a.status === filters.status);
        }

        // Sort by timestamp (newest first)
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        resolve(activities);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Analytics
  async getUserAnalytics(userId: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    const activities = await this.getUserActivities(userId);
    const user = await this.getUserById(userId);

    if (!user) throw new Error('User not found');

    const analytics = {
      totalActivities: activities.length,
      totalAnalyses: activities.filter(a => a.type === 'analysis').length,
      totalUploads: activities.filter(a => a.type === 'upload').length,
      totalDownloads: activities.filter(a => a.type === 'download').length,
      totalShares: activities.filter(a => a.type === 'share').length,
      completedActivities: activities.filter(a => a.status === 'completed').length,
      processingActivities: activities.filter(a => a.status === 'processing').length,
      failedActivities: activities.filter(a => a.status === 'failed').length,
      recentActivity: activities.slice(0, 10),
      activityByType: activities.reduce((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      user: {
        name: user.name,
        email: user.email,
        joinedDate: user.createdAt,
        lastLogin: user.lastLogin,
        settings: user.settings,
      },
    };

    return analytics;
  }

  // Check if database is ready
  isReady(): boolean {
    return this.db !== null;
  }

  // Get database status
  getStatus(): { isReady: boolean; dbName: string; version: number } {
    return {
      isReady: this.db !== null,
      dbName: this.dbName,
      version: this.version
    };
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Cleanup expired sessions
  async cleanupExpiredSessions(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['sessions'], 'readwrite');
    const store = transaction.objectStore('sessions');
    const request = store.getAll();

    request.onsuccess = () => {
      const sessions = request.result || [];
      const now = new Date();
      
      sessions.forEach(session => {
        if (new Date(session.expiresAt) < now) {
          store.delete(session.id);
        }
      });
    };
  }

  // Export data for backup
  async exportData(): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    const data: any = {};

    // Export users
    const users = await new Promise<User[]>((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    // Export activities
    const activities = await new Promise<Activity[]>((resolve, reject) => {
      const transaction = this.db!.transaction(['activities'], 'readonly');
      const store = transaction.objectStore('activities');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    data.users = users;
    data.activities = activities;
    data.exportDate = new Date().toISOString();

    return data;
  }

  // Import data from backup
  async importData(data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    if (data.users) {
      for (const user of data.users) {
        await this.createUser(user);
      }
    }

    if (data.activities) {
      for (const activity of data.activities) {
        await this.createActivity(activity);
      }
    }
  }
}

// Create and export database instance
export const localDB = new LocalDatabase();

// Initialize database when module is imported (only in browser environment)
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('TAGZILLA: Initializing database after DOM ready...');
      localDB.init().catch((error) => {
        console.error('TAGZILLA: Database initialization failed:', error);
      });
    });
  } else {
    console.log('TAGZILLA: Initializing database immediately...');
    localDB.init().catch((error) => {
      console.error('TAGZILLA: Database initialization failed:', error);
    });
  }
}

export default localDB;
