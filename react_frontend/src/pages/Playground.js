import React, { useMemo, useState } from "react";
import datasets from "../content/datasets";
import { evaluateSql } from "../utils/sqlEngine";

function parseCsv(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row = {};
    headers.forEach((h, i) => {
      const raw = values[i] ?? "";
      // Light coercion: numbers => Number, otherwise string (strip surrounding quotes)
      const s = raw.replace(/^'(.*)'$/, "$1").replace(/^"(.*)"$/, "$1");
      const num = Number(s);
      row[h] = Number.isFinite(num) && String(num) === s ? num : s;
    });
    return row;
  });
}

function safeParseDataset(text, mode) {
  if (!text.trim()) return [];
  if (mode === "json") {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      throw new Error("Dataset JSON must be an array of objects.");
    }
    return parsed;
  }
  return parseCsv(text);
}

// PUBLIC_INTERFACE
export default function Playground({
  storedPlayground,
  onSavePlayground,
}) {
  /** SQL practice playground with minimal client-side evaluation. */
  const examples = useMemo(() => datasets, []);
  const defaultDatasetId = storedPlayground?.datasetId ?? examples[0].id;

  const [datasetId, setDatasetId] = useState(defaultDatasetId);
  const [datasetMode, setDatasetMode] = useState(storedPlayground?.mode ?? "json");

  const initialRows = useMemo(() => {
    const preset = examples.find((d) => d.id === defaultDatasetId) ?? examples[0];
    return preset.rows;
  }, [defaultDatasetId, examples]);

  const [datasetText, setDatasetText] = useState(
    storedPlayground?.datasetText ??
      JSON.stringify(initialRows, null, 2)
  );

  const [query, setQuery] = useState(
    storedPlayground?.query ??
      "SELECT * FROM dataset WHERE 1 = 1;"
  );

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function persist(nextPartial) {
    const next = {
      datasetId,
      mode: datasetMode,
      datasetText,
      query,
      ...nextPartial,
    };
    onSavePlayground?.(next);
  }

  function handleChooseDataset(nextId) {
    const preset = examples.find((d) => d.id === nextId) ?? examples[0];
    setDatasetId(nextId);
    setDatasetText(JSON.stringify(preset.rows, null, 2));
    setResult(null);
    setError(null);
    persist({ datasetId: nextId, datasetText: JSON.stringify(preset.rows, null, 2) });
  }

  function handleRun() {
    setError(null);
    setResult(null);

    let rows;
    try {
      rows = safeParseDataset(datasetText, datasetMode);
    } catch (e) {
      setError(e.message || "Invalid dataset format.");
      return;
    }

    try {
      const r = evaluateSql(query, rows);
      setResult(r);
      persist({});
    } catch (e) {
      setError(e.message || "Query failed.");
    }
  }

  function handleReset() {
    const preset = examples.find((d) => d.id === datasetId) ?? examples[0];
    const presetText = JSON.stringify(preset.rows, null, 2);
    setDatasetMode("json");
    setDatasetText(presetText);
    setQuery("SELECT * FROM dataset WHERE 1 = 1;");
    setResult(null);
    setError(null);
    onSavePlayground?.({
      datasetId,
      mode: "json",
      datasetText: presetText,
      query: "SELECT * FROM dataset WHERE 1 = 1;",
    });
  }

  const selected = examples.find((d) => d.id === datasetId) ?? examples[0];

  return (
    <div className="sm-page">
      <header className="sm-postHeader">
        <div>
          <h1 className="sm-postHeader__title">SQL Playground</h1>
          <div className="sm-postHeader__meta">
            Runs entirely in your browser. Supported: SELECT + WHERE (simple).
          </div>
        </div>

        <div className="sm-row">
          <button className="sm-btn sm-btn--secondary" onClick={handleReset}>
            Reset
          </button>
          <button className="sm-btn sm-btn--primary" onClick={handleRun}>
            Run query
          </button>
        </div>
      </header>

      <div className="sm-split">
        <section className="sm-card sm-card--pad">
          <div className="sm-card__title">Dataset</div>

          <div className="sm-row sm-row--wrap">
            <label className="sm-field">
              <span className="sm-label">Example</span>
              <select
                className="sm-select"
                value={datasetId}
                onChange={(e) => handleChooseDataset(e.target.value)}
              >
                {examples.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="sm-field">
              <span className="sm-label">Format</span>
              <select
                className="sm-select"
                value={datasetMode}
                onChange={(e) => {
                  setDatasetMode(e.target.value);
                  persist({ mode: e.target.value });
                }}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </label>
          </div>

          <div className="sm-muted">{selected.description}</div>

          <textarea
            className="sm-textarea"
            value={datasetText}
            onChange={(e) => {
              setDatasetText(e.target.value);
              persist({ datasetText: e.target.value });
            }}
            spellCheck={false}
            rows={12}
            aria-label="Dataset input"
          />
          <div className="sm-hint">
            JSON: array of objects. CSV: first line headers.
          </div>
        </section>

        <section className="sm-card sm-card--pad">
          <div className="sm-card__title">Query</div>
          <textarea
            className="sm-textarea sm-textarea--mono"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              persist({ query: e.target.value });
            }}
            spellCheck={false}
            rows={8}
            aria-label="SQL query input"
          />

          {error ? <div className="sm-alert sm-alert--error">{error}</div> : null}

          {result ? (
            <div className="sm-result">
              <div className="sm-result__meta">
                Output rows: <strong>{result.meta?.outputRows ?? result.rows.length}</strong>
              </div>
              <div className="sm-tableWrap">
                <table className="sm-table">
                  <thead>
                    <tr>
                      {result.columns.map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i}>
                        {result.columns.map((c) => (
                          <td key={`${i}-${c}`}>{String(row[c] ?? "")}</td>
                        ))}
                      </tr>
                    ))}
                    {result.rows.length === 0 ? (
                      <tr>
                        <td colSpan={result.columns.length} className="sm-muted">
                          No rows matched.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="sm-muted">
              Run a query to see results.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
