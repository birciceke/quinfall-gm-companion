import React, { useState } from 'react';

interface PasswordPromptProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'doom') {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500); // Reset error state for animation
      setPassword('');
    }
  };

  const modalAnimation = error ? 'animate-shake' : '';

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-gray-800 border border-yellow-500/50 rounded-lg shadow-2xl p-6 w-full max-w-sm ${modalAnimation}`}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-yellow-400 mb-4 text-center">Admin Password Required</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-gray-900/50 p-3 rounded-md font-mono text-cyan-300 border border-gray-600 focus:ring-yellow-500 focus:border-yellow-500 transition ${error ? 'border-red-500' : ''}`}
            autoFocus
            aria-label="Admin Password"
          />
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-yellow-500 text-gray-900 rounded-md font-semibold hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordPrompt;