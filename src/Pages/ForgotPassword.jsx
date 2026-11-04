import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../Components/ThemeToggle';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import logo from '../assets/img.png';
import '../hook/Login.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/esi-gm/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        // Transfer to code validation page after a short delay
        setTimeout(() => {
          navigate('/verify-code', { state: { email } });
        }, 2000);
      } else {
        setError(data.error || 'Failed to send reset code.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Forgot password error:', err);
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
          <h1 className="login-title">Forgot Password</h1>
          <p className="login-subtitle">Enter your email to receive a reset code</p>
        </div>

        <div className="login-card-v3">
          {error && (
            <div className="login-error" style={{ 
              background: '#fee2e2', color: '#dc2626', padding: '12px', 
              borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {message && (
            <div className="login-success" style={{ 
              background: '#dcfce7', color: '#16a34a', padding: '12px', 
              borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
            }}>
              {message}
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
                  required
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
                  Sending...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Send size={16} />
                  Send Reset Code
                </span>
              )}
            </button>
          </form>

          <div className="login-footer-v3">
            <button type="button" className="login-back-v3" onClick={() => navigate('/login')}>
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
