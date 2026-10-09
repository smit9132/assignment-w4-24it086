import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import Footer from '../components/Footer';
import RepoCard from '../components/RepoCard/RepoCard';
import Spinner from '../components/Spinner/Spinner';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import '../components/RepoCard/RepoCard.css';
import '../components/Spinner/Spinner.css';
import '../components/ErrorMessage/ErrorMessage.css';

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
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const githubUsername = 'octocat';

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
        if (!response.ok) {
          throw new Error('Could not fetch repositories from GitHub.');
        }
        const data = await response.json();
        setRepos(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRetry = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
      if (!response.ok) {
        throw new Error('Could not fetch repositories from GitHub.');
      }
      const data = await response.json();
      setRepos(data);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

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

      <section className="page-section">
        <h2>My GitHub Repositories</h2>
        <p>Search repositories locally, and view live GitHub repo data below.</p>

        <input
          type="text"
          placeholder="Search repositories"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="search-input"
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: '16px',
            border: '1px solid #d1d5db',
            marginBottom: '22px',
          }}
        />

        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : (
          <div className="repo-grid">
            {filteredRepos.length > 0 ? (
              filteredRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
            ) : (
              <p>No repositories match your search.</p>
            )}
          </div>
        )}
      </section>

      <Footer year={new Date().getFullYear()} />
    </div>
  );
}

export default Projects;
