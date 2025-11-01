import React, { useState, useCallback } from 'react';
import type { Pet } from '../types';
import { generatePetCode } from '../utils/petCodeGenerator';
import { useTranslation } from '../i18n';
import { CopyIcon } from './Icons';

interface PetCodeDisplayProps {
  pet: Pet;
}

const PetCodeDisplay: React.FC<PetCodeDisplayProps> = ({ pet }) => {
  const { t } = useTranslation();
  const [showNotification, setShowNotification] = useState(false);
  const petCode = generatePetCode(pet);

  const handleCopy = useCallback(() => {
    if (showNotification) return;

    const codeToCopy = `/item ${petCode}`;
    navigator.clipboard.writeText(codeToCopy).then(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2500);
    }).catch(err => {
        console.error('Failed to copy pet code:', err);
    });
  }, [petCode, showNotification]);

  const breakdown = () => {
    const parts = petCode.split('_');
    const [type, profession, satiety, level, xp] = parts;
    const typeCode = type.substring(2);

    return (
      <ul className="list-disc list-inside space-y-1">
        <li>{t('pet_type')}: <span className="text-white font-semibold">{typeCode}</span> <em>({pet.petType})</em></li>
        <li>{t('pet_profession')}: <span className="text-white font-semibold">{profession}</span> <em>({pet.petProfession})</em></li>
        <li>{t('satiety')}: <span className="text-white font-semibold">{satiety}</span> <em>({pet.satiety} {t('satiety')})</em></li>
        <li>{t('level')}: <span className="text-white font-semibold">{level}</span> <em>({t('level')} {pet.level})</em></li>
        <li>{t('xp')}: <span className="text-white font-semibold">{xp}</span> <em>({pet.xp}%)</em></li>
      </ul>
    );
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg mt-8 relative">
      {showNotification && (
        <div className="absolute -top-3 right-4 bg-green-600/95 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-lg z-10 animate-fade-in-out">
          {t('copied_pet_id')}
        </div>
      )}
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">{t('pet_code_table')}</h2>
      <div className="relative">
        <div className="bg-gray-900/50 p-4 rounded-md font-mono text-lg text-center text-cyan-300 tracking-widest break-all pr-12">
          {petCode}
        </div>
        <button
          onClick={handleCopy}
          disabled={showNotification}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
          aria-label="Copy pet code"
        >
          <CopyIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <h3 className="font-semibold text-gray-300 mb-2">{t('code_breakdown')}</h3>
        {breakdown()}
      </div>
    </div>
  );
};

export default PetCodeDisplay;
