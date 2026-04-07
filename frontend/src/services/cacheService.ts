import localforage from 'localforage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expires: number;
}

class CacheService {
  private store: LocalForage;

  constructor() {
    this.store = localforage.createInstance({
      name: 'KrishiSahayakCache',
      version: 1.0,
      description: 'Cache for KrishiSarthi app data',
    });
  }

  async set<T>(key: string, data: T, expiresInMs: number = 5 * 60 * 1000): Promise<void> {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + expiresInMs,
    };
    
    await this.store.setItem(key, item);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = await this.store.getItem<CacheItem<T>>(key);
      
      if (!item) {
        return null;
      }
      
      // Check if expired
      if (Date.now() > item.expires) {
        await this.store.removeItem(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    await this.store.removeItem(key);
  }

  async clear(): Promise<void> {
    await this.store.clear();
  }

  async keys(): Promise<string[]> {
    return await this.store.keys();
  }

  // Generate cache key for location-based data
  generateLocationKey(prefix: string, lat: number, lon: number, extraParams?: Record<string, any>): string {
    const roundedLat = Math.round(lat * 100) / 100; // Round to 2 decimal places
    const roundedLon = Math.round(lon * 100) / 100;
    const extra = extraParams ? `-${JSON.stringify(extraParams)}` : '';
    return `${prefix}-${roundedLat}-${roundedLon}${extra}`;
  }
}

export const cacheService = new CacheService();