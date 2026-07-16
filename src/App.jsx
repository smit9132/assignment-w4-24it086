import "./App.css";

import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Footer from "./components/Footer";

function App() {
  const studentName = "Smit Sanjava";

  const skills = [
    "React",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Python",
    "Git",
    "SQL",
  ];

  return (
    <div className="container">
      <Header name={studentName} themeColor="#0077cc" />

      <About />

      <Skills skillList={skills} />

      <Footer year={new Date().getFullYear()} />
    </div>
  );
}

export default App;