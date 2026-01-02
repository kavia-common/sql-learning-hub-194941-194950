/**
 * Minimal client-side SQL evaluator.
 *
 * Supported grammar (case-insensitive, whitespace-tolerant):
 *   SELECT <cols|*> FROM <ignored> [WHERE <col> <op> <value>]
 *
 * Notes:
 * - The "FROM <name>" portion is parsed but not used to select a dataset; the UI selects dataset.
 * - WHERE supports one condition only (no AND/OR) to keep it intentionally minimal.
 * - Values can be:
 *    - numbers: 12, 3.14
 *    - strings in single quotes: 'London'
 */

const OPS = ["<=", ">=", "!=", "=", "<", ">"];

function trimSemi(s) {
  return s.replace(/;\s*$/, "").trim();
}

function isNumericString(s) {
  return /^-?\d+(\.\d+)?$/.test(s);
}

function parseValue(raw) {
  const t = raw.trim();
  if (t.startsWith("'") && t.endsWith("'") && t.length >= 2) {
    return { type: "string", value: t.slice(1, -1) };
  }
  if (isNumericString(t)) {
    return { type: "number", value: Number(t) };
  }
  // allow barewords (treated as string) to be forgiving in beginner mode
  return { type: "string", value: t };
}

function compare(lhs, op, rhs) {
  switch (op) {
    case "=":
      return lhs === rhs;
    case "!=":
      return lhs !== rhs;
    case ">":
      return lhs > rhs;
    case ">=":
      return lhs >= rhs;
    case "<":
      return lhs < rhs;
    case "<=":
      return lhs <= rhs;
    default:
      return false;
  }
}

function coerceForComparison(a, b) {
  // If both look numeric, compare as numbers. Otherwise compare as strings.
  const aIsNum = typeof a === "number" || isNumericString(String(a));
  const bIsNum = typeof b === "number" || isNumericString(String(b));
  if (aIsNum && bIsNum) return [Number(a), Number(b)];
  return [String(a), String(b)];
}

/**
 * @typedef {{ columns: string[], rows: Record<string, any>[], meta?: Record<string, any> }} SqlResult
 */

// PUBLIC_INTERFACE
export function evaluateSql(query, datasetRows) {
  /** Evaluate minimal SQL against an array of objects. Throws Error on invalid syntax. */
  if (!query || !query.trim()) {
    throw new Error("Enter a SQL query to run.");
  }

  const q = trimSemi(query);
  const normalized = q.replace(/\s+/g, " ").trim();

  // Basic SELECT ... FROM ... [WHERE ...]
  const match = normalized.match(/^select (.+) from (.+?)( where (.+))?$/i);
  if (!match) {
    throw new Error(
      "Unsupported query. Try: SELECT <cols|*> FROM <dataset> [WHERE col op value]"
    );
  }

  const colsPart = match[1].trim();
  const fromPart = match[2].trim(); // parsed for user feedback
  const wherePart = match[4] ? match[4].trim() : null;

  const availableColumns = datasetRows.length ? Object.keys(datasetRows[0]) : [];
  const selectAll = colsPart === "*";

  const selectedColumns = selectAll
    ? availableColumns
    : colsPart.split(",").map((c) => c.trim()).filter(Boolean);

  if (!selectedColumns.length) {
    throw new Error("No columns selected.");
  }

  // Validate selected columns
  const invalidCols = selectedColumns.filter(
    (c) => !availableColumns.includes(c)
  );
  if (datasetRows.length && invalidCols.length) {
    throw new Error(
      `Unknown column(s): ${invalidCols.join(
        ", "
      )}. Available: ${availableColumns.join(", ")}`
    );
  }

  let filtered = datasetRows;

  if (wherePart) {
    // find operator occurrence
    let opFound = null;
    let opIndex = -1;
    for (const op of OPS) {
      const idx = wherePart.indexOf(op);
      if (idx > -1) {
        opFound = op;
        opIndex = idx;
        break;
      }
    }
    if (!opFound) {
      throw new Error(
        "Unsupported WHERE clause. Use: WHERE column = 123 or WHERE city = 'London'"
      );
    }

    const left = wherePart.slice(0, opIndex).trim();
    const right = wherePart.slice(opIndex + opFound.length).trim();
    if (!left || !right) {
      throw new Error("Invalid WHERE clause. Use: WHERE column op value");
    }

    if (datasetRows.length && !availableColumns.includes(left)) {
      throw new Error(
        `Unknown WHERE column '${left}'. Available: ${availableColumns.join(", ")}`
      );
    }

    const parsedValue = parseValue(right);

    filtered = datasetRows.filter((row) => {
      const lhsRaw = row[left];

      const [lhs, rhs] =
        parsedValue.type === "number"
          ? [Number(lhsRaw), parsedValue.value]
          : coerceForComparison(lhsRaw, parsedValue.value);

      return compare(lhs, opFound, rhs);
    });
  }

  const projected = filtered.map((row) => {
    const out = {};
    for (const c of selectedColumns) out[c] = row[c];
    return out;
  });

  return {
    columns: selectedColumns,
    rows: projected,
    meta: {
      from: fromPart,
      inputRows: datasetRows.length,
      outputRows: projected.length,
    },
  };
}
