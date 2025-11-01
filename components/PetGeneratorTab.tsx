import React from 'react';
import type { Pet } from '../types';
import PetBuilderForm from './PetBuilderForm';
import PetPreviewCard from './PetPreviewCard';
import PetCodeDisplay from './PetCodeDisplay';

interface PetGeneratorTabProps {
  pet: Pet;
  onPetChange: (field: keyof Pet, value: string | number) => void;
}

const PetGeneratorTab: React.FC<PetGeneratorTabProps> = ({ pet, onPetChange }) => {
  return (
    <main className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-1/2">
        <PetBuilderForm pet={pet} onPetChange={onPetChange} />
        <PetCodeDisplay pet={pet} />
      </div>
      <div className="w-full lg:w-1/2 sticky top-8">
        <PetPreviewCard pet={pet} />
      </div>
    </main>
  );
};

export default PetGeneratorTab;
