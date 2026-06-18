const config = {
  high:   { bg: '#fdedec', color: '#922b21', border: '#e74c3c', label: '🔴 High Risk'   },
  medium: { bg: '#fef9e7', color: '#7d6608', border: '#f39c12', label: '🟡 Medium Risk' },
  low:    { bg: '#eafaf1', color: '#1e8449', border: '#27ae60', label: '🟢 Low Risk'    },
};

export default function RiskBadge({ severity }) {
  const c = config[severity] || config.low;
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 500,
      whiteSpace: 'nowrap'
    }}>
      {c.label}
    </span>
  );
}