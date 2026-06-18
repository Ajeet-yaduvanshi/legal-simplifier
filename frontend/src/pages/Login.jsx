import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f1eb' }}>
      <div style={{ width: 380, background: '#fff', borderRadius: 14, padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 0.3rem', fontFamily: 'Georgia, serif',color:'#704c59' }}>⚖️ Welcome back</h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: '1.8rem' }}>Login to access your documents</p>
        <label style={{ fontSize: 13, color: '#555' }}>Email</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          style={{ display: 'block', width: '100%', marginTop: 4, marginBottom: 14, padding: '9px 12px', borderRadius: 7, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
        <label style={{ fontSize: 13, color: '#555' }}>Password</label>
        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          style={{ display: 'block', width: '100%', marginTop: 4, marginBottom: 16, padding: '9px 12px', borderRadius: 7, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
        {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button onClick={handle} disabled={loading}
          style={{ width: '100%', background: '#1a1a2e', color: '#e2b96f', border: 'none', padding: '11px', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
          {loading ? 'Logging in...' : 'Login →'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: 13, color: '#888' }}>
          New here? <Link to="/register" style={{ color: '#1a1a2e', fontWeight: 500 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}