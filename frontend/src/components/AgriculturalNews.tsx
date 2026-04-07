import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdNewspaper, MdOpenInNew, MdRefresh } from 'react-icons/md';
import { Card, Button } from './';
import { useLanguage } from '../contexts/LanguageContext';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsResponse {
  articles: NewsItem[];
  status: string;
  message?: string;
}

// Extend ImportMeta interface for Vite environment variables
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_NEWS_API_KEY?: string;
      [key: string]: any;
    };
  }
}

const AgriculturalNews: React.FC = () => {
  const { t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get API key from environment variables
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      
      if (!apiKey) {
        throw new Error('News API key not configured');
      }
      
      // Use NewsAPI to fetch Indian agricultural news
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=agriculture+farming+crops+India+Indian&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
      
      const data: NewsResponse = await response.json();
      
      if (data.status === 'ok') {
        // Filter out articles with missing data and focus on Indian agriculture
        const validArticles = data.articles.filter(
          article => article.title && 
                    article.description && 
                    article.url &&
                    article.url !== '' &&
                    !article.url.includes('[Removed]') &&
                    (article.title.toLowerCase().includes('india') ||
                     article.description.toLowerCase().includes('india') ||
                     article.source.name.toLowerCase().includes('india') ||
                     article.title.toLowerCase().includes('indian') ||
                     article.description.toLowerCase().includes('indian'))
        );
        setNews(validArticles.slice(0, 6)); // Limit to 6 articles
      } else {
        throw new Error(data.message || 'News API returned error status');
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to load news: ${errorMessage}`);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading && news.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MdNewspaper className="text-2xl text-primary-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('latestNews')}
            </h2>
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MdNewspaper className="text-2xl text-primary-500 mr-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t('latestNews')}
          </h2>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={fetchNews}
          loading={loading}
          icon={<MdRefresh />}
          title="Refresh news"
        />
      </div>

      {error && (
        <div className="text-center py-4">
          <p className="text-red-600 dark:text-red-400 mb-2">
            {t('newsLoadingError')}
          </p>
          <Button size="sm" onClick={fetchNews} variant="outline">
            {t('retry')}
          </Button>
        </div>
      )}

      {news.length > 0 && (
        <div className="space-y-4">
          {news.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="mr-2">{article.source.name}</span>
                      <span>•</span>
                      <span className="ml-2">{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                    
                    {article.url !== '#' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(article.url, '_blank')}
                        icon={<MdOpenInNew />}
                        className="text-xs"
                      >
                        Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {news.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MdNewspaper className="mx-auto text-4xl mb-2 opacity-50" />
          <p>{t('noNewsAvailable')}</p>
        </div>
      )}
    </Card>
  );
};

export default AgriculturalNews;