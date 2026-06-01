export const watchLocation = (onSuccess, onError) => {
  const id = navigator.geolocation.watchPosition(
    (pos) => onSuccess({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    onError,
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
  );
  return () => navigator.geolocation.clearWatch(id);
};