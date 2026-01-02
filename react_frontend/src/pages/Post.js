import React, { useEffect, useMemo } from "react";
import CodeBlock from "../components/CodeBlock";
import Markdown from "../components/Markdown";
import Quiz from "../components/Quiz";

// PUBLIC_INTERFACE
export default function Post({
  post,
  quizStateById,
  onQuizStateChange,
  onReadingProgress,
}) {
  /** Render a post with mixed content (markdown, code, quizzes). */
  const sectionCount = post.sections.length;

  const quizIds = useMemo(
    () =>
      post.sections
        .filter((s) => s.type === "quiz")
        .map((s) => s.quizId),
    [post.sections]
  );

  const completedQuizzes = quizIds.filter(
    (id) => quizStateById?.[id]?.completed
  ).length;

  // Mark as "opened" and initial progress.
  useEffect(() => {
    onReadingProgress?.(post.id, { lastOpenedAt: Date.now(), percent: 5 });
  }, [post.id, onReadingProgress]);

  function handleMarkRead() {
    onReadingProgress?.(post.id, { lastOpenedAt: Date.now(), percent: 100 });
  }

  return (
    <article className="sm-page">
      <header className="sm-postHeader">
        <div>
          <h1 className="sm-postHeader__title">{post.title}</h1>
          <div className="sm-postHeader__meta">
            {post.readingMinutes} min • Quizzes completed:{" "}
            <strong>{completedQuizzes}</strong> / {quizIds.length}
          </div>
        </div>

        <button className="sm-btn sm-btn--secondary" onClick={handleMarkRead}>
          Mark as read
        </button>
      </header>

      <div className="sm-postBody">
        {post.sections.map((s, idx) => {
          if (s.type === "markdown") {
            return (
              <section key={idx} className="sm-section">
                <Markdown content={s.content} />
              </section>
            );
          }

          if (s.type === "code") {
            return (
              <section key={idx} className="sm-section">
                <CodeBlock language={s.language} code={s.content} />
              </section>
            );
          }

          if (s.type === "quiz") {
            return (
              <section key={idx} className="sm-section">
                <Quiz
                  quizId={s.quizId}
                  title={s.title}
                  questions={s.questions}
                  storedState={quizStateById?.[s.quizId]}
                  onChange={(next) => onQuizStateChange?.(s.quizId, next)}
                />
              </section>
            );
          }

          return (
            <section key={idx} className="sm-section">
              <div className="sm-muted">
                Unsupported section type: <code>{s.type}</code>
              </div>
            </section>
          );
        })}
      </div>

      <footer className="sm-postFooter">
        <div className="sm-muted">
          Sections: {sectionCount}. Progress is saved locally in your browser.
        </div>
      </footer>
    </article>
  );
}
