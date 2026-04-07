import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack, MdAttachMoney } from 'react-icons/md';
import { Button, LanguageSwitcher } from '../components';
import { ProfitCalculatorCard } from '../components/ProfitCalculatorCard';

const ProfitCalculatorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          icon={<MdArrowBack />}
          size="sm"
        >
          Back
        </Button>
        <MdAttachMoney className="text-xl sm:text-2xl text-primary-500 mr-2 sm:mr-3" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Profit & Sustainability Calculator
        </h1>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </motion.div>

      {/* Main Component */}
      <ProfitCalculatorCard />
    </div>
  );
};

export default ProfitCalculatorPage;