import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const riskColor = s => s >= 7 ? '#e74c3c' : s >= 4 ? '#f39c12' : '#27ae60';

export default function Dashboard() {
  const [docs, setDocs]     = useState([]);
  const [loading, setLoad]  = useState(true);
  const navigate            = useNavigate();
  const user                = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    API.get('/legal/history')
      .then(({ data }) => setDocs(data.docs))
      .finally(() => setLoad(false));
  }, []);

  return (
    <div style={{ maxWidth: 760, margin: '2rem auto', padding: '0 1rem', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Georgia, serif' }}>⚖️ My Documents</h2>
          <p style={{ color: '#888', margin: '4px 0 0', fontSize: 14 }}>
            Welcome back, {user.name} — {docs.length} document{docs.length !== 1 ? 's' : ''} analysed
          </p>
        </div>
        <button onClick={() => navigate('/analyser')}
          style={{ background: '#1a1a2e', color: '#e2b96f', border: 'none', padding: '10px 22px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          + Analyse New Doc
        </button>
      </div>

      {loading && <p style={{ color: '#aaa', textAlign: 'center', marginTop: '4rem' }}>Loading your documents...</p>}

      {!loading && docs.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#aaa' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
          <p style={{ fontSize: 16 }}>Koi document nahi mila.</p>
          <p style={{ fontSize: 14 }}>Pehla legal document analyse karne ke liye upar click karo.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {docs.map(doc => (
          <div key={doc._id}
            onClick={() => navigate(`/document/${doc._id}`)}
            style={{
              background: '#fff', border: '1px solid #e8dfc8', borderRadius: 12,
              padding: '1.1rem 1.4rem', cursor: 'pointer', transition: 'border-color 0.15s',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#1a1a2e'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e8dfc8'}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ background: '#f0ece1', color: '#5a4a2f', fontSize: 11, padding: '2px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                  {doc.docType || 'Legal Document'}
                </span>
                <span style={{ fontSize: 13, color: '#888', whiteSpace: 'nowrap' }}>
                  {doc.riskClauses?.length || 0} risk clauses
                </span>
              </div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {doc.fileName}
              </p>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: '#aaa' }}>
                {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {' · '}{(doc.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
            <div style={{ textAlign: 'right', marginLeft: 16, flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: 11, color: '#aaa' }}>Risk Score</p>
              <span style={{ fontSize: 22, fontWeight: 700, color: riskColor(doc.riskScore) }}>
                {doc.riskScore}/10
              </span>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#aaa' }}>View →</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}