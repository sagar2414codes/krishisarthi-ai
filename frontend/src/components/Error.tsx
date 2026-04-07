import React from 'react';
import { motion } from 'framer-motion';
import { MdError, MdWifiOff, MdRefresh } from 'react-icons/md';
import { Button } from './Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'offline' | 'not-found';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  type = 'error'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'offline':
        return <MdWifiOff className="text-6xl text-gray-400 mb-4" />;
      case 'not-found':
        return <div className="text-6xl mb-4">🔍</div>;
      default:
        return <MdError className="text-6xl text-red-400 mb-4" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'offline':
        return 'No Internet Connection';
      case 'not-found':
        return 'Not Found';
      default:
        return 'Something went wrong';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      {getIcon()}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {getTitle()}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          icon={<MdRefresh />}
          iconPosition="left"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

interface NetworkStatusProps {
  isOnline: boolean;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-2 px-4 text-center text-sm font-medium"
    >
      <MdWifiOff className="inline-block mr-2" />
      No internet connection - Some features may be limited
    </motion.div>
  );
};