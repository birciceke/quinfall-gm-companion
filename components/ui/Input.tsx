import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const Input: React.FC<InputProps> = ({ label, onIncrement, onDecrement, ...props }) => (
  <div className="flex-1 min-w-[120px]">
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    <div className="relative">
      <input
        className={`w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm ${onIncrement ? 'pr-8' : ''}`}
        {...props}
      />
      {onIncrement && onDecrement && (
        <div className="absolute inset-y-0 right-0 flex flex-col">
          <button 
            type="button" 
            onClick={onIncrement} 
            className="flex-1 w-7 flex items-center justify-center text-gray-400 hover:text-white rounded-tr-md hover:bg-gray-600 transition-colors"
            aria-label="Increment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button 
            type="button" 
            onClick={onDecrement} 
            className="flex-1 w-7 flex items-center justify-center text-gray-400 hover:text-white rounded-br-md hover:bg-gray-600 transition-colors"
            aria-label="Decrement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  </div>
);

export default Input;