/**
 * Returns a promise that resolves with { latitude, longitude }
 * or rejects with an error.
 */
export const getGeolocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(new Error(`Location access denied: ${err.message}`)),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};
