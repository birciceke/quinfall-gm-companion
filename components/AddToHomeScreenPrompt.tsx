import React, { useState } from 'react';
import { InstallIcon, IosShareIcon, AndroidMenuIcon } from './Icons';

interface AddToHomeScreenPromptProps {
  isIos: boolean;
  hasInstallPrompt: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

const AddToHomeScreenPrompt: React.FC<AddToHomeScreenPromptProps> = ({ isIos, hasInstallPrompt, onInstall, onDismiss }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFabClick = () => {
    if (hasInstallPrompt && !isIos) {
      onInstall();
    } else {
      setIsModalOpen(true);
    }
  };
  
  const handleDismiss = () => {
    onDismiss();
    setIsModalOpen(false); // also close modal if open
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50" style={{ animation: 'zoomIn 0.3s ease-out' }}>
        <style>{`
            @keyframes zoomIn {
                from { opacity: 0; transform: scale(0.5); }
                to { opacity: 1; transform: scale(1); }
            }
        `}</style>
        <button
          onClick={handleFabClick}
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Install App"
        >
          <InstallIcon className="h-6 w-6" />
        </button>
      </div>
      
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          <style>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div
            className="bg-gray-800 border border-yellow-500/50 rounded-lg shadow-2xl p-6 text-center max-w-sm w-full"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            <h3 className="text-lg font-bold text-yellow-400 mb-3">Install App</h3>
            {isIos ? (
                <p className="text-gray-300 text-sm mb-6">
                  To install this app, tap the{' '}
                  <IosShareIcon className="h-5 w-5 inline-block -mt-1 mx-1 text-blue-400" />
                  Share button and then 'Add to Home Screen'.
                </p>
            ) : (
                <p className="text-gray-300 text-sm mb-6">
                  To install this app, open your browser's {' '}
                  <AndroidMenuIcon className="h-5 w-5 inline-block -mt-1 mx-1 text-gray-400" />
                  menu and look for an "Install app" or "Add to Home Screen" option.
                </p>
            )}
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-md font-semibold hover:bg-yellow-400 transition-colors text-sm"
                >
                   Got It
                </button>
                 <button
                    onClick={handleDismiss}
                    className="w-full px-4 py-2 text-gray-400 hover:text-white transition-colors text-xs"
                >
                   Don't Show Again
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToHomeScreenPrompt;
