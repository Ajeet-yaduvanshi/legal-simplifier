import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handle = async () => {
    try {
      const { data } = await API.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f1eb' }}>
      <div style={{ width: 380, background: '#fff', borderRadius: 14, padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 0.3rem', fontFamily: 'Georgia, serif' }}>⚖️ Create Account</h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: '1.8rem' }}>Start simplifying your legal documents</p>
        {['name','email','password'].map(field => (
          <div key={field} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: '#555', textTransform: 'capitalize' }}>{field}</label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              placeholder={field === 'name' ? 'Your full name' : field === 'email' ? 'you@example.com' : '••••••••'}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: '9px 12px', borderRadius: 7, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
        ))}
        {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button onClick={handle}
          style={{ width: '100%', background: '#1a1a2e', color: '#e2b96f', border: 'none', padding: '11px', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
          Create Account →
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: 13, color: '#888' }}>
          Already registered? <Link to="/" style={{ color: '#1a1a2e', fontWeight: 500 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}