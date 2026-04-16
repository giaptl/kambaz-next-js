"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { Button, FormControl } from "react-bootstrap";

type AnswerMap = Record<string, string | number>;

export default function QuizPreviewPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { questions } = useSelector((state: RootState) => state.questionsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const cidStr = Array.isArray(cid) ? cid[0] : cid;
  const qidStr = Array.isArray(qid) ? qid[0] : qid;

  const quiz = useMemo(
    () => quizzes.find((q: any) => q._id === qidStr),
    [quizzes, qidStr],
  );
  const quizQuestions = useMemo(
    () => questions.filter((q: any) => q.quiz === qidStr),
    [questions, qidStr],
  );

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);

  const totalPoints = useMemo(
    () => quizQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0),
    [quizQuestions],
  );
  const isFaculty = currentUser?.role === "FACULTY";
  const maxAttempts = quiz?.multipleAttempts ? quiz?.howManyAttempts || 1 : 1;

  useEffect(() => {
    if (!currentUser?._id || !qidStr || isFaculty) return;
    const key = `quiz-attempts-${currentUser._id}-${qidStr}`;
    const stored = localStorage.getItem(key);
    setAttemptsUsed(stored ? parseInt(stored, 10) || 0 : 0);
  }, [currentUser?._id, qidStr, isFaculty]);

  const isCorrect = (q: any) => {
    const selected = answers[q._id];
    if (q.type === "multiple_choice") {
      return Number(selected) === Number(q.correctAnswer);
    }
    if (q.type === "true_false") {
      return String(selected) === String(q.correctAnswer);
    }
    if (q.type === "fill_in_blank") {
      const userAnswer = String(selected || "").trim().toLowerCase();
      const possible = (q.answers || []).map((a: string) =>
        a.trim().toLowerCase(),
      );
      return possible.includes(userAnswer);
    }
    return false;
  };

  const score = useMemo(() => {
    if (!submitted) return 0;
    return quizQuestions.reduce((sum: number, q: any) => {
      return sum + (isCorrect(q) ? q.points || 0 : 0);
    }, 0);
  }, [submitted, quizQuestions, answers]);
  const attemptsRemaining = Math.max(0, maxAttempts - attemptsUsed);
  const canStartAttempt = isFaculty || attemptsRemaining > 0;
  const canRetakeAfterSubmit = isFaculty || attemptsRemaining > 0;

  const submitQuiz = () => {
    if (!canStartAttempt) return;
    if (!isFaculty && currentUser?._id && qidStr) {
      const nextAttempts = attemptsUsed + 1;
      const key = `quiz-attempts-${currentUser._id}-${qidStr}`;
      localStorage.setItem(key, String(nextAttempts));
      setAttemptsUsed(nextAttempts);
    }
    setSubmitted(true);
  };

  return (
    <div className="p-4" id="wd-quiz-preview">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">{quiz?.title || "Quiz Preview"}</h3>
        <div className="d-flex gap-2">
          {currentUser?.role === "FACULTY" && (
            <Button
              variant="secondary"
              onClick={() => router.push(`/courses/${cidStr}/Quizzes/${qidStr}/edit`)}
              id="wd-edit-quiz-from-preview-btn"
            >
              Edit Quiz
            </Button>
          )}
          <Button
            variant="outline-secondary"
            onClick={() => router.push(`/courses/${cidStr}/Quizzes/${qidStr}`)}
          >
            Back
          </Button>
        </div>
      </div>

      {!submitted && (
        <p className="text-muted">
          Preview mode. Answers are not saved to the database.
        </p>
      )}
      {!isFaculty && (
        <p className="text-muted">
          Attempts used: {attemptsUsed} / {maxAttempts}
        </p>
      )}
      {!canStartAttempt && (
        <div className="alert alert-warning">
          You have used all attempts for this quiz. Retakes are not allowed.
        </div>
      )}

      {submitted && (
        <div className="alert alert-info">
          Score: <b>{score}</b> / <b>{totalPoints}</b>
        </div>
      )}

      {quizQuestions.map((q: any, idx: number) => (
        <div key={q._id} className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between">
            <h5 className="mb-2">
              Q{idx + 1}. {q.title || "Untitled Question"}
            </h5>
            <span>{q.points || 0} pts</span>
          </div>
          <div className="mb-3">{q.question}</div>

          {q.type === "multiple_choice" &&
            (q.choices || []).map((choice: string, cIdx: number) => (
              <div key={cIdx} className="form-check mb-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`mc-${q._id}`}
                  checked={Number(answers[q._id]) === cIdx}
                  disabled={submitted || !canStartAttempt}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [q._id]: cIdx }))
                  }
                  id={`mc-${q._id}-${cIdx}`}
                />
                <label className="form-check-label" htmlFor={`mc-${q._id}-${cIdx}`}>
                  {choice}
                </label>
              </div>
            ))}

          {q.type === "true_false" && (
            <div className="d-flex gap-4">
              {["True", "False"].map((opt) => (
                <div key={opt} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`tf-${q._id}`}
                    checked={answers[q._id] === opt}
                    disabled={submitted || !canStartAttempt}
                    onChange={() =>
                      setAnswers((prev) => ({ ...prev, [q._id]: opt }))
                    }
                    id={`tf-${q._id}-${opt}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`tf-${q._id}-${opt}`}
                  >
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          )}

          {q.type === "fill_in_blank" && (
            <FormControl
              placeholder="Type your answer"
              value={String(answers[q._id] || "")}
              disabled={submitted || !canStartAttempt}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q._id]: e.target.value }))
              }
            />
          )}

          {submitted && !isCorrect(q) && (
            <div className="mt-3 text-danger">
              Incorrect. Correct answer:{" "}
              {q.type === "multiple_choice"
                ? q.choices?.[q.correctAnswer] ?? "N/A"
                : q.type === "true_false"
                  ? q.correctAnswer
                  : (q.answers || []).join(" / ")}
            </div>
          )}
        </div>
      ))}

      <div className="d-flex justify-content-end gap-2">
        {!submitted ? (
          <Button
            id="wd-submit-quiz-preview-btn"
            onClick={submitQuiz}
            disabled={!canStartAttempt}
          >
            Submit Quiz
          </Button>
        ) : (
          canRetakeAfterSubmit && (
            <Button
              variant="secondary"
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
              }}
            >
              {isFaculty ? "Retake Preview" : "Retake"}
            </Button>
          )
        )}
      </div>
    </div>
  );
}

