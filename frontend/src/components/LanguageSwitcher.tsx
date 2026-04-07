import React from 'react';
import { MdLanguage } from 'react-icons/md';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './Button';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      icon={<MdLanguage />}
      className={`flex items-center gap-2 ${className}`}
      title={t('language')}
    >
      <span className="text-sm font-medium">
        {language === 'en' ? 'हिं' : 'EN'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;