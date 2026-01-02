import React from "react";

// PUBLIC_INTERFACE
export default function Sidebar({
  posts,
  currentRoute,
  onNavigate,
  readingProgress,
}) {
  /** Sidebar navigation for posts and core pages. */
  return (
    <nav className="sm-sidebar" aria-label="Blog navigation">
      <div className="sm-sidebar__section">
        <div className="sm-sidebar__sectionTitle">Navigate</div>
        <button
          className={`sm-navItem ${
            currentRoute?.type === "home" ? "is-active" : ""
          }`}
          onClick={() => onNavigate({ type: "home" })}
        >
          Home
        </button>
        <button
          className={`sm-navItem ${
            currentRoute?.type === "playground" ? "is-active" : ""
          }`}
          onClick={() => onNavigate({ type: "playground" })}
        >
          Playground
        </button>
      </div>

      <div className="sm-sidebar__section">
        <div className="sm-sidebar__sectionTitle">Posts</div>
        <div className="sm-postList">
          {posts.map((p) => {
            const pct = readingProgress?.[p.id]?.percent ?? 0;
            return (
              <button
                key={p.id}
                className={`sm-postItem ${
                  currentRoute?.type === "post" && currentRoute?.postId === p.id
                    ? "is-active"
                    : ""
                }`}
                onClick={() => onNavigate({ type: "post", postId: p.id })}
              >
                <div className="sm-postItem__title">{p.title}</div>
                <div className="sm-postItem__meta">
                  <span>{p.readingMinutes} min</span>
                  <span className="sm-dot" aria-hidden="true">
                    •
                  </span>
                  <span>{Math.round(pct)}% read</span>
                </div>
                <div
                  className="sm-progress"
                  role="progressbar"
                  aria-label={`Reading progress ${Math.round(pct)}%`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(pct)}
                >
                  <div
                    className="sm-progress__bar"
                    style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
