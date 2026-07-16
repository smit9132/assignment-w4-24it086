function Footer({ year }) {
  return (
    <footer
      style={{
        backgroundColor: "#333",
        color: "white",
        textAlign: "center",
        padding: "15px",
        marginTop: "20px",
      }}
    >
      <div style={{ textAlign: "left", maxWidth: 900, margin: "0 auto" }}>
        <h3 style={{ marginTop: 0, color: "#fff" }}>Contact</h3>
        <div>
          <strong>Email:</strong>{" "}
          <a href="mailto:smitsanjava.demo@gmail.com" style={{ color: "#a8d0ff" }}>smitsanjava.demo@gmail.com</a>
        </div>
        <div>
          <strong>Github:</strong>{" "}
          <a href="https://github.com/smit" target="_blank" rel="noreferrer" style={{ color: "#a8d0ff" }}>github.com/smit</a>
        </div>
        <div>
          <strong>LinkedIn:</strong>{" "}
          <a href="https://linkedin.com/smit" target="_blank" rel="noreferrer" style={{ color: "#a8d0ff" }}>linkedin.com/smit</a>
        </div>

        <p style={{ marginTop: 12, color: "#ddd" }}>© {year} Smit Sanjava. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;