import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Footer from './components/Footer/Footer';
import Achievements from './components/Achievements/Achievements';
import Certifications from './components/Certifications/Certifications';
import Education from './components/Education/Education';
import Specialization from './components/Specialization/Specialization';

const Projects = lazy(() => import('./components/Projects/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const portfolioSkills = [
  'React',
  'TypeScript',
  'JavaScript',
  'HTML',
  'CSS',
  'Python',
  'Git',
  'SQL',
];

function Home() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/' || !hash) return undefined;

    const sectionId = hash.slice(1);
    const frameId = window.requestAnimationFrame(() => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const navbarHeight = document.querySelector('.navbar')?.getBoundingClientRect().height ?? 0;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;
      window.scrollTo({ top: Math.max(sectionTop, 0), behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [hash, pathname]);

  return (
    <div className="container page-home">
      <Hero />
      <About />
      <Education />
      <Skills skillList={portfolioSkills} />
      <Specialization />

      <section className="preview-section" id="projects">
        <div>
          <p className="section-kicker">Featured project</p>
          <h2>A task manager made to put React into practice.</h2>
          <p>
            Create, update, prioritize, and organize tasks with the connected
            Task Manager API.
          </p>
        </div>
        <Link to="/projects" className="button button-primary">
          Open the task manager <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <Certifications />
      <Achievements />

      <section className="preview-section" id="contact">
        <div>
          <p className="section-kicker">Get in touch</p>
          <h2>Have a project or opportunity in mind?</h2>
          <p>
            Send a message about internships, collaboration, or something
            you would like to build.
          </p>
        </div>
        <Link to="/contact" className="button button-secondary">
          Contact me <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <Footer year={new Date().getFullYear()} />
    </div>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return (
    <div className={darkMode ? 'app dark-mode' : 'app light-mode'}>
      <Navbar
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
      />

      <main className="app-main">
        <Suspense
          fallback={(
            <div className="page-loading" role="status" aria-live="polite">
              <h2>Loading page...</h2>
              <p>Please wait while the page loads.</p>
            </div>
          )}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;