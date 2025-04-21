import { useState } from 'react';
import { supabase } from '../services/supabase';
import { getDistance } from '../utils/Distance';
import LocationUpdater from './LocationUpdater'; // ✅ Import LocationUpdater

export default function SOSButton({ userId }) {
  const [closestUser, setClosestUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setClosestUser(null);

    const { data: currentUser, error: senderError } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (senderError || !currentUser) {
      alert('Your location not found');
      setLoading(false);
      return;
    }

    const { data: others, error: othersError } = await supabase
      .from('locations')
      .select('*')
      .neq('user_id', userId);

    if (othersError || others.length === 0) {
      alert('No other users available');
      setLoading(false);
      return;
    }

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

    setClosestUser(closest?.name || closest?.user_id || 'Unknown');
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ✅ Add the location updater */}
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

      {closestUser && (
        <div className="text-lg text-green-700 font-semibold">
          Closest user: {closestUser}
        </div>
      )}
    </div>
  );
}
