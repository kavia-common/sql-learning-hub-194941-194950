import React, { useMemo, useState } from "react";

function defaultState(quiz) {
  return {
    answers: {}, // questionId -> selectedIndex
    correct: {}, // questionId -> boolean
    completed: false,
  };
}

// PUBLIC_INTERFACE
export default function Quiz({ quizId, title, questions, storedState, onChange }) {
  /** MCQ quiz with immediate feedback; emits changes for persistence. */
  const quiz = useMemo(() => ({ quizId, title, questions }), [quizId, title, questions]);
  const [state, setState] = useState(storedState ?? defaultState(quiz));

  const total = questions.length;
  const correctCount = Object.values(state.correct).filter(Boolean).length;

  function update(next) {
    setState(next);
    onChange?.(next);
  }

  function handleAnswer(question, optionIndex) {
    const isCorrect = optionIndex === question.answerIndex;
    const next = {
      ...state,
      answers: { ...state.answers, [question.id]: optionIndex },
      correct: { ...state.correct, [question.id]: isCorrect },
    };

    const answeredCount = Object.keys(next.answers).length;
    if (answeredCount === total) next.completed = true;

    update(next);
  }

  return (
    <section className="sm-quiz" aria-label={title}>
      <div className="sm-quiz__header">
        <div>
          <div className="sm-quiz__title">{title}</div>
          <div className="sm-quiz__meta">
            Score: <strong>{correctCount}</strong> / {total}
          </div>
        </div>

        {state.completed ? (
          <div className="sm-badge sm-badge--success">Completed</div>
        ) : (
          <div className="sm-badge">In progress</div>
        )}
      </div>

      <div className="sm-quiz__questions">
        {questions.map((q, idx) => {
          const selected = state.answers[q.id];
          const correctness = state.correct[q.id];

          return (
            <div key={q.id} className="sm-question">
              <div className="sm-question__prompt">
                <span className="sm-question__index">{idx + 1}.</span> {q.prompt}
              </div>

              <div className="sm-options" role="radiogroup" aria-label={q.prompt}>
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const showCorrectness = selected !== undefined;

                  const className = [
                    "sm-option",
                    isSelected ? "is-selected" : "",
                    showCorrectness && oi === q.answerIndex ? "is-correct" : "",
                    showCorrectness && isSelected && !correctness
                      ? "is-wrong"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      key={opt}
                      type="button"
                      className={className}
                      onClick={() => handleAnswer(q, oi)}
                      aria-pressed={isSelected}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selected !== undefined ? (
                <div
                  className={`sm-explain ${
                    correctness ? "is-correct" : "is-wrong"
                  }`}
                >
                  <div className="sm-explain__headline">
                    {correctness ? "Correct" : "Not quite"}
                  </div>
                  <div className="sm-explain__text">{q.explanation}</div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
