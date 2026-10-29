import { lazy, Suspense } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';

const Projects = lazy(() => import('./components/Projects/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found-code">404</p>
      <h1>Looks like a wrong turn.</h1>
      <p>The page you’re looking for isn’t here. Let’s get you back on track.</p>
      <Link to="/" className="button button-primary">Back to home</Link>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar />

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