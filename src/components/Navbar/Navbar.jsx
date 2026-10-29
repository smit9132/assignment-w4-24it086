import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

const navLinks = [
  { id: "home", label: "Home", href: "/#home", section: true },
  { id: "about", label: "About", href: "/#about", section: true },
  { id: "skills", label: "Skills", href: "/#skills", section: true },
  { id: "projects", label: "Task Manager", href: "/projects", path: "/projects" },
  { id: "contact", label: "Contact", href: "/contact", path: "/contact" },
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

      const sections = navLinks
        .filter((link) => link.section)
        .map((link) => ({
          id: link.id,
          element: document.getElementById(link.id),
        }));

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const currentActiveSection = pathname === "/"
    ? activeSection
    : navLinks.find((link) => link.path === pathname)?.id;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a className="navbar-logo" href="/#home" onClick={handleNavClick}>
          <span className="logo-text">Smit</span>
        </a>

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
              <a
                href={link.href}
                className={`navbar-link ${
                  currentActiveSection === link.id ? "active" : ""
                }`}
                onClick={handleNavClick}
                aria-current={
                  currentActiveSection === link.id
                    ? link.path ? "page" : "location"
                    : undefined
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
