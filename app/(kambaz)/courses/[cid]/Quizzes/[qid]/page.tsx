"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Button } from "react-bootstrap";

export default function QuizDetailsPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { questions } = useSelector((state: RootState) => state.questionsReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const cidStr = Array.isArray(cid) ? cid[0] : cid;
  const qidStr = Array.isArray(qid) ? qid[0] : qid;

  const existingQuiz = useMemo(
    () => quizzes.find((q: any) => q._id === qidStr),
    [quizzes, qidStr],
  );
  const totalPoints = useMemo(
    () =>
      questions
        .filter((q: any) => q.quiz === qidStr)
        .reduce((sum: number, q: any) => sum + (q.points || 0), 0),
    [questions, qidStr],
  );

  const details = {
    title: existingQuiz?.title ?? "Unnamed Quiz",
    quizType: existingQuiz?.quizType ?? "Graded Quiz",
    assignmentGroup: existingQuiz?.assignmentGroup ?? "QUIZZES",
    shuffleAnswers: (existingQuiz?.shuffleAnswers ?? true) ? "Yes" : "No",
    timeLimit: existingQuiz?.timeLimit ?? 20,
    multipleAttempts: (existingQuiz?.multipleAttempts ?? false) ? "Yes" : "No",
    howManyAttempts: existingQuiz?.howManyAttempts ?? 1,
    showCorrectAnswers: existingQuiz?.showCorrectAnswers ?? "Immediately",
    accessCode: existingQuiz?.accessCode || "None",
    oneQuestionAtATime: (existingQuiz?.oneQuestionAtATime ?? true) ? "Yes" : "No",
    webcamRequired: (existingQuiz?.webcamRequired ?? false) ? "Yes" : "No",
    lockQuestionsAfterAnswering: (existingQuiz?.lockQuestionsAfterAnswering ?? false)
      ? "Yes"
      : "No",
    dueDate: existingQuiz?.dueDate || "—",
    availableFromDate: existingQuiz?.availableFromDate || "—",
    untilDate: existingQuiz?.untilDate || "—",
  };

  const isFaculty = currentUser?.role === "FACULTY";
  if (!isFaculty) {
    return (
      <div className="p-4">
        <h2 className="mb-3">{details.title}</h2>
        <Button id="wd-start-quiz-btn" variant="primary">
          Start Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4" id="wd-quiz-details">
      <div className="d-flex justify-content-center gap-2 mb-3">
        <Button variant="light" className="border" id="wd-preview-quiz-btn">
          Preview
        </Button>
        <Button
          variant="light"
          className="border"
          id="wd-edit-quiz-btn"
          onClick={() => router.push(`/courses/${cidStr}/Quizzes/${qidStr}/edit`)}
        >
          Edit
        </Button>
      </div>
      <div className="border p-4">
        <h2 className="mb-4">{details.title}</h2>
        <div className="row g-2">
          <div className="col-5 text-end fw-bold">Quiz Type</div>
          <div className="col-7">{details.quizType}</div>

          <div className="col-5 text-end fw-bold">Points</div>
          <div className="col-7">{totalPoints}</div>

          <div className="col-5 text-end fw-bold">Assignment Group</div>
          <div className="col-7">{details.assignmentGroup}</div>

          <div className="col-5 text-end fw-bold">Shuffle Answers</div>
          <div className="col-7">{details.shuffleAnswers}</div>

          <div className="col-5 text-end fw-bold">Time Limit</div>
          <div className="col-7">{details.timeLimit} Minutes</div>

          <div className="col-5 text-end fw-bold">Multiple Attempts</div>
          <div className="col-7">{details.multipleAttempts}</div>

          {details.multipleAttempts === "Yes" && (
            <>
              <div className="col-5 text-end fw-bold">How Many Attempts</div>
              <div className="col-7">{details.howManyAttempts}</div>
            </>
          )}

          <div className="col-5 text-end fw-bold">Show Correct Answers</div>
          <div className="col-7">{details.showCorrectAnswers}</div>

          <div className="col-5 text-end fw-bold">Access Code</div>
          <div className="col-7">{details.accessCode}</div>

          <div className="col-5 text-end fw-bold">One Question at a Time</div>
          <div className="col-7">{details.oneQuestionAtATime}</div>

          <div className="col-5 text-end fw-bold">Webcam Required</div>
          <div className="col-7">{details.webcamRequired}</div>

          <div className="col-5 text-end fw-bold">Lock Questions After Answering</div>
          <div className="col-7">{details.lockQuestionsAfterAnswering}</div>
        </div>

        <div className="row mt-5 border-top pt-3">
          <div className="col-3 fw-bold">Due</div>
          <div className="col-3 fw-bold">For</div>
          <div className="col-3 fw-bold">Available from</div>
          <div className="col-3 fw-bold">Until</div>
          <div className="col-3">{details.dueDate}</div>
          <div className="col-3">Everyone</div>
          <div className="col-3">{details.availableFromDate}</div>
          <div className="col-3">{details.untilDate}</div>
        </div>
      </div>
    </div>
  );
}
