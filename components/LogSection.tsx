import React, { useState } from 'react';

interface LogSectionProps {
    title: string;
    icon: React.ReactNode;
    count: number;
    children: React.ReactNode;
}

const LogSection: React.FC<LogSectionProps> = ({ title, icon, count, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
      <div className="bg-gray-900/50 rounded-lg border border-gray-700">
        <button className="w-full p-4 flex justify-between items-center text-left" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-bold text-lg text-yellow-400">{title}</span>
            <span className="text-sm bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{count}</span>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
        {isOpen && <div className="p-4 border-t border-gray-700">{children}</div>}
      </div>
  );
};

export default LogSection;
