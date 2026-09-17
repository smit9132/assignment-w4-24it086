import { lazy, Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
const Contact = lazy(() => import('./components/Contact/Contact'));

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Skills />
      <Specialization />
      <Certifications />
      <Achievements />
      <Footer />
    </>
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