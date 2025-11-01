import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, children, ...props }) => {
  const isDisabled = props.disabled;
  
  return (
    <div className="flex-1 min-w-[120px]">
      <label className={`block text-xs font-medium mb-1 ${isDisabled ? 'text-gray-500' : 'text-gray-400'}`}>
        {label}
      </label>
      <select
        className={`w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm ${isDisabled ? 'cursor-not-allowed opacity-60 line-through text-gray-400' : ''}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;