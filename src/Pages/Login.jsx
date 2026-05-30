import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../Components/ThemeToggle';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import logo from '../assets/img.png';
import '../hook/Login.css';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({ email, password });
      
      if (result.success) {
        // Redirect based on user role
        const role = result.user?.role || 'student';
        switch (role) {
          case 'superadmin':
            navigate('/dashboard/superadmin');
            break;
          case 'admin':
            navigate('/dashboard/admin');
            break;
          case 'storekeeper':
            navigate('/dashboard/storekeeper');
            break;
          default:
            navigate('/dashboard/student');
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-v3">
      <div className="login-topbar">
        <ThemeToggle />
      </div>

      <div className="login-content">
        <div className="login-brand">
          <img src={logo} alt="ESI-GM" className="login-brand-logo" />
          <h2 className="login-brand-name">ESI-GM</h2>
          <p className="login-brand-school">École Supérieure d'Informatique Sidi Bel Abbès</p>
          <p className="login-brand-date">8 Mai 1945</p>

          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your ESI-GM account</p>
        </div>

        <div className="login-card-v3">

          {error && (
            <div className="login-error" style={{ 
              background: '#fee2e2', 
              color: '#dc2626', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form className="login-form-v3" onSubmit={handleSubmit}>
            <div className="login-field-v3">
              <label>Email Address</label>
              <div className="login-input-v3">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <small>Use your ESI email: x.xxxx@esi-sba.dz</small>
            </div>

            <div className="login-field-v3">
              <label>Password</label>
              <div className="login-input-v3">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="login-submit-v3"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="login-footer-v3">
            <div>
              <p onClick={() => navigate('/register')}>
                Don&apos;t have an account? <a href="">Register here</a>
              </p>
            </div>

            <div className="login-divider-v3" />

            <button type="button" className="login-back-v3" onClick={() => navigate('/')}>
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
