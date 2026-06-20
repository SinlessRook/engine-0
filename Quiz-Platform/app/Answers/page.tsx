"use client";

import { useEffect, useState } from "react";
import styles from "./AnswerKey.module.css";
import type { AnswerKeyResponse, Question } from "./types";

type LoadState =
  | { status: "loading" }
  | { status: "locked"; message: string }
  | { status: "error"; message: string }
  | { status: "ready"; data: AnswerKeyResponse };

const TYPE_META: Record<Question["type"], { label: string; tab: string }> = {
  mcq: { label: "MCQ", tab: styles.tabMcq },
  msq: { label: "MSQ", tab: styles.tabMsq },
  short_answer: { label: "SHORT", tab: styles.tabShort },
  long_answer: { label: "LONG", tab: styles.tabLong },
  matching: { label: "MATCH", tab: styles.tabMatch },
  ordering: { label: "ORDER", tab: styles.tabOrder },
};

export default function AnswerKeyPage() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/answers", { cache: "no-store" })
        const body = await res.json();

        if (cancelled) return;

        if (res.status === 423) {
          setState({ status: "locked", message: body.error });
          return;
        }

        if (!res.ok) {
          setState({
            status: "error",
            message: body.error ?? "Something went wrong.",
          });
          return;
        }

        setState({ status: "ready", data: body as AnswerKeyResponse });
      } catch {
        if (!cancelled) {
          setState({ status: "error", message: "Could not reach the server." });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <main className={styles.page}>
        <div className={styles.statusCard}>
          <span className={styles.stampMono}>LOADING…</span>
        </div>
      </main>
    );
  }

  if (state.status === "locked") {
    return (
      <main className={styles.page}>
        <div className={`${styles.statusCard} ${styles.sealed}`}>
          <div className={styles.seal}>NOT YET GRADED</div>
          <p className={styles.statusText}>{state.message}</p>
        </div>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className={styles.page}>
        <div className={`${styles.statusCard} ${styles.errorCard}`}>
          <div className={styles.seal}>ERROR</div>
          <p className={styles.statusText}>{state.message}</p>
        </div>
      </main>
    );
  }

  const { data } = state;
  const question = data.questions[currentQuestion];

  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <div className={styles.mastheadTop}>
          <h1 className={styles.title}>Answer Key</h1>
          <span className={styles.verified}>VERIFIED</span>
        </div>
        {data.topic && <p className={styles.topicLine}>{data.topic}</p>}
        {data.file_used.length > 0 && (
          <div className={styles.fileBadges}>
            {data.file_used.map((f) => (
              <span key={f} className={styles.fileBadge}>
                {f}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className={styles.questionTabs}>
  {data.questions.map((_, i) => (
    <button
      key={i}
      onClick={() => setCurrentQuestion(i)}
      className={
        i === currentQuestion
          ? styles.activeQuestionTab
          : styles.questionTab
      }
    >
      {i + 1}
    </button>
  ))}
</div>

<div className={styles.questionContainer}>
  <QuestionCard question={question} />

  <div className={styles.navigation}>
    <button
      className={styles.navButton}
      disabled={currentQuestion === 0}
      onClick={() =>
        setCurrentQuestion((prev) => Math.max(prev - 1, 0))
      }
    >
      ← Previous
    </button>

    <span className={styles.questionCounter}>
      Question {currentQuestion + 1} of {data.questions.length}
    </span>

    <button
      className={styles.navButton}
      disabled={currentQuestion === data.questions.length - 1}
      onClick={() =>
        setCurrentQuestion((prev) =>
          Math.min(prev + 1, data.questions.length - 1)
        )
      }
    >
      Next →
    </button>
  </div>
</div>
    </main>
  );
}

function QuestionCard({ question }: { question: Question }) {
  const meta = TYPE_META[question.type];

  return (
    <article className={`${styles.card} ${meta.tab}`}>
      <div className={styles.cardHead}>
        <span className={styles.qid}>
          Q{String(question.id).padStart(2, "0")}
        </span>
        <span className={styles.typeBadge}>{meta.label}</span>
      </div>

      <p className={styles.questionText}>{question.questionText}</p>

      <AnswerBody question={question} />

      <p className={styles.explanation}>
        <span className={styles.explanationLabel}>Why:</span>{" "}
        {question.explanation}
      </p>
    </article>
  );
}

function AnswerBody({ question }: { question: Question }) {
  switch (question.type) {
    case "mcq":
      return (
        <ul className={styles.optionList}>
          {question.options.map((opt) => {
            const correct = opt === question.correctOption;
            return (
              <li
                key={opt}
                className={correct ? styles.optionCorrect : styles.option}
              >
                <span className={styles.optionMark}>
                  {correct ? "●" : "○"}
                </span>
                {opt}
              </li>
            );
          })}
        </ul>
      );

    case "msq":
      return (
        <ul className={styles.optionList}>
          {question.options.map((opt) => {
            const correct = question.correctAnswers.includes(opt);
            return (
              <li
                key={opt}
                className={correct ? styles.optionCorrect : styles.option}
              >
                <span className={styles.optionMark}>
                  {correct ? "☑" : "☐"}
                </span>
                {opt}
              </li>
            );
          })}
        </ul>
      );

    case "short_answer":
      return (
        <p className={styles.keyword}>
          <span className={styles.keywordLabel}>Answer:</span>{" "}
          <code className={styles.code}>{question.correct_keyword}</code>
        </p>
      );

    case "long_answer":
      return (
        <p className={styles.rubric}>
          <span className={styles.keywordLabel}>Rubric:</span>{" "}
          {question.evaluation_rubric}
        </p>
      );

    case "matching":
      return (
        <ul className={styles.matchList}>
          {question.left_pairs.map((left) => (
            <li key={left} className={styles.matchRow}>
              <span className={styles.matchLeft}>{left}</span>
              <span className={styles.matchArrow} aria-hidden="true">
                →
              </span>
              <span className={styles.matchRight}>
                {question.correct_mapping[left]}
              </span>
            </li>
          ))}
        </ul>
      );

    case "ordering":
      return (
        <ol className={styles.orderList}>
          {question.correct_sequence.map((step, i) => (
            <li key={step} className={styles.orderRow}>
              <span className={styles.orderIndex}>{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      );

    default:
      return null;
  }
}