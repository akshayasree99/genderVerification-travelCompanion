import { useEffect } from 'react';
import { supabase } from '../services/supabase'; // adjust path if needed

export default function LocationUpdater({ userId }) {
  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }

    const updateLocation = async () => {
      if (!userId) {
        console.warn('No userId provided to LocationUpdater');
        return;
      }

      try {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;

            const { data, error } = await supabase.from('locations').upsert(
              [
                {
                  user_id: userId, // match your foreign key to profiles.id
                  latitude,
                  longitude,
                  created_at: new Date().toISOString(),
                },
              ],
              {
                onConflict: 'user_id', // ensures it updates based on user_id
                returning: 'minimal' // Reduces unnecessary data transfer
              }
            );

            if (error) {
              console.error('Error saving location:', error.message);
            } else {
              console.log('Location updated successfully');
            }
          },
          (err) => {
            console.error('Geolocation error:', err.message);
            
            // More specific error handling
            switch(err.code) {
              case err.PERMISSION_DENIED:
                console.warn('User denied geolocation permission');
                break;
              case err.POSITION_UNAVAILABLE:
                console.warn('Location information unavailable');
                break;
              case err.TIMEOUT:
                console.warn('Location request timed out');
                break;
              default:
                console.warn('Unknown geolocation error');
            }
          },
          {
            // Options for more precise and efficient location tracking
            enableHighAccuracy: true, // More accurate but slower
            timeout: 5000, // 5 seconds timeout
            maximumAge: 0 // Don't use cached location
          }
        );
      } catch (err) {
        console.error('Error with geolocation request:', err.message);
      }
    };

    // Initial location update
    if (userId) {
      updateLocation();

      // Set interval to update location every 15 minutes
      const interval = setInterval(updateLocation, 15 * 60 * 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [userId]); // Depend on userId to restart effect if user changes

  // No visible UI, returns null
  return null;
}