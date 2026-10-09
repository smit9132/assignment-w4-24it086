import "./Footer.css";

function Footer({ year }) {
  return (
    <footer className="page-section footer">
      <div className="footer-content">
        <h2>Contact</h2>
        <p>
          Email: <a href="mailto:smitsanjava.demo@gmail.com">smitsanjava.demo@gmail.com</a>
        </p>
        <p>
          GitHub: <a href="https://github.com/smit" target="_blank" rel="noreferrer">github.com/smit</a>
        </p>
        <p>
          LinkedIn: <a href="https://linkedin.com/smit" target="_blank" rel="noreferrer">linkedin.com/smit</a>
        </p>
        <p>© {year} Smit Sanjava. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
