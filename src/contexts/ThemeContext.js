import React, { useContext, useState, useEffect } from 'react';

const ThemeContext = React.createContext(undefined, undefined);

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  // state
  const [theme, setTheme] = useState('light');

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

  useEffect(() => {
    const getTheme = localStorage.getItem('theme');
    console.log(getTheme);
    switch (getTheme) {
      case 'light':
        setTheme('light');
        return document.body.classList = 'light-mode';
      case 'dark':
        setTheme('dark');
        return document.body.classList = 'dark-mode';
      default:
        return document.body.classList.add('light-mode');
    }
  }, [theme]);

  const value = {
    theme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
