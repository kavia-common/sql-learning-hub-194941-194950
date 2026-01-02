import React from "react";

function renderInline(text) {
  // Inline code: `code`
  const parts = [];
  let rest = text;

  while (rest.includes("`")) {
    const start = rest.indexOf("`");
    const end = rest.indexOf("`", start + 1);
    if (end === -1) break;

    const before = rest.slice(0, start);
    const code = rest.slice(start + 1, end);
    if (before) parts.push(before);
    parts.push(<code key={`code-${parts.length}`} className="sm-inlineCode">{code}</code>);
    rest = rest.slice(end + 1);
  }
  if (rest) parts.push(rest);

  // Bold: **text**
  // Do a minimal pass only when string-only parts exist.
  return parts.map((p, idx) => {
    if (typeof p !== "string") return p;
    const segs = [];
    let r = p;
    while (r.includes("**")) {
      const s = r.indexOf("**");
      const e = r.indexOf("**", s + 2);
      if (e === -1) break;
      const before = r.slice(0, s);
      const bold = r.slice(s + 2, e);
      if (before) segs.push(before);
      segs.push(<strong key={`b-${idx}-${segs.length}`}>{bold}</strong>);
      r = r.slice(e + 2);
    }
    if (r) segs.push(r);
    return <React.Fragment key={`t-${idx}`}>{segs}</React.Fragment>;
  });
}

// PUBLIC_INTERFACE
export default function Markdown({ content }) {
  /** Render minimal markdown to React elements (headings, paragraphs, blockquotes). */
  const lines = content.split("\n");
  const blocks = [];
  let currentPara = [];

  function flushPara() {
    if (!currentPara.length) return;
    const text = currentPara.join(" ").trim();
    if (text) blocks.push({ type: "p", text });
    currentPara = [];
  }

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flushPara();
      continue;
    }

    // Headings
    if (t.startsWith("### ")) {
      flushPara();
      blocks.push({ type: "h3", text: t.slice(4) });
      continue;
    }
    if (t.startsWith("## ")) {
      flushPara();
      blocks.push({ type: "h2", text: t.slice(3) });
      continue;
    }

    // Blockquote
    if (t.startsWith("> ")) {
      flushPara();
      blocks.push({ type: "quote", text: t.slice(2) });
      continue;
    }

    currentPara.push(t);
  }
  flushPara();

  return (
    <div className="sm-markdown">
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i}>{renderInline(b.text)}</h2>;
        if (b.type === "h3") return <h3 key={i}>{renderInline(b.text)}</h3>;
        if (b.type === "quote")
          return (
            <blockquote key={i} className="sm-quote">
              {renderInline(b.text)}
            </blockquote>
          );
        return <p key={i}>{renderInline(b.text)}</p>;
      })}
    </div>
  );
}
