import { useState } from 'react';
import { supabase } from '../services/supabase';
import { getDistance } from '../utils/Distance';
import LocationUpdater from './LocationUpdater';

export default function SOSButton({ userId }) {
  const [closestUser, setClosestUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [closestUserDetails, setClosestUserDetails] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setClosestUser(null);
    setClosestUserDetails(null);

    try {
      // Get current user's location
      const { data: currentUser, error: senderError } = await supabase
        .from('locations')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (senderError || !currentUser) {
        throw new Error('Your location not found');
      }

      // Get other users' locations
      const { data: others, error: othersError } = await supabase
        .from('locations')
        .select('user_id, latitude, longitude')
        .neq('user_id', userId);

      if (othersError || others.length === 0) {
        throw new Error('No other users available');
      }

      // Find closest user
      let closest = null;
      let minDistance = Infinity;

      for (let user of others) {
        const distance = getDistance(
          currentUser.latitude,
          currentUser.longitude,
          user.latitude,
          user.longitude
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closest = user;
        }
      }

      // Fetch closest user's profile details
      if (closest) {
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', closest.user_id)
          .single();

        if (profileError) {
          throw new Error('Could not fetch user profile');
        }

        setClosestUserDetails({
          ...userProfile,
          distance: minDistance.toFixed(2) // Round to 2 decimal places
        });
        setClosestUser(userProfile.full_name || closest.user_id);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <LocationUpdater userId={userId} />

      <button
        onClick={handleSearch}
        className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Find Closest Person'}
      </button>

      {closestUserDetails && (
        <div className="text-lg text-green-700 font-semibold">
          <p>Closest user: {closestUserDetails.full_name}</p>
          <p>Distance: {closestUserDetails.distance} km</p>
          <p>Contact: {closestUserDetails.email}</p>
        </div>
      )}
    </div>
  );
}

//export default SOSButton;