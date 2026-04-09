"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { updateQuiz } from "../reducer";
import {Button, Form, FormCheck, FormControl, FormLabel, FormSelect, Row, Col} from "react-bootstrap";
import QuizQuestionsEditor from "../QuizQuestionsEditor";

export default function QuizDetailsPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const cidStr = Array.isArray(cid) ? cid[0] : cid;
  const qidStr = Array.isArray(qid) ? qid[0] : qid;

  const existingQuiz = useMemo(
    () => quizzes.find((q: any) => q._id === qidStr),
    [quizzes, qidStr]
  );

  const defaultSettings = useMemo(
    () => ({
      quizType: "Graded Quiz",
      points: existingQuiz?.points ?? 0, // quiz.points
      assignmentGroup: "Quizzes",
      shuffleAnswers: true,
      timeLimit: 20,
      multipleAttempts: false,
      howManyAttempts: 1,
      showCorrectAnswers: "Immediately",
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      dueDate: "",
      availableFromDate: "",
      untilDate: "",
    }),
    [existingQuiz?.points]
  );

  const [quizSettings, setQuizSettings] = useState<any>(defaultSettings);
  const [activeTab, setActiveTab] = useState<"details" | "questions">("details");

  useEffect(() => {
    if (existingQuiz) {
      setQuizSettings({
        ...defaultSettings,
        ...existingQuiz,
        dueDate: existingQuiz.dueDate ?? "",
        availableFromDate: existingQuiz.availableFromDate ?? "",
        untilDate: existingQuiz.untilDate ?? "",
      });
    } else {
      setQuizSettings(defaultSettings);
    }
  }, [existingQuiz, defaultSettings]);

  const isFaculty = currentUser?.role === "FACULTY";

  const handleCancel = () => {
    if (!cidStr) return;
    router.push(`/courses/${cidStr}/Quizzes`);
  };

  const handleSave = () => {
    if (!existingQuiz) return;
    dispatch(updateQuiz({ ...quizSettings }));
    if (cidStr) router.push(`/courses/${cidStr}/Quizzes`);
  };

  if (!isFaculty) {
    return (
      <div className="p-4">
        <h2 className="mb-3">Quiz Details</h2>
        <Button id="wd-start-quiz-btn" variant="primary">
          Start Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4" id="wd-quiz-details-editor">
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </button>
        </li>
      </ul>
      {activeTab === "details" && (
      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <FormLabel>Quiz Type</FormLabel>
            <FormSelect
              value={quizSettings.quizType}
              onChange={(e) =>
                setQuizSettings({ ...quizSettings, quizType: e.target.value })
              }
            >
              <option>Graded Quiz</option>
              <option>Practice Quiz</option>
              <option>Graded Survey</option>
              <option>Ungraded Survey</option>
            </FormSelect>
          </Col>
          <Col md={6}>
            <FormLabel>Points</FormLabel>
            <FormControl type="number" value={quizSettings.points} disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormLabel>Assignment Group</FormLabel>
            <FormSelect
              value={quizSettings.assignmentGroup}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  assignmentGroup: e.target.value,
                })
              }
            >
              <option>Quizzes</option>
              <option>Exams</option>
              <option>Assignments</option>
              <option>Project</option>
            </FormSelect>
          </Col>
          <Col md={6}>
            <FormLabel>Shuffle Answers</FormLabel>
            <FormSelect
              value={quizSettings.shuffleAnswers ? "Yes" : "No"}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  shuffleAnswers: e.target.value === "Yes",
                })
              }
            >
              <option>No</option>
              <option>Yes</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormLabel>Time Limit (minutes)</FormLabel>
            <FormControl
              type="number"
              min={0}
              value={quizSettings.timeLimit}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  timeLimit: parseInt(e.target.value || "0", 10),
                })
              }
            />
          </Col>
          <Col md={6}>
            <FormLabel>Multiple Attempts</FormLabel>
            <FormSelect
              value={quizSettings.multipleAttempts ? "Yes" : "No"}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  multipleAttempts: e.target.value === "Yes",
                })
              }
            >
              <option>No</option>
              <option>Yes</option>
            </FormSelect>
          </Col>
        </Row>

        {quizSettings.multipleAttempts && (
          <Row className="mb-3">
            <Col md={6}>
              <FormLabel>How Many Attempts</FormLabel>
              <FormControl
                type="number"
                min={1}
                value={quizSettings.howManyAttempts}
                onChange={(e) =>
                  setQuizSettings({
                    ...quizSettings,
                    howManyAttempts: parseInt(e.target.value || "1", 10),
                  })
                }
              />
            </Col>
          </Row>
        )}

        <Row className="mb-3">
          <Col md={6}>
            <FormLabel>Show Correct Answers</FormLabel>
            <FormSelect
              value={quizSettings.showCorrectAnswers}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  showCorrectAnswers: e.target.value,
                })
              }
            >
              <option>Immediately</option>
              <option>After the quiz is submitted</option>
              <option>Never</option>
            </FormSelect>
          </Col>
          <Col md={6}>
            <FormLabel>Access Code</FormLabel>
            <FormControl
              type="text"
              value={quizSettings.accessCode}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  accessCode: e.target.value,
                })
              }
              placeholder="Blank (default)"
            />
          </Col>
        </Row>

        <Row className="mb-2">
          <Col md={4}>
            <FormCheck
              type="checkbox"
              id="wd-one-question-at-a-time"
              label="One Question at a Time"
              checked={!!quizSettings.oneQuestionAtATime}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  oneQuestionAtATime: e.target.checked,
                })
              }
            />
          </Col>
          <Col md={4}>
            <FormCheck
              type="checkbox"
              id="wd-webcam-required"
              label="Webcam Required"
              checked={!!quizSettings.webcamRequired}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  webcamRequired: e.target.checked,
                })
              }
            />
          </Col>
          <Col md={4}>
            <FormCheck
              type="checkbox"
              id="wd-lock-after-answering"
              label="Lock Questions After Answering"
              checked={!!quizSettings.lockQuestionsAfterAnswering}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  lockQuestionsAfterAnswering: e.target.checked,
                })
              }
            />
          </Col>
        </Row>

        <hr />

        <Row className="mb-3">
          <Col md={4}>
            <FormLabel>Due date</FormLabel>
            <FormControl
              type="text"
              value={quizSettings.dueDate}
              onChange={(e) =>
                setQuizSettings({ ...quizSettings, dueDate: e.target.value })
              }
              placeholder="e.g. Sep 21 at 1pm"
            />
          </Col>
          <Col md={4}>
            <FormLabel>Available date</FormLabel>
            <FormControl
              type="text"
              value={quizSettings.availableFromDate}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  availableFromDate: e.target.value,
                })
              }
              placeholder="e.g. Nov 30 at 11:40am"
            />
          </Col>
          <Col md={4}>
            <FormLabel>Until date</FormLabel>
            <FormControl
              type="text"
              value={quizSettings.untilDate}
              onChange={(e) =>
                setQuizSettings({ ...quizSettings, untilDate: e.target.value })
              }
              placeholder="e.g. Dec 2 at 11:59pm"
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleCancel} id="wd-cancel-quiz-btn">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSave}
            disabled={!existingQuiz}
            id="wd-save-quiz-btn"
          >
            Save
          </Button>
          </div>
      </Form>
      )}
      {activeTab === "questions" && qidStr && (
        <QuizQuestionsEditor quizId={qidStr} />
      )}
    </div>
  );
}

