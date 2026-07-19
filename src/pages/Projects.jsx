import ProjectCard from '../components/ProjectCard';
import Footer from '../components/Footer';

const projects = [
  {
    title: 'Portfolio Website',
    description: 'A responsive portfolio website to showcase experience, skills, and projects.',
    stack: ['React', 'CSS', 'Vite'],
    githubLink: 'https://github.com/smit/portfolio',
    demoLink: 'https://smit-portfolio.example.com',
  },
  {
    title: 'Task Tracker',
    description: 'A task management app with add, edit, and filter features.',
    stack: ['React', 'JavaScript', 'HTML', 'CSS'],
    githubLink: 'https://github.com/smit/task-tracker',
    demoLink: 'https://smit-task-tracker.example.com',
  },
  {
    title: 'Study Notes App',
    description: 'A notes application designed for students to organize study resources.',
    stack: ['React', 'Python', 'Flask'],
    githubLink: 'https://github.com/smit/study-notes',
    demoLink: 'https://smit-study-notes.example.com',
  },
];

function Projects() {
  return (
    <div className="container page-projects">
      <section className="page-section">
        <h1>Projects</h1>
        <p>Browse through a few examples of my work, featuring front-end and full-stack projects.</p>
      </section>

      <section className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </section>

      <Footer year={new Date().getFullYear()} />
    </div>
  );
}

export default Projects;
