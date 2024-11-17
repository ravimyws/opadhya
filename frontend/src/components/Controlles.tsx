import React from 'react';

interface ControllesProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedLanguage: string;
  onLanguageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  languages: { name: string; code: string }[];
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  currentPage: number;
  numPages: number | null;
  file: File | null;
}

const Controlles: React.FC<ControllesProps> = ({ onFileChange, selectedLanguage, onLanguageChange, languages,handlePreviousPage,handleNextPage,currentPage,numPages,file }) => {
  return (
    <div>
      <input type="file" accept="application/pdf" onChange={onFileChange} />
      <select value={selectedLanguage} onChange={onLanguageChange}>
        {languages.map(language => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
      {file && (
        <div>
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={handleNextPage} disabled={currentPage === numPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Controlles;