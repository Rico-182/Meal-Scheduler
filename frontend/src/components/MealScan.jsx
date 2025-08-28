import React from 'react';
import { Calendar, Search } from 'lucide-react';
import AnimatedDots from '../components/AnimatedDots';

const MealScan = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12 text-base-content animate-fadeIn">
      <div className="relative w-24 h-24">
        {/* Calendar icon */}
        <div className="absolute inset-0 flex items-center justify-center text-primary">
          <Calendar className="w-20 h-20 opacity-30" />
        </div>

        {/* Magnifying glass icon that rotates */}
        <div className="absolute -bottom-2 -right-2 animate-spin-slow">
          <Search className="w-10 h-10 text-blue-500 drop-shadow-md" />
        </div>
      </div>

      <h1 className="text-lg font-medium text-center">
        Scanning for open meal slots<AnimatedDots/>
      </h1>
    </div>
  );
};

export default MealScan;