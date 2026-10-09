import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const navLinks = [
  { id: "home", label: "Home", href: "/#home" },
  { id: "about", label: "About", href: "/#about" },
  { id: "skills", label: "Skills", href: "/#skills" },
  { id: "specialization", label: "Specialization", href: "/#specialization" },
  { id: "projects", label: "Projects", href: "/#projects" },
  { id: "certifications", label: "Certifications", href: "/#certifications" },
  { id: "achievements", label: "Achievements", href: "/#achievements" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { pathname } = useLocation();

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (pathname !== "/") return;

      const sections = navLinks.map((link) => ({
        id: link.id,
        element: document.getElementById(link.id),
      }));

      const scrollPosition = 110;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.getBoundingClientRect().top <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const currentActiveSection = pathname === "/projects"
    ? "projects"
    : pathname === "/contact"
      ? "contact"
      : activeSection;

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-container">
        <Link className="navbar-logo" to="/#home" onClick={handleNavClick}>
          <span className="logo-text">Smit</span>
        </Link>

        <button
          type="button"
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul
          className={`navbar-menu ${isMenuOpen ? "active" : ""}`}
          id="primary-navigation"
        >
          {navLinks.map((link) => (
            <li key={link.id} className="navbar-item">
              <Link
                to={link.href}
                className={`navbar-link ${
                  currentActiveSection === link.id ? "active" : ""
                }`}
                onClick={handleNavClick}
                aria-current={
                  currentActiveSection === link.id ? "location" : undefined
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
