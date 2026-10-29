import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function Home() {
  const skills = [
    'React',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'Python',
    'Git',
    'SQL',
  ];

  return (
    <div className="container page-home">
      <Header name="Smit Sanjava" />
      <About />
      <Skills skillList={skills} />

      <section className="preview-section">
        <div>
          <p className="section-kicker">Featured build</p>
          <h2>A task manager made to put React into practice.</h2>
          <p>Create, update, prioritize, and organize tasks with a connected API.</p>
        </div>
        <Link to="/projects" className="button button-primary">
          Try the task manager <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className="contact-banner">
        <div>
          <p className="section-kicker">Have a project in mind?</p>
          <h2>Let’s make something useful.</h2>
          <p>I’m always happy to talk about ideas, internships, and learning together.</p>
        </div>
        <Link to="/contact" className="button button-secondary">
          Say hello <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <Footer year={new Date().getFullYear()} />
    </div>
  );
}

export default Home;
