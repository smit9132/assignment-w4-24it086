function RepoCard({ repo }) {
  const { html_url, name, description, language, stargazers_count, forks_count } = repo;

  return (
    <article className="repo-card">
      <div className="repo-card-header">
        <h3>{name}</h3>
        <span className="repo-stars">⭐ {stargazers_count}</span>
      </div>
      <p>{description || 'No description provided.'}</p>
      <div className="repo-meta">
        <span>{language || 'Unknown'}</span>
        <span>Forks: {forks_count}</span>
      </div>
      <a href={html_url} target="_blank" rel="noreferrer" className="button button-secondary repo-button">
        Open in GitHub
      </a>
    </article>
  );
}

export default RepoCard;
