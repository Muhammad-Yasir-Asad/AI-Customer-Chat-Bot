import React from 'react';

const LanguageToggle = ({ currentLanguage, onChange }) => {
  const languages = ['en', 'ur', 'es', 'fr', 'de', 'zh', 'hi']; 

  return (
    <select value={currentLanguage} onChange={e => onChange(e.target.value)}>
      {languages.map(lang => (
        <option key={lang} value={lang}>{lang.toUpperCase()}</option>
      ))}
    </select>
  );
};

export default LanguageToggle;
