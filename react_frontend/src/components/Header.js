import React from "react";

// PUBLIC_INTERFACE
export default function Header({ onToggleSidebar, isSidebarOpen }) {
  /** App header with title and mobile sidebar toggle. */
  return (
    <header className="sm-header">
      <div className="sm-header__left">
        <button
          className="sm-icon-btn sm-header__menu"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
        >
          <span aria-hidden="true">☰</span>
        </button>
        <div className="sm-brand">
          <div className="sm-brand__title">SQLMaster</div>
          <div className="sm-brand__subtitle">
            Interactive SQL blog, quizzes, and practice
          </div>
        </div>
      </div>

      <div className="sm-header__right">
        <a
          className="sm-link"
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
          target="_blank"
          rel="noreferrer"
        >
          Docs
        </a>
      </div>
    </header>
  );
}
