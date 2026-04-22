"use client";

import { useDispatch } from "react-redux";
import { setQuestions } from "../../questionsReducer";
import * as client from "../../../../client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { Button, FormControl } from "react-bootstrap";

type AnswerMap = Record<string, string | number>;

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER || "";

export default function QuizPreviewPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { questions } = useSelector(
    (state: RootState) => state.questionsReducer,
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const cidStr = Array.isArray(cid) ? cid[0] : cid;
  const qidStr = Array.isArray(qid) ? qid[0] : qid;

  const dispatch = useDispatch();

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
  const [currentIdx, setCurrentIdx] = useState(0);

  const totalPoints = useMemo(
    () =>
      quizQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0),
    [quizQuestions],
  );

  const isFaculty = currentUser?.role === "FACULTY";
  const maxAttempts = quiz?.multipleAttempts ? quiz?.howManyAttempts || 1 : 1;

  useEffect(() => {
    if (!currentUser?._id || !qidStr || isFaculty) return;

    fetch(`${HTTP_SERVER}/api/attempts/${qidStr}/${currentUser._id}/count`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => setAttemptsUsed(data.count || 0))
      .catch(() => setAttemptsUsed(0));

    fetch(`${HTTP_SERVER}/api/attempts/${qidStr}/${currentUser._id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.answers) {
          setAnswers(data.answers);
          setSubmitted(true);
        }
      })
      .catch(() => {});
  }, [currentUser?._id, qidStr, isFaculty]);

  useEffect(() => {
    if (!qidStr) return;
    client
      .findQuestionsForQuiz(qidStr)
      .then((data) => dispatch(setQuestions(data)))
      .catch(console.error);
  }, [qidStr]);

  const isCorrect = (q: any) => {
    const selected = answers[q._id];
    if (q.type === "multiple_choice") {
      return Number(selected) === Number(q.correctAnswer);
    }
    if (q.type === "true_false") {
      return String(selected) === String(q.correctAnswer);
    }
    if (q.type === "fill_in_blank") {
      const userAnswer = String(selected || "")
        .trim()
        .toLowerCase();
      const possible = (q.answers || []).map((a: string) =>
        a.trim().toLowerCase(),
      );
      return possible.includes(userAnswer);
    }
    return false;
  };

  const score = useMemo(() => {
    return quizQuestions.reduce((sum: number, q: any) => {
      return sum + (isCorrect(q) ? q.points || 0 : 0);
    }, 0);
  }, [quizQuestions, answers]);

  const attemptsRemaining = Math.max(0, maxAttempts - attemptsUsed);
  const canStartAttempt = isFaculty || attemptsRemaining > 0;
  const canRetakeAfterSubmit = isFaculty || attemptsRemaining > 0;

  const submitQuiz = async () => {
    if (!canStartAttempt) return;
    const nextAttempts = attemptsUsed + 1;

    if (!isFaculty && currentUser?._id && qidStr) {
      await fetch(`${HTTP_SERVER}/api/attempts`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz: qidStr,
          user: currentUser._id,
          answers,
          score,
          totalPoints,
          attemptNumber: nextAttempts,
        }),
      }).catch(console.error);
      setAttemptsUsed(nextAttempts);
    }
    setSubmitted(true);
  };

  const currentQuestion = quizQuestions[currentIdx];

  const renderQuestion = (q: any, idx: number) => (
    <div
      className={`border rounded p-3 mb-3 ${
        submitted ? (isCorrect(q) ? "border-success" : "border-danger") : ""
      }`}
    >
      <div className="d-flex justify-content-between">
        <h5 className="mb-2">
          Q{idx + 1}. {q.title || "Untitled Question"}
        </h5>
        <span>{q.points || 0} pt{(q.points || 0) !== 1 ? "s" : ""}</span>
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
            <label
              className="form-check-label"
              htmlFor={`mc-${q._id}-${cIdx}`}
            >
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

      {submitted && (
        <div
          className={`mt-3 ${isCorrect(q) ? "text-success" : "text-danger"}`}
        >
          {isCorrect(q) ? (
            "✓ Correct!"
          ) : (
            <>
              ✗ Incorrect. Correct answer:{" "}
              {q.type === "multiple_choice"
                ? (q.choices?.[q.correctAnswer] ?? "N/A")
                : q.type === "true_false"
                  ? q.correctAnswer
                  : (q.answers || []).join(" / ")}
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4" id="wd-quiz-preview">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">{quiz?.title || "Quiz Preview"}</h3>
        <div className="d-flex gap-2">
          {currentUser?.role === "FACULTY" && (
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/courses/${cidStr}/Quizzes/${qidStr}/edit`)
              }
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

      {!submitted && isFaculty && (
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

      {quizQuestions.length > 0 && (
        <div className="row">
          {/* current question */}
          <div className="col-md-9">
            {currentQuestion && renderQuestion(currentQuestion, currentIdx)}

            <div className="d-flex justify-content-between mt-2">
              <Button
                variant="outline-secondary"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
              >
                ← Previous
              </Button>
              <Button
                variant="outline-secondary"
                disabled={currentIdx === quizQuestions.length - 1}
                onClick={() => setCurrentIdx(currentIdx + 1)}
              >
                Next →
              </Button>
            </div>
          </div>

          {/* question list sidebar for jumping */}
          <div className="col-md-3">
            <div className="border rounded p-3">
              <h6 className="mb-2">Questions</h6>
              <div className="d-flex flex-column gap-1">
                {quizQuestions.map((q: any, idx: number) => {
                  const answered = answers[q._id] !== undefined;
                  let variant = "outline-secondary";
                  if (idx === currentIdx) variant = "primary";
                  else if (submitted && isCorrect(q)) variant = "success";
                  else if (submitted && !isCorrect(q)) variant = "danger";
                  else if (answered) variant = "outline-primary";

                  return (
                    <Button
                      key={q._id}
                      size="sm"
                      variant={variant}
                      onClick={() => setCurrentIdx(idx)}
                    >
                      Question {idx + 1}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end gap-2 mt-3">
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
                setCurrentIdx(0);
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
