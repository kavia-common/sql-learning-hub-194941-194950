import React, { useCallback, useMemo, useState } from "react";
import "./App.css";

import posts from "./content/posts";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Playground from "./pages/Playground";
import { loadJson, saveJson } from "./utils/storage";

const STORAGE_KEYS = {
  readingProgress: "readingProgress",
  lastRoute: "lastRoute",
  quizState: "quizState",
  playground: "playground",
};

function clampPct(p) {
  return Math.max(0, Math.min(100, p));
}

// PUBLIC_INTERFACE
function App() {
  /** SQLMaster app entry: manages navigation and persistence in localStorage. */
  const postIndex = useMemo(() => {
    const map = {};
    for (const p of posts) map[p.id] = p;
    return map;
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [readingProgress, setReadingProgress] = useState(() =>
    loadJson(STORAGE_KEYS.readingProgress, {})
  );
  const [quizStateById, setQuizStateById] = useState(() =>
    loadJson(STORAGE_KEYS.quizState, {})
  );
  const [playgroundState, setPlaygroundState] = useState(() =>
    loadJson(STORAGE_KEYS.playground, null)
  );

  const [route, setRoute] = useState(() =>
    loadJson(STORAGE_KEYS.lastRoute, { type: "home" })
  );

  const lastReadPostId = useMemo(() => {
    const entries = Object.entries(readingProgress ?? {});
    if (!entries.length) return null;

    // pick the most recently opened
    entries.sort((a, b) => (b[1]?.lastOpenedAt ?? 0) - (a[1]?.lastOpenedAt ?? 0));
    const id = entries[0][0];
    return postIndex[id] ? id : null;
  }, [readingProgress, postIndex]);

  const navigate = useCallback((nextRoute) => {
    setRoute(nextRoute);
    saveJson(STORAGE_KEYS.lastRoute, nextRoute);
    setSidebarOpen(false);
  }, []);

  const handleQuizStateChange = useCallback((quizId, state) => {
    setQuizStateById((prev) => {
      const next = { ...(prev ?? {}), [quizId]: state };
      saveJson(STORAGE_KEYS.quizState, next);
      return next;
    });
  }, []);

  const handleReadingProgress = useCallback((postId, partial) => {
    setReadingProgress((prev) => {
      const prevPost = prev?.[postId] ?? { percent: 0, lastOpenedAt: 0 };
      const nextPost = {
        ...prevPost,
        ...partial,
        percent: clampPct(partial?.percent ?? prevPost.percent ?? 0),
      };
      const next = { ...(prev ?? {}), [postId]: nextPost };
      saveJson(STORAGE_KEYS.readingProgress, next);
      return next;
    });
  }, []);

  const handleSavePlayground = useCallback((next) => {
    setPlaygroundState(next);
    saveJson(STORAGE_KEYS.playground, next);
  }, []);

  const main = useMemo(() => {
    if (route.type === "playground") {
      return (
        <Playground storedPlayground={playgroundState} onSavePlayground={handleSavePlayground} />
      );
    }

    if (route.type === "post") {
      const post = postIndex[route.postId];
      if (!post) {
        return (
          <div className="sm-page">
            <div className="sm-card sm-card--pad">
              <div className="sm-card__title">Post not found</div>
              <div className="sm-muted">
                That post doesn’t exist. Pick a post from the sidebar.
              </div>
            </div>
          </div>
        );
      }

      return (
        <Post
          post={post}
          quizStateById={quizStateById}
          onQuizStateChange={handleQuizStateChange}
          onReadingProgress={handleReadingProgress}
        />
      );
    }

    return (
      <Home
        posts={posts}
        lastRead={lastReadPostId}
        onOpenPost={(postId) => navigate({ type: "post", postId })}
        onOpenPlayground={() => navigate({ type: "playground" })}
      />
    );
  }, [
    route,
    postIndex,
    quizStateById,
    handleQuizStateChange,
    handleReadingProgress,
    navigate,
    lastReadPostId,
    playgroundState,
    handleSavePlayground,
  ]);

  return (
    <div className="sm-app">
      <Header
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        isSidebarOpen={sidebarOpen}
      />

      <div className="sm-layout">
        <div
          className={`sm-sidebarWrap ${sidebarOpen ? "is-open" : ""}`}
          onClick={() => setSidebarOpen(false)}
          role="presentation"
        >
          <div
            className="sm-sidebarPanel"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <Sidebar
              posts={posts}
              currentRoute={route}
              onNavigate={navigate}
              readingProgress={readingProgress}
            />
          </div>
        </div>

        <main className="sm-main" aria-label="Main content">
          {main}
        </main>
      </div>
    </div>
  );
}

export default App;
