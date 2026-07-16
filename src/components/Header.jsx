function Header({ name, themeColor }) {
  return (
    <header style={{ padding: "20px" }}>
      <h1 style={{ margin: 0, color: themeColor, fontWeight: 700 }}>{name}</h1>
      <div style={{ marginTop: 6, color: "#555" }}>
        <strong>Title:</strong> Information and Technology (IT)
      </div>
      <hr style={{ border: 0, borderTop: `2px solid ${themeColor}`, marginTop: 14 }} />
    </header>
  );
}

export default Header;