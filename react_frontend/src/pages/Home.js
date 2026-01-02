import React from "react";

// PUBLIC_INTERFACE
export default function Home({ posts, onOpenPost, onOpenPlayground, lastRead }) {
  /** Home page with introduction and featured posts. */
  const featured = posts.filter((p) => p.featured);

  return (
    <div className="sm-page">
      <div className="sm-hero">
        <h1 className="sm-hero__title">Learn SQL by reading and doing</h1>
        <p className="sm-hero__text">
          SQLMaster combines short blog posts, inline quizzes with instant
          feedback, and a lightweight SQL playground that runs entirely in your
          browser.
        </p>
        <div className="sm-hero__actions">
          <button className="sm-btn sm-btn--primary" onClick={onOpenPlayground}>
            Open Playground
          </button>
          {lastRead ? (
            <button
              className="sm-btn sm-btn--secondary"
              onClick={() => onOpenPost(lastRead)}
            >
              Resume reading
            </button>
          ) : null}
        </div>
      </div>

      <section className="sm-card">
        <div className="sm-card__title">Featured posts</div>
        <div className="sm-grid">
          {featured.map((p) => (
            <button
              key={p.id}
              className="sm-tile"
              onClick={() => onOpenPost(p.id)}
            >
              <div className="sm-tile__title">{p.title}</div>
              <div className="sm-tile__desc">{p.description}</div>
              <div className="sm-tile__meta">{p.readingMinutes} min read</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
