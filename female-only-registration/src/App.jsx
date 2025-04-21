import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/Registration'; // Assuming the registration form is here
import Home from './pages/Home'; // Home page for the SOS app
import LocationUpdater from './components/LocationUpdater';
import SOSButton from './components/SOSButton';
// import ChatWindow if needed

// Replace with actual user ID from auth or context
const userId = 'b123536f-5102-46ae-a8f3-9cdb1d12e294'; // Mocking user ID for now

function App() {
  return (
    <Router>
      <Routes>
        {/* Registration route */}
        <Route path="/registration" element={<RegistrationForm />} />
        
        {/* Main SOS App route */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
              <h1 className="text-3xl font-bold mb-6">SOS Emergency App</h1>
              <LocationUpdater userId={userId} />
              <SOSButton userId={userId} />
              {/* <ChatWindow chatId="chat_id_here" userId={userId} /> */}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
