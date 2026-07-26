function Header({ name, themeColor }) {
  return (
    <header style={{ padding: '24px 20px 18px' }}>
      <h1
        style={{
          margin: 0,
          color: themeColor,
          fontWeight: 700,
          letterSpacing: '0.02em',
          lineHeight: 1.05,
        }}
      >
        {name}
      </h1>
      <div style={{ marginTop: 12, color: '#1e293b', fontSize: '0.98rem', lineHeight: 1.6 }}>
        <strong>Title:</strong> Information and Technology (IT)
      </div>
      <hr style={{ border: 0, borderTop: `2px solid ${themeColor}`, marginTop: 20 }} />
    </header>
  );
}

export default Header;