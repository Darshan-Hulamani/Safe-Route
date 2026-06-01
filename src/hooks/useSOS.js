import { useContext } from 'react';
import { SOSContext } from '../context/SOSContext';

export function useSOS() {
  const context = useContext(SOSContext);
  if (!context) {
    throw new Error('useSOS must be used within SOSProvider');
  }
  return context;
}