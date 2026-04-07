import React, { createContext, useContext, useState } from 'react';
import { validateStudent } from '../services/studentService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: 'mentor' | 'student', usn?: string }

  const login = (username, password) => {
    // Mentor credentials
    if (username === 'mentor' && password === 'mentor') {
      setUser({ role: 'mentor' });
      return { success: true, role: 'mentor' };
    }

    // Student login: password must be 'student', USN must exist
    if (password === 'student') {
      if (validateStudent(username)) {
        setUser({ role: 'student', usn: username.toUpperCase() });
        return { success: true, role: 'student' };
      } else {
        return {
          success: false,
          message: 'Invalid user. Please contact the mentor.',
        };
      }
    }

    return { success: false, message: 'Invalid credentials.' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
