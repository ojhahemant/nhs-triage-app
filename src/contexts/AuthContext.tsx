import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  role: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple user database - in production this would be replaced with real authentication
const USERS = [
  {
    username: 'clinician',
    password: 'nhs2025',
    role: 'Clinician',
    fullName: 'Dr. Sarah Wilson'
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedUser = localStorage.getItem('nhs_triage_user');
        const sessionExpiry = localStorage.getItem('nhs_triage_session_expiry');
        
        if (savedUser && sessionExpiry) {
          const expiryTime = new Date(sessionExpiry);
          const now = new Date();
          
          if (now < expiryTime) {
            setUser(JSON.parse(savedUser));
          } else {
            // Session expired, clear storage
            localStorage.removeItem('nhs_triage_user');
            localStorage.removeItem('nhs_triage_session_expiry');
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        // Clear corrupted data
        localStorage.removeItem('nhs_triage_user');
        localStorage.removeItem('nhs_triage_session_expiry');
      }
      setIsLoading(false);
    };

    checkExistingSession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Trim whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = USERS.find(
      u => u.username === trimmedUsername && u.password === trimmedPassword
    );
    
    if (foundUser) {
      const userSession: User = {
        username: foundUser.username,
        role: foundUser.role,
        fullName: foundUser.fullName
      };
      
      // Set session expiry to 8 hours from now
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 8);
      
      // Save to localStorage
      localStorage.setItem('nhs_triage_user', JSON.stringify(userSession));
      localStorage.setItem('nhs_triage_session_expiry', expiryTime.toISOString());
      
      setUser(userSession);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nhs_triage_user');
    localStorage.removeItem('nhs_triage_session_expiry');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
