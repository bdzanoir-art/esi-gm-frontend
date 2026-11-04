import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../Components/ThemeToggle';
import { KeyRound, Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import logo from '../assets/img.png';
import '../hook/Login.css';

export default function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/esi-gm/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Invalid code or email.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Reset password error:', err);
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
          <h1 className="login-title">Verify Reset Code</h1>
          <p className="login-subtitle">Enter the code sent to {email}</p>
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
              <label>Validation Code</label>
              <div className="login-input-v3">
                <KeyRound size={16} />
                <input
                  type="text"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div className="login-field-v3">
              <label>New Password</label>
              <div className="login-input-v3">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field-v3">
              <label>Confirm Password</label>
              <div className="login-input-v3">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Resetting...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} />
                  Reset Password
                </span>
              )}
            </button>
          </form>

          <div className="login-footer-v3">
            <button type="button" className="login-back-v3" onClick={() => navigate('/forgot-password')}>
              <ArrowLeft size={14} />
              <span>Request new code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
