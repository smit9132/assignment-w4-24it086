import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container page-notfound">
      <section className="page-section">
        <h1>404</h1>
        <p>Page Not Found</p>
        <Link to="/" className="button button-primary">
          Return Home
        </Link>
      </section>
    </div>
  );
}

export default NotFound;
