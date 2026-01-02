const posts = [
  {
    id: "intro-select",
    title: "SQL Basics: SELECT, FROM, WHERE",
    description:
      "Learn how to retrieve data with SELECT, choose a table with FROM, and filter with WHERE.",
    featured: true,
    readingMinutes: 6,
    sections: [
      {
        type: "markdown",
        content: `## Why SQL?

SQL lets you **ask questions** of a dataset. You write a query and get back a result table.

You'll practice a minimal SQL subset in the Playground:
- \`SELECT <columns>\`
- \`FROM <dataset>\` (picked in the UI)
- \`WHERE <column> <operator> <value>\` (simple conditions)

> Tip: SQL is declarative — you describe *what you want*, not *how to compute it*.`,
      },
      {
        type: "code",
        language: "sql",
        content: `SELECT name, age
FROM people
WHERE age >= 21;`,
      },
      {
        type: "markdown",
        content: `### Common operators

- \`=\` equals
- \`!=\` not equals
- \`>\`, \`>=\`, \`<\`, \`<=\` comparisons
- String values are typically written in quotes: \`'Ada'\`

Now try a quick quiz.`,
      },
      {
        type: "quiz",
        quizId: "qz-intro-select-1",
        title: "Quick check: SELECT + WHERE",
        questions: [
          {
            id: "q1",
            prompt:
              "Which query selects only the `name` column from the `people` dataset?",
            options: [
              "SELECT people FROM name;",
              "SELECT name FROM people;",
              "SELECT name WHERE people;",
              "FROM people SELECT name;",
            ],
            answerIndex: 1,
            explanation:
              "SELECT chooses columns; FROM chooses the dataset/table.",
          },
          {
            id: "q2",
            prompt:
              "What does the WHERE clause do?",
            options: [
              "Renames columns",
              "Sorts rows",
              "Filters rows",
              "Limits columns",
            ],
            answerIndex: 2,
            explanation:
              "WHERE filters rows based on a condition.",
          },
        ],
      },
      {
        type: "markdown",
        content: `### Try it in Playground

Choose the **People** dataset and run:

\`\`\`sql
SELECT name, city
FROM people
WHERE city = 'London';
\`\`\`

If you get no rows, double-check spelling and quotes.`,
      },
    ],
  },
  {
    id: "joins-lite",
    title: "Thinking in Tables: Keys and Simple Joins (Conceptual)",
    description:
      "Learn how relational tables connect using keys, and practice filtering results across datasets conceptually.",
    featured: true,
    readingMinutes: 7,
    sections: [
      {
        type: "markdown",
        content: `## Keys connect tables

Relational data is split into multiple tables. A **primary key** uniquely identifies a row.

Example:
- \`customers(id, name)\`
- \`orders(id, customer_id, total)\`

\`orders.customer_id\` references \`customers.id\`.

In real SQL you'd use \`JOIN\`. Our playground focuses on SELECT + WHERE, but you can still learn the *idea*.

Let's warm up with filtering.`,
      },
      {
        type: "code",
        language: "sql",
        content: `SELECT id, total
FROM orders
WHERE total > 50;`,
      },
      {
        type: "markdown",
        content: `### Join intuition (no execution required)

A join answers: “combine rows from table A with matching rows from table B.”

\`\`\`sql
SELECT customers.name, orders.total
FROM customers
JOIN orders ON customers.id = orders.customer_id;
\`\`\`

Even if we don't execute JOINs here, knowing the mental model is important.`,
      },
      {
        type: "quiz",
        quizId: "qz-joins-lite-1",
        title: "Quick check: Keys & joins",
        questions: [
          {
            id: "q1",
            prompt:
              "In `orders(customer_id)`, what does `customer_id` usually represent?",
            options: [
              "A random number with no meaning",
              "A foreign key referencing `customers.id`",
              "A primary key for orders",
              "A string label for the customer",
            ],
            answerIndex: 1,
            explanation:
              "Foreign keys reference primary keys in another table.",
          },
          {
            id: "q2",
            prompt:
              "Why do we split data into multiple tables?",
            options: [
              "To duplicate data as much as possible",
              "To reduce redundancy and model relationships",
              "To avoid using WHERE clauses",
              "To make queries impossible",
            ],
            answerIndex: 1,
            explanation:
              "Normalization reduces duplication and captures relationships cleanly.",
          },
        ],
      },
      {
        type: "markdown",
        content: `### Practice prompt

Use the **Orders** dataset and find large orders:

\`\`\`sql
SELECT id, customer_id, total
FROM orders
WHERE total >= 100;
\`\`\`

Then open **Customers** and look up the customer names by id manually. This simulates the *purpose* of joins.`,
      },
    ],
  },
];

export default posts;
