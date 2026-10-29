function Footer({ year }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <p className="section-kicker">Let’s connect</p>
          <h2>Have an idea or just want to say hello?</h2>
          <a className="footer-email" href="mailto:smitsanjava.demo@gmail.com">
            smitsanjava.demo@gmail.com <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="footer-links">
          <a href="https://github.com/smit" target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href="https://linkedin.com/smit" target="_blank" rel="noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {year} Smit Sanjava</span>
        <span>Designed with curiosity <span aria-hidden="true">✳</span></span>
      </div>
    </footer>
  );
}

export default Footer;
