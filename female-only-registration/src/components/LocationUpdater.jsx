import { useEffect } from 'react';
import { supabase } from '../services/supabase'; // adjust path if needed

export default function LocationUpdater({ userId }) {
  useEffect(() => {
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
                onConflict: ['user_id'], // ensures it updates based on user_id
              }
            );

            if (error) {
              console.error('Error saving location:', error.message);
            } else {
              console.log('Location saved:', data);
            }
          },
          (err) => {
            console.error('Geolocation error:', err.message);
            alert('Please enable location services in your browser.');
          }
        );
      } catch (err) {
        console.error('Error with geolocation request:', err.message);
        alert('Error retrieving location.');
      }
    };

    if (userId) {
      updateLocation();
      const interval = setInterval(updateLocation, 15 * 60 * 1000); // every 15 min

      return () => clearInterval(interval);
    }
  }, [userId]); // Ensure effect only runs if userId changes

  return null;
}
