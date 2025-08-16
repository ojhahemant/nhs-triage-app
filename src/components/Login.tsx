import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Load saved username if "remember me" was used
  useEffect(() => {
    const savedUsername = localStorage.getItem('nhs_triage_remember_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = await login(username, password);

    if (success) {
      // Save username if "remember me" is checked
      if (rememberMe) {
        localStorage.setItem('nhs_triage_remember_username', username);
      } else {
        localStorage.removeItem('nhs_triage_remember_username');
      }
      
      // Navigation will be handled by useEffect above
    } else {
      setError('Invalid username or password. Please try again.');
      setPassword(''); // Clear password on failed attempt
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-form-container">
          <div className="login-header">
            <div className="nhs-logo">
              <div className="nhs-logo-block">NHS</div>
            </div>
            <h1>Plastic Surgery Triage System</h1>
            <p>Secure Clinical Access Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={isLoading}
                autoComplete="username"
                className="clean-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="clean-input"
                />
                <button
                  type="button"
                  className="password-toggle-clean"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Remember username</span>
              </label>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <>
                  <Loader className="spinner" size={20} />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
