import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Analyser() {
  const [file, setFile]       = useState(null);
  const [drag, setDrag]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [step, setStep]       = useState('idle'); // idle | extracting | analysing | done
  const inputRef = useRef();
  const navigate = useNavigate();

  const pickFile = f => {
    if (f?.type === 'application/pdf') { setFile(f); setError(''); }
    else setError('Sirf PDF files accept hoti hain.');
  };

  const analyse = async () => {
    if (!file) return setError('Pehle PDF select karo.');
    setLoading(true); setError('');

    setStep('extracting');
    await new Promise(r => setTimeout(r, 600)); // UX pause
    setStep('analysing');

    try {
      const fd = new FormData();
      fd.append('pdf', file);
      const { data } = await API.post('/legal/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStep('done');
      setTimeout(() => navigate(`/document/${data.doc._id}`), 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Try again.');
      setStep('idle');
    } finally { setLoading(false); }
  };

  const stepLabels = {
    idle:       null,
    extracting: '📄 PDF se text extract ho raha hai...',
    analysing:  '🤖 Claude AI document analyse kar raha hai...',
    done:       '✅ Analysis complete! Redirect ho raha hai...',
  };

  return (
    <div style={{ maxWidth: 680, margin: '3rem auto', padding: '0 1rem', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 26 }}>📑 Legal Document Analyser</h2>
        <p style={{ color: '#777', marginTop: 6, fontSize: 15 }}>
          Rent agreement, job contract, court notice — koi bhi legal PDF upload karo. AI 30 seconds mein samjha dega.
        </p>
      </div>

      {/* Supported doc types */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['🏠 Rent Agreement','💼 Job Contract','⚖️ Court Notice','🤝 NDA','📋 Service Agreement','📜 Affidavit'].map(t => (
          <span key={t} style={{ background: '#f0ece1', color: '#5a4a2f', fontSize: 12, padding: '4px 12px', borderRadius: 20 }}>{t}</span>
        ))}
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${drag ? '#1a1a2e' : file ? '#27ae60' : '#c5b99a'}`,
          borderRadius: 14, padding: '3rem 2rem', textAlign: 'center',
          background: drag ? '#f8f4ed' : file ? '#eafaf1' : '#faf8f3',
          cursor: 'pointer', transition: 'all 0.2s', marginBottom: '1.5rem',
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }}
          onChange={e => pickFile(e.target.files[0])} />
        <div style={{ fontSize: 44, marginBottom: 10 }}>{file ? '✅' : '📂'}</div>
        {file ? (
          <>
            <p style={{ fontWeight: 600, color: '#1e8449', margin: '0 0 4px', fontSize: 16 }}>{file.name}</p>
            <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
              {(file.size / 1024).toFixed(1)} KB — Click to change file
            </p>
          </>
        ) : (
          <>
            <p style={{ fontWeight: 500, color: '#555', margin: '0 0 4px', fontSize: 16 }}>
              PDF yahan drag karo ya click karke select karo
            </p>
            <p style={{ color: '#aaa', fontSize: 13, margin: 0 }}>Max 10MB • Text-based PDFs only</p>
          </>
        )}
      </div>

      {/* Step progress */}
      {step !== 'idle' && (
        <div style={{ background: '#f0ece1', borderRadius: 10, padding: '0.9rem 1.2rem', marginBottom: '1rem', fontSize: 14, color: '#5a4a2f' }}>
          {stepLabels[step]}
        </div>
      )}

      {error && (
        <div style={{ background: '#fdedec', border: '1px solid #f5c6c6', borderRadius: 8, padding: '0.8rem 1rem', color: '#922b21', fontSize: 14, marginBottom: '1rem' }}>
          ❌ {error}
        </div>
      )}

      <button onClick={analyse} disabled={loading || !file}
        style={{
          background: loading ? '#aaa' : '#1a1a2e',
          color: '#e2b96f', border: 'none', padding: '12px 36px',
          borderRadius: 10, fontSize: 16, fontWeight: 600,
          cursor: loading || !file ? 'not-allowed' : 'pointer',
          letterSpacing: 0.3,
        }}>
        {loading ? '⏳ Analysing...' : '🔍 Analyse with AI →'}
      </button>

      <p style={{ fontSize: 12, color: '#aaa', marginTop: '1rem' }}>
        ⚕️ Disclaimer: AI analysis is for informational purposes only — not a substitute for professional legal advice.
      </p>
    </div>
  );
}