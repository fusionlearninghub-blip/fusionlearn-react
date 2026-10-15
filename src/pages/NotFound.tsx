import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <div className="empty-state">
        <h2>Page not found</h2>
        <p>That page doesn't exist.</p>
        <br />
        <Link to="/" className="btn primary">Back to Home</Link>
      </div>
    </section>
  );
}
