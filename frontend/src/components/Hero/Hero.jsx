import "./Hero.css";

function Hero() {
  return (
    <header className="hero-header" id="home">
      <div className="hero-headline">
        <p className="section-kicker">Information Technology student</p>
        <h1>Hello, I’m Smit Sanjava.</h1>
        <p className="hero-subtitle">
          I’m exploring web development, application design, and databases —
          learning by building useful things one project at a time.
        </p>
      </div>
      <hr className="hero-divider" />
    </header>
  );
}

export default Hero;
