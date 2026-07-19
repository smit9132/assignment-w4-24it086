function ThemeToggle({ darkMode, onToggleTheme }) {
  return (
    <button className="theme-toggle" type="button" onClick={onToggleTheme}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}

export default ThemeToggle;
