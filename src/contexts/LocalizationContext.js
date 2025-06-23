import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LocalizationContext = createContext();

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export const LocalizationProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getCurrentLocale = useCallback(() => {
    const path = location.pathname;
    if (path.startsWith('/en')) {
      return 'en-US';
    }
    return 'nl';
  }, [location.pathname]);

  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale());

  useEffect(() => {
    setCurrentLocale(getCurrentLocale());
  }, [getCurrentLocale]);

  // Function to switch languages
  const switchLanguage = (newLocale) => {
    const currentPath = location.pathname;
    let newPath;

    if (newLocale === 'nl') {
      newPath = currentPath.startsWith('/en') 
        ? currentPath.replace('/en', '') || '/' 
        : currentPath;
    } else {
      newPath = currentPath.startsWith('/en') 
        ? currentPath 
        : `/en${currentPath === '/' ? '' : currentPath}`;
    }

    navigate(newPath);
    setCurrentLocale(newLocale);
  };

  const getLocalizedPath = (path, locale = currentLocale) => {
    if (locale === 'en-US') {
      return `/en${path === '/' ? '' : path}`;
    }
    return path;
  };

  const getCleanPath = (path = location.pathname) => {
    if (path.startsWith('/en')) {
      return path.replace('/en', '') || '/';
    }
    return path;
  };

  const value = {
    currentLocale,
    switchLanguage,
    getLocalizedPath,
    getCleanPath,
    isEnglish: currentLocale === 'en-US',
    isDutch: currentLocale === 'nl'
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};