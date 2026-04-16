"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { updateQuiz } from "../../reducer";
import QuizQuestionsEditor from "../../QuizQuestionsEditor";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormLabel,
  FormSelect,
  Row,
} from "react-bootstrap";

export default function QuizDetailsEditorPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { questions } = useSelector((state: RootState) => state.questionsReducer);

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

  const [quizSettings, setQuizSettings] = useState<any>({
    title: "Unnamed Quiz",
    description: "",
    quizType: "Graded Quiz",
    assignmentGroup: "QUIZZES",
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
    published: false,
  });
  const [activeTab, setActiveTab] = useState<"details" | "questions">("details");

  useEffect(() => {
    if (!existingQuiz) return;
    setQuizSettings({
      ...quizSettings,
      ...existingQuiz,
      dueDate: existingQuiz.dueDate ?? "",
      availableFromDate: existingQuiz.availableFromDate ?? "",
      untilDate: existingQuiz.untilDate ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingQuiz?._id]);

  const set = (key: string, value: any) =>
    setQuizSettings((prev: any) => ({ ...prev, [key]: value }));

  const saveAndBack = () => {
    if (!existingQuiz) return;
    dispatch(updateQuiz({ ...quizSettings, points: totalPoints }));
    router.push(`/courses/${cidStr}/Quizzes/${qidStr}`);
  };

  return (
    <div className="p-4" id="wd-quiz-details-editor">
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
        <span>Points {totalPoints}</span>
        <button
          className={`btn ${quizSettings.published ? "btn-success" : "btn-secondary"}`}
          id="wd-publish-quiz-btn"
          onClick={() => set("published", !quizSettings.published)}
        >
          {quizSettings.published ? "Published" : "Publish"}
        </button>
      </div>

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
          <div className="mb-3">
            <FormControl
              value={quizSettings.title || ""}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <FormLabel>Quiz Instructions:</FormLabel>
            <FormControl
              as="textarea"
              rows={6}
              value={quizSettings.description || ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <Row className="mb-3 align-items-center">
            <Col md={3} className="text-end">
              <FormLabel>Quiz Type</FormLabel>
            </Col>
            <Col md={9}>
              <FormSelect
                value={quizSettings.quizType}
                onChange={(e) => set("quizType", e.target.value)}
              >
                <option>Graded Quiz</option>
                <option>Practice Quiz</option>
                <option>Graded Survey</option>
                <option>Ungraded Survey</option>
              </FormSelect>
            </Col>
          </Row>

          <Row className="mb-3 align-items-center">
            <Col md={3} className="text-end">
              <FormLabel>Assignment Group</FormLabel>
            </Col>
            <Col md={9}>
              <FormSelect
                value={quizSettings.assignmentGroup}
                onChange={(e) => set("assignmentGroup", e.target.value)}
              >
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="PROJECT">PROJECT</option>
              </FormSelect>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3} className="text-end">
              <FormLabel>Options</FormLabel>
            </Col>
            <Col md={9}>
              <div className="mb-2">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  checked={!!quizSettings.shuffleAnswers}
                  onChange={(e) => set("shuffleAnswers", e.target.checked)}
                  id="wd-shuffle-answers"
                />
                <label htmlFor="wd-shuffle-answers" className="form-check-label">
                  Shuffle Answers
                </label>
              </div>

              <div className="d-flex align-items-center gap-2 mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={quizSettings.timeLimit > 0}
                  onChange={(e) => set("timeLimit", e.target.checked ? 20 : 0)}
                  id="wd-time-limit"
                />
                <label htmlFor="wd-time-limit" className="form-check-label">
                  Time Limit
                </label>
                {quizSettings.timeLimit > 0 && (
                  <>
                    <FormControl
                      style={{ width: "80px" }}
                      type="number"
                      value={quizSettings.timeLimit}
                      onChange={(e) =>
                        set("timeLimit", parseInt(e.target.value || "20", 10))
                      }
                    />
                    <span>Minutes</span>
                  </>
                )}
              </div>

              <div className="border rounded p-3 mb-2">
                <div className="mb-2">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    checked={!!quizSettings.multipleAttempts}
                    onChange={(e) => set("multipleAttempts", e.target.checked)}
                    id="wd-multiple-attempts"
                  />
                  <label
                    htmlFor="wd-multiple-attempts"
                    className="form-check-label"
                  >
                    Allow Multiple Attempts
                  </label>
                </div>
                {quizSettings.multipleAttempts && (
                  <div className="d-flex align-items-center gap-2">
                    <span>How Many Attempts</span>
                    <FormControl
                      style={{ width: "80px" }}
                      type="number"
                      min={1}
                      value={quizSettings.howManyAttempts}
                      onChange={(e) =>
                        set("howManyAttempts", parseInt(e.target.value || "1", 10))
                      }
                    />
                  </div>
                )}
              </div>

              <Row className="mb-2 align-items-center">
                <Col xs="auto">
                  <FormLabel className="mb-0">Show Correct Answers:</FormLabel>
                </Col>
                <Col>
                  <FormSelect
                    value={quizSettings.showCorrectAnswers}
                    onChange={(e) => set("showCorrectAnswers", e.target.value)}
                  >
                    <option>Immediately</option>
                    <option>After Last Attempt</option>
                    <option>Never</option>
                  </FormSelect>
                </Col>
              </Row>

              <Row className="mb-2 align-items-center">
                <Col xs="auto">
                  <FormLabel className="mb-0">Access Code:</FormLabel>
                </Col>
                <Col>
                  <FormControl
                    value={quizSettings.accessCode || ""}
                    onChange={(e) => set("accessCode", e.target.value)}
                    placeholder="Leave blank for no code"
                  />
                </Col>
              </Row>

              <div className="mb-2">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  checked={!!quizSettings.oneQuestionAtATime}
                  onChange={(e) => set("oneQuestionAtATime", e.target.checked)}
                  id="wd-one-question"
                />
                <label htmlFor="wd-one-question" className="form-check-label">
                  One Question at a Time
                </label>
              </div>

              <div className="mb-2">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  checked={!!quizSettings.webcamRequired}
                  onChange={(e) => set("webcamRequired", e.target.checked)}
                  id="wd-webcam"
                />
                <label htmlFor="wd-webcam" className="form-check-label">
                  Webcam Required
                </label>
              </div>

              <div>
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  checked={!!quizSettings.lockQuestionsAfterAnswering}
                  onChange={(e) =>
                    set("lockQuestionsAfterAnswering", e.target.checked)
                  }
                  id="wd-lock-questions"
                />
                <label htmlFor="wd-lock-questions" className="form-check-label">
                  Lock Questions After Answering
                </label>
              </div>
            </Col>
          </Row>

          <Row className="mb-3 align-items-center">
            <Col md={3} className="text-end">
              <FormLabel>Assign</FormLabel>
            </Col>
            <Col md={9}>
              <div className="border rounded p-3">
                <div className="mb-3">
                  <FormLabel>Assign to</FormLabel>
                  <FormControl defaultValue="Everyone" />
                </div>
                <div className="mb-3">
                  <FormLabel>Due</FormLabel>
                  <FormControl
                    type="date"
                    value={quizSettings.dueDate}
                    onChange={(e) => set("dueDate", e.target.value)}
                  />
                </div>
                <Row>
                  <Col md={6}>
                    <FormLabel>Available from</FormLabel>
                    <FormControl
                      type="date"
                      value={quizSettings.availableFromDate}
                      onChange={(e) => set("availableFromDate", e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <FormLabel>Until</FormLabel>
                    <FormControl
                      type="date"
                      value={quizSettings.untilDate}
                      onChange={(e) => set("untilDate", e.target.value)}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mb-4">
            <Button
              variant="secondary"
              onClick={() => router.push(`/courses/${cidStr}/Quizzes/${qidStr}`)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={saveAndBack}>
              Save
            </Button>
          </div>
        </Form>
      )}

      {activeTab === "questions" && (
        <div>
          <QuizQuestionsEditor quizId={qidStr || ""} />
          <div className="d-flex justify-content-end mt-3">
            <Button variant="danger" onClick={saveAndBack}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

