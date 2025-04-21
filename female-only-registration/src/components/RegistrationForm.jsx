import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase'; // make sure you import your Supabase client

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const { email, password } = formData;

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) throw signUpError;

      setMessage('Check your email to confirm your registration, then log in.');
    } catch (error) {
      console.error('Registration error:', error.message);
      setMessage(`Registration failed: ${error.message}`);
    }
  };

  // 🔁 Listen for login event to create profile
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          const user = session.user;
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: user.id,
              email: user.email,
              full_name: formData.full_name
            }
          ]);

          if (profileError) {
            console.error('Profile insert error:', profileError.message);
            setMessage(`Profile creation failed: ${profileError.message}`);
          } else {
            setMessage('Registration and profile creation successful!');
          }
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [formData.full_name]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
}
