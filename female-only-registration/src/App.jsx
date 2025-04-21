import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabase';
import RegistrationForm from './pages/Registration';
import Home from './pages/Home';
import LocationUpdater from './components/LocationUpdater';
import SOSButton from './components/SOSButton';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    checkUser();

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }

    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Registration route */}
        <Route path="/registration" element={<RegistrationForm />} />
        
        {/* Login route */}
        <Route path="/login" element={<Login />} />
        
        {/* Main SOS App route - Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h1 className="text-3xl font-bold mb-6">SOS Emergency App</h1>
                {user && (
                  <>
                    <LocationUpdater userId={user.id} />
                    <SOSButton userId={user.id} />
                  </>
                )}
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;