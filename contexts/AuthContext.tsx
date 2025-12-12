import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'promptsmith_users_db';
const SESSION_STORAGE_KEY = 'promptsmith_current_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        console.error('Failed to parse session', e);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Find user by username OR email (case-insensitive)
    const foundUser = users.find((u: any) => 
      (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()) 
      && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const userData: User = {
      id: foundUser.id,
      name: foundUser.name,
      username: foundUser.username,
      email: foundUser.email
    };

    setUser(userData);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
  };

  const register = async (name: string, username: string, email: string, password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];

    if (users.some((u: any) => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Username already taken');
    }

    if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      username,
      email,
      password // In a real app, never store passwords plainly!
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email
    };

    setUser(userData);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};