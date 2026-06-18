import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!localStorage.getItem('token');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: 58,
      background: '#1a1a2e', color: '#fff',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <Link to="/dashboard" style={{ color: '#e2b96f', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>
        ⚖️ LexSimplify
      </Link>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', fontSize: 14 }}>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={{ color: '#ccc', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/analyse"   style={{ color: '#ccc', textDecoration: 'none' }}>Analyse Doc</Link>
            <span style={{ color: '#888' }}>|</span>
            <span style={{ color: '#e2b96f' }}>👤 {user.name}</span>
            <button onClick={logout} style={{
              background: 'transparent', border: '1px solid #555',
              color: '#ccc', padding: '4px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={{ color: '#ccc', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#e2b96f', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}