import React from "react";

// PUBLIC_INTERFACE
export default function CodeBlock({ language = "text", code }) {
  /** Render a formatted code block. */
  return (
    <div className="sm-code">
      <div className="sm-code__label">{language.toUpperCase()}</div>
      <pre className="sm-code__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
