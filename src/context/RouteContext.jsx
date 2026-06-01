import React, { createContext, useContext, useState } from 'react';

const RouteContext = createContext(null);

export function RouteProvider({ children }) {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState('walking'); // walking, driving, cycling
  const [routeData, setRouteData] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);

  return (
    <RouteContext.Provider value={{
      source, setSource,
      destination, setDestination,
      travelMode, setTravelMode,
      routeData, setRouteData,
      safetyScore, setSafetyScore
    }}>
      {children}
    </RouteContext.Provider>
  );
}

export const useRouteContext = () => useContext(RouteContext);