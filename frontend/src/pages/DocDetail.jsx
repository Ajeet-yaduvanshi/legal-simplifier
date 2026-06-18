import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import RiskBadge from '../components/RiskBadge';

const riskScoreColor = s =>
  s >= 7 ? '#c0392b' : s >= 4 ? '#d68910' : '#1e8449';

export default function DocDetail() {
  const { id }            = useParams();
  const navigate          = useNavigate();
  const [doc, setDoc]     = useState(null);
  const [question, setQ]  = useState('');
  const [chatLoading, setCL] = useState(false);
  const [activeTab, setTab]  = useState('summary'); // summary | risks | chat

  useEffect(() => {
    API.get(`/legal/doc/${id}`)
      .then(({ data }) => setDoc(data.doc))
      .catch(() => navigate('/dashboard'));
  }, [id]);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setCL(true);
    const q = question; setQ('');
    try {
      const { data } = await API.post('/legal/ask', { docId: id, question: q });
      setDoc(prev => ({
        ...prev,
        chatHistory: [
          ...prev.chatHistory,
          { role: 'user', content: q },
          { role: 'assistant', content: data.answer },
        ],
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error. Try again.');
    } finally { setCL(false); }
  };

  if (!doc) return (
    <div style={{ textAlign: 'center', marginTop: '5rem', color: '#888' }}>
      Loading document...
    </div>
  );

  const tabStyle = active => ({
    padding: '8px 20px', borderRadius: '6px 6px 0 0', border: 'none', cursor: 'pointer',
    fontWeight: active ? 600 : 400, fontSize: 14,
    background: active ? '#1a1a2e' : '#f0ece1',
    color: active ? '#e2b96f' : '#666',
  });

  return (
    <div style={{ maxWidth: 780, margin: '2rem auto', padding: '0 1rem', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Back */}
      <button onClick={() => navigate('/dashboard')}
        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 14, marginBottom: '1rem', padding: 0 }}>
        ← Back to Dashboard
      </button>

      {/* Doc Header */}
      <div style={{ background: '#1a1a2e', color: '#fff', borderRadius: '12px 12px 0 0', padding: '1.4rem 1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#e2b96f', fontSize: 13, margin: '0 0 4px', fontWeight: 500 }}>{doc.docType}</p>
          <h2 style={{ margin: 0, fontSize: 18, color: '#fff' }}>{doc.fileName}</h2>
          <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: 12 }}>
            {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}{(doc.fileSize / 1024).toFixed(1)} KB
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 13, color: '#aaa', margin: '0 0 4px' }}>Risk Score</p>
          <span style={{ fontSize: 28, fontWeight: 700, color: riskScoreColor(doc.riskScore) }}>
            {doc.riskScore}/10
          </span>
        </div>
      </div>

      {/* Party Names + Dates strip */}
      {(doc.partyNames?.length > 0 || doc.importantDates?.length > 0) && (
        <div style={{ background: '#f8f4ed', border: '1px solid #e8dfc8', borderTop: 'none', padding: '0.7rem 1.8rem', display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, color: '#5a4a2f' }}>
          {doc.partyNames?.length > 0 && (
            <span>👥 <strong>Parties:</strong> {doc.partyNames.join(' · ')}</span>
          )}
          {doc.importantDates?.length > 0 && (
            <span>📅 <strong>Dates:</strong> {doc.importantDates.join(' · ')}</span>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginTop: '1.2rem', borderBottom: '2px solid #1a1a2e', paddingBottom: 0 }}>
        <button style={tabStyle(activeTab === 'summary')} onClick={() => setTab('summary')}>📋 Summary</button>
        <button style={tabStyle(activeTab === 'risks')}   onClick={() => setTab('risks')}>
          ⚠️ Risk Clauses {doc.riskClauses?.length > 0 && `(${doc.riskClauses.length})`}
        </button>
        <button style={tabStyle(activeTab === 'chat')}    onClick={() => setTab('chat')}>💬 Ask AI</button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e8e0d0', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '1.5rem 1.8rem' }}>

        {/* ── SUMMARY TAB ── */}
        {activeTab === 'summary' && (
          <>
            <h3 style={{ marginTop: 0, fontSize: 16 }}>Plain Language Explanation</h3>
            <p style={{ lineHeight: 1.75, color: '#444', background: '#f9f7f2', borderRadius: 8, padding: '1rem 1.2rem', borderLeft: '4px solid #e2b96f' }}>
              {doc.simplifiedText}
            </p>

            <h3 style={{ fontSize: 16, marginTop: '1.5rem' }}>Key Points</h3>
            {doc.keyPoints?.map((pt, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                <span style={{ background: '#1a1a2e', color: '#e2b96f', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i+1}</span>
                <span style={{ fontSize: 14, color: '#333', lineHeight: 1.55 }}>{pt}</span>
              </div>
            ))}

            <div style={{ background: '#fef9e7', border: '1px solid #f5d67a', borderRadius: 8, padding: '0.9rem 1.2rem', marginTop: '1.5rem' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#7d6608' }}>
                <strong>⚠️ Risk Summary:</strong> {doc.riskSummary}
              </p>
            </div>
          </>
        )}

        {/* ── RISK CLAUSES TAB ── */}
        {activeTab === 'risks' && (
          <>
            <h3 style={{ marginTop: 0, fontSize: 16 }}>
              Risky / Unfair Clauses Found
              <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 400, color: '#888' }}>
                — {doc.riskClauses?.length || 0} clauses detected
              </span>
            </h3>
            {doc.riskClauses?.length === 0 ? (
              <p style={{ color: '#27ae60', fontWeight: 500 }}>✅ No risky clauses found. Document looks fair!</p>
            ) : (
              doc.riskClauses.map((rc, i) => (
                <div key={i} style={{
                  border: `1px solid ${rc.severity === 'high' ? '#f5c6c6' : rc.severity === 'medium' ? '#fde8b0' : '#c3e6cb'}`,
                  borderRadius: 10, marginBottom: '1rem', overflow: 'hidden',
                }}>
                  <div style={{
                    background: rc.severity === 'high' ? '#fdedec' : rc.severity === 'medium' ? '#fef9e7' : '#eafaf1',
                    padding: '0.7rem 1rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Clause #{i+1}</span>
                    <RiskBadge severity={rc.severity} />
                  </div>
                  <div style={{ padding: '0.8rem 1rem' }}>
                    <p style={{ fontSize: 13, fontStyle: 'italic', color: '#555', background: '#f9f9f9', padding: '0.6rem', borderRadius: 6, margin: '0 0 8px', borderLeft: '3px solid #ccc' }}>
                      "{rc.clause}"
                    </p>
                    <p style={{ fontSize: 13, color: '#333', margin: 0, lineHeight: 1.55 }}>
                      <strong>⚠️ Why risky:</strong> {rc.explanation}
                    </p>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── CHAT TAB ── */}
        {activeTab === 'chat' && (
          <>
            <h3 style={{ marginTop: 0, fontSize: 16 }}>Ask AI About This Document</h3>
            <p style={{ color: '#888', fontSize: 13, marginTop: -8, marginBottom: '1rem' }}>
              Kuch bhi pooch sakte ho — "Can my landlord do this?", "What does clause 5 mean?", etc.
            </p>

            {/* Suggested questions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
              {[
                'What are my rights here?',
                'Can I break this contract early?',
                'What happens if I violate this?',
                'Is this document valid?',
              ].map(q => (
                <button key={q} onClick={() => setQ(q)}
                  style={{ background: '#f0ece1', border: '1px solid #d4c9a8', color: '#5a4a2f', fontSize: 12, padding: '5px 12px', borderRadius: 20, cursor: 'pointer' }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Chat messages */}
            <div style={{ maxHeight: 380, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {doc.chatHistory?.length === 0 && (
                <p style={{ color: '#bbb', fontSize: 13, textAlign: 'center', padding: '2rem 0' }}>
                  Abhi tak koi question nahi pucha. Upar suggest kiye hue questions try karo!
                </p>
              )}
              {doc.chatHistory?.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: msg.role === 'user' ? '#1a1a2e' : '#f8f4ed',
                  color: msg.role === 'user' ? '#e2b96f' : '#333',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  padding: '0.7rem 1rem', fontSize: 14, lineHeight: 1.55,
                }}>
                  {msg.content}
                </div>
              ))}
              {chatLoading && (
                <div style={{ alignSelf: 'flex-start', background: '#f8f4ed', borderRadius: '12px 12px 12px 2px', padding: '0.7rem 1rem', fontSize: 14, color: '#888' }}>
                  🤖 AI soch raha hai...
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={question}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !chatLoading && askQuestion()}
                placeholder="Apna question type karo..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #d4c9a8', fontSize: 14, outline: 'none' }}
              />
              <button onClick={askQuestion} disabled={chatLoading || !question.trim()}
                style={{ background: '#1a1a2e', color: '#e2b96f', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                Ask →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}