import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Footer from './components/Footer/Footer';
import Achievements from './components/Achievements/Achievements';
import Certifications from './components/Certifications/Certifications';
import Education from './components/Education/Education';
import Specialization from './components/Specialization/Specialization';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;