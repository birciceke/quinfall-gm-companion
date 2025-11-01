import React from 'react';
import { useTranslation } from '../i18n';

const professionData = [
  { key: 'logging', kod: '0' },
  { key: 'mining', kod: '1' },
  { key: 'harvesting', kod: '2' },
  { key: 'fishing', kod: '3' },
  { key: 'hunting', kod: '4' },
  { key: 'cooking', kod: '5' },
  { key: 'alchemy', kod: '6' },
  { key: 'blacksmithing', kod: '7' },
  { key: 'tailoring', kod: '8' },
  { key: 'carpentry', kod: '23' },
  { key: 'mechanical_engineering', kod: '24' },
  { key: 'jewelry_making', kod: '26' },
  { key: 'animal_husbandry', kod: '9' },
  { key: 'farming', kod: '10' },
  { key: 'beekeeping', kod: '27' },
  { key: 'caravan_transport', kod: '14' },
  { key: 'caravan_thievery', kod: '15' },
  { key: 'sea_trading', kod: '16' },
  { key: 'piracy', kod: '17' },
  { key: 'treasure_hunting', kod: '11' },
  { key: 'transport', kod: '12', highlighted: true },
  { key: 'freelancing', kod: '13', highlighted: true },
  { key: 'lumbering', kod: '18' },
  { key: 'smelting', kod: '19' },
  { key: 'leatherworking', kod: '20' },
  { key: 'spinning', kod: '21' },
  { key: 'essence_processing', kod: '22' },
  { key: 'gem_mastery', kod: '25' },
];

const ProfessionCodesTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">{t('profession_codes_title')}</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-yellow-400 uppercase bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">{t('profession')}</th>
                        <th scope="col" className="px-6 py-3 text-center">{t('code')}</th>
                    </tr>
                </thead>
                <tbody>
                    {professionData.map((prof) => (
                        <tr key={prof.key} className="border-b border-gray-700 hover:bg-gray-800/60">
                            <td className="px-6 py-3 font-medium">{t(`prof_name_${prof.key}` as any)}</td>
                            <td className={`px-6 py-3 text-center font-bold ${prof.highlighted ? 'text-red-400' : 'text-white'}`}>
                                {prof.kod}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ProfessionCodesTab;
