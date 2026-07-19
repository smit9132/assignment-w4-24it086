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
      <Header name="Smit Sanjava" themeColor="#0077cc" />
      <About />
      <Skills skillList={skills} />

      <section className="preview-section">
        <h2>Projects Preview</h2>
        <p>Explore a selection of projects built with modern web technologies.</p>
        <Link to="/projects" className="button button-primary">
          View Projects
        </Link>
      </section>

      <section className="preview-section">
        <h2>Contact Preview</h2>
        <p>Send a message or ask about internships and collaboration opportunities.</p>
        <Link to="/contact" className="button button-secondary">
          Contact Me
        </Link>
      </section>

      <Footer year={new Date().getFullYear()} />
    </div>
  );
}

export default Home;
