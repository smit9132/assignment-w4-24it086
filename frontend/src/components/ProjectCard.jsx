function ProjectCard({ title, description, stack, githubLink, demoLink }) {
  return (
    <article className="project-card">
      <div className="project-image" aria-hidden="true">
        <span>Image Placeholder</span>
      </div>
      <div className="project-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="project-stack">
          {stack.map((tech) => (
            <span key={tech} className="project-tag">
              {tech}
            </span>
          ))}
        </div>
        <div className="project-actions">
          <a href={githubLink} target="_blank" rel="noreferrer" className="button button-secondary">
            GitHub
          </a>
          <a href={demoLink} target="_blank" rel="noreferrer" className="button button-primary">
            Live Demo
          </a>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
