import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Navbar({ darkMode, onToggleTheme }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="nav-logo">
          Student Portfolio
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/projects" className="nav-link">
          Projects
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
      </div>
      <ThemeToggle darkMode={darkMode} onToggleTheme={onToggleTheme} />
    </nav>
  );
}

export default Navbar;
