import { useState, useEffect } from 'react';
import { Location } from '../api/types';

interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
  });

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 600000, // 10 minutes
    watch = false,
  } = options;

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by this browser.',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const success = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        loading: false,
        error: null,
      });
    };

    const error = (error: GeolocationPositionError) => {
      let message = 'Unable to retrieve your location.';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location access denied by user.';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          message = 'Location request timed out.';
          break;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: message,
      }));
    };

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(success, error, geoOptions);
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      navigator.geolocation.getCurrentPosition(success, error, geoOptions);
    }
  };

  useEffect(() => {
    if (watch) {
      const cleanup = getCurrentLocation();
      return cleanup;
    }
  }, [watch]);

  return {
    ...state,
    getCurrentLocation,
    refetch: getCurrentLocation,
  };
};