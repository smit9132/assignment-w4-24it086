import { Link } from 'react-router-dom';

function Header({ name }) {
  return (
    <header className="hero" id="home">
      <div className="hero-copy">
        <p className="section-kicker">
          <span className="status-dot" aria-hidden="true" />
          Information Technology student
        </p>
        <h1>
          Hello, I’m <span>{name.split(' ')[0]}.</span>
          <br />
          Learning to build
          <br />
          <em>thoughtful things.</em>
        </h1>
        <p className="hero-description">
          I’m an IT student exploring web development, application design, and
          databases — learning by building useful things one project at a time.
        </p>
        <div className="hero-actions">
          <Link to="/projects" className="button button-primary">
            Explore my work <span aria-hidden="true">↗</span>
          </Link>
          <Link to="/contact" className="hero-text-link">
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="hero-meta">
          <span>IT student</span>
          <span className="meta-divider" aria-hidden="true" />
          <span>Learning by building</span>
        </div>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="hero-card">
          <div className="hero-card-top">
            <span className="card-window-dots" aria-hidden="true"><i /><i /><i /></span>
            <span>profile / 01</span>
          </div>
          <div className="monogram" aria-hidden="true">S<span>.</span></div>
          <div className="hero-card-caption">
            <span className="card-caption-label">CURRENTLY EXPLORING</span>
            <strong>Web development</strong>
            <span>React · JavaScript · SQL</span>
          </div>
        </div>
        <div className="floating-note">
          <span className="note-icon" aria-hidden="true">✳</span>
          <span>Curiosity<br />in progress</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
