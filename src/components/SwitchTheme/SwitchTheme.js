import React from 'react';
import './SwitchTheme.scss';
import { useTheme } from "../../contexts/ThemeContext";

const SwitchTheme = () => {
  const { toggleTheme, theme, themeRus } = useTheme();

  return (
    <div className="content">
      <label className="switch" htmlFor="toggleCheck">
        <input type="checkbox" id="toggleCheck" defaultChecked={theme === 'dark'} onClick={event => {
          event.target.checked ? toggleTheme('dark') : toggleTheme('light');
        }}/>
          <span className="slider round" />
      </label>
      <h3>Тема: {themeRus}</h3>
    </div>
  )
}

export default SwitchTheme;
