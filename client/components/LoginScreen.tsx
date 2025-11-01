import React, { useState } from 'react';
import { KeyIcon } from './Icons';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'nomoreoc') {
      onLoginSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPassword('');
    }
  };

  const modalAnimation = error ? 'animate-shake' : '';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="cloud cloud-1 bg-yellow-500/30"></div>
            <div className="cloud cloud-2 bg-orange-500/30"></div>
        </div>

        <div className="text-center mb-8 z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Quinfall GM Companion
            </h1>
            <p className="text-gray-400 mt-2">Made by Doom & POROS</p>
        </div>
      
        <div
            className={`bg-gray-800/50 border border-yellow-500/30 rounded-2xl shadow-2xl p-8 w-full max-w-sm z-10 backdrop-blur-sm ${modalAnimation}`}
        >
            <h3 className="text-xl font-bold text-yellow-400 mb-6 text-center">Authentication Required</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-gray-900/70 p-3 pl-10 rounded-md font-mono text-cyan-300 border transition-all duration-300 ${error ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                            autoFocus
                            placeholder="Password"
                            aria-label="Admin Password"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full mt-4 px-4 py-3 bg-yellow-500 text-gray-900 rounded-md font-bold text-lg hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400"
                >
                    Enter
                </button>
            </form>
        </div>
    </div>
  );
};

export default LoginScreen;
