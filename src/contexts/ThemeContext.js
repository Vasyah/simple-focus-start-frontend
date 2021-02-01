import React, { useContext, useState, useEffect } from 'react';

const ThemeContext = React.createContext(undefined, undefined);

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  // state
  const [theme, setTheme] = useState('light');
  const [themeRus, setThemeRus] = useState('светлая');

  const toggleTheme = (theme) => {
    switch (theme) {
      case 'light':
        localStorage.setItem('theme', 'light');
        setTheme('light');
        break;
      case 'dark':
        localStorage.setItem('theme', 'dark');
        setTheme('dark');
        break;
      default:
        console.warn('unknown theme type');
    }
  };

  const setThemeFn = () => {
    const getTheme = localStorage.getItem('theme');
    switch (getTheme) {
      case 'light':
        setTheme('light');
        setThemeRus('светлая');
        return document.body.classList = 'light-mode';
      case 'dark':
        setTheme('dark');
        setThemeRus('темная');
        return document.body.classList = 'dark-mode';
      default:
        return document.body.classList.add('light-mode');
    }
  }

  useEffect(() => {
    setThemeFn();
  }, [theme]);

  const value = {
    theme,
    themeRus,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
