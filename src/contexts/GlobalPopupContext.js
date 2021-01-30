import React, { useContext, useCallback, useState } from 'react';

const GlobalPopupContext = React.createContext(undefined, undefined);

export const useGlobalPopup = () => useContext(GlobalPopupContext);

export function GlobalPopupProvider({ children }) {
  const [ message, setMessage ] = useState(null);
  const removeMessage = () => setMessage(null);
  const addMessage = (message, payload) => setMessage({ message, payload });

  const value = {
    // actions
    // state
    message,
    addMessage: useCallback((message, payload) => addMessage(message, payload), []),
    removeMessage: useCallback(() => removeMessage(), [])
  }

  return (
    <GlobalPopupContext.Provider value={value}>
      {children}
    </GlobalPopupContext.Provider>
  )
}
