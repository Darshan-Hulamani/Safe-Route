import React, { createContext, useContext, useState, useCallback } from 'react';
import { emergencyService } from '../services/sos/emergencyService';

export const SOSContext = createContext(null);

export function SOSProvider({ children }) {
  const [sosActive, setSosActive] = useState(false);
  const [contacts, setContacts] = useState([]);

  const triggerSOS = useCallback(async (location) => {
    setSosActive(true);
    try {
      await emergencyService.triggerSOS(location, contacts);
    } catch (error) {
      console.error('SOS trigger failed:', error);
    }
  }, [contacts]);

  const deactivateSOS = useCallback(() => {
    setSosActive(false);
  }, []);

  return (
    <SOSContext.Provider value={{ 
      sosActive, 
      triggerSOS, 
      deactivateSOS, 
      contacts, 
      setContacts 
    }}>
      {children}
    </SOSContext.Provider>
  );
}

export const useSOSContext = () => {
  const context = useContext(SOSContext);
  if (!context) {
    throw new Error('useSOSContext must be used within SOSProvider');
  }
  return context;
};