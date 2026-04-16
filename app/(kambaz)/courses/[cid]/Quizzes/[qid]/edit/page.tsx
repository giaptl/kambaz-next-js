"use client";

// quiz editor page: shows when faculty clicks edit on a quiz
// has two tabs: details (settings) and questions (add/edit questions)

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
  // get the course id and quiz id from the url
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // grab all quizzes and questions from redux store
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { questions } = useSelector(
    (state: RootState) => state.questionsReducer,
  );

  // make sure cid and qid are strings not arrays (next.js sometimes gives arrays)
  const cidStr = Array.isArray(cid) ? cid[0] : cid;
  const qidStr = Array.isArray(qid) ? qid[0] : qid;

  // find the quiz we're editing from the list of all quizzes
  const existingQuiz = useMemo(
    () => quizzes.find((q: any) => q._id === qidStr),
    [quizzes, qidStr],
  );

  // calculate total points by adding up all question points for this quiz
  // this updates automatically when questions change
  const totalPoints = useMemo(
    () =>
      questions
        .filter((q: any) => q.quiz === qidStr)
        .reduce((sum: number, q: any) => sum + (q.points || 0), 0),
    [questions, qidStr],
  );

  // default values for a new quiz, used when creating or resetting settings
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

  // track which tab is open (details or questions)
  const [activeTab, setActiveTab] = useState<"details" | "questions">(
    "details",
  );

  // when the page loads, fill in the form with the existing quiz data
  // only runs when the quiz id changes so we dont overwrite changes the user made
  useEffect(() => {
    if (!existingQuiz) return;
    setQuizSettings({
      ...quizSettings,
      ...existingQuiz,
      // make sure dates are empty strings not null (input fields dont like null)
      dueDate: existingQuiz.dueDate ?? "",
      availableFromDate: existingQuiz.availableFromDate ?? "",
      untilDate: existingQuiz.untilDate ?? "",
    });
  }, [existingQuiz?._id]);

  // helper function to update a single field in quiz settings
  // instead of writing setQuizSettings everywhere we just call set("fieldName", value)
  const set = (key: string, value: any) =>
    setQuizSettings((prev: any) => ({ ...prev, [key]: value }));

  // save the quiz and go back to the quiz details preview page
  // also updates the points to match the total from all questions
  const saveAndBack = () => {
    if (!existingQuiz) return;
    dispatch(updateQuiz({ ...quizSettings, points: totalPoints }));
    router.push(`/courses/${cidStr}/Quizzes/${qidStr}`);
  };

  return (
    <div className="p-4" id="wd-quiz-details-editor">
      {/* top bar showing points and publish status */}
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
        <span>Points {totalPoints}</span>
        {/* clicking this toggles published/unpublished but doesnt save to db yet */}
        <button
          className={`btn ${quizSettings.published ? "btn-success" : "btn-secondary"}`}
          id="wd-publish-quiz-btn"
          onClick={() => set("published", !quizSettings.published)}
        >
          {quizSettings.published ? "Published" : "Publish"}
        </button>
      </div>

      {/* tabs to switch between details form and questions list */}
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

      {/* details tab - all the quiz settings */}
      {activeTab === "details" && (
        <Form>
          {/* quiz title input */}
          <div className="mb-3">
            <FormControl
              value={quizSettings.title || ""}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          {/* instructions/description for the quiz */}
          <div className="mb-3">
            <FormLabel>Quiz Instructions:</FormLabel>
            <FormControl
              as="textarea"
              rows={6}
              value={quizSettings.description || ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {/* dropdown for quiz type */}
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

          {/* which assignment group this quiz belongs to */}
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

          {/* all the extra options */}
          <Row className="mb-3">
            <Col md={3} className="text-end">
              <FormLabel>Options</FormLabel>
            </Col>
            <Col md={9}>
              {/* shuffle answers checkbox */}
              <div className="mb-2">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  checked={!!quizSettings.shuffleAnswers}
                  onChange={(e) => set("shuffleAnswers", e.target.checked)}
                  id="wd-shuffle-answers"
                />
                <label
                  htmlFor="wd-shuffle-answers"
                  className="form-check-label"
                >
                  Shuffle Answers
                </label>
              </div>

              {/* time limit checkbox: shows number input when checked */}
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
                {/* only show the minutes input if time limit is enabled */}
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

              {/* multiple attempts section: shows how many attempts input when enabled */}
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
                {/* show attempt count input only if multiple attempts is on */}
                {quizSettings.multipleAttempts && (
                  <div className="d-flex align-items-center gap-2">
                    <span>How Many Attempts</span>
                    <FormControl
                      style={{ width: "80px" }}
                      type="number"
                      min={1}
                      value={quizSettings.howManyAttempts}
                      onChange={(e) =>
                        set(
                          "howManyAttempts",
                          parseInt(e.target.value || "1", 10),
                        )
                      }
                    />
                  </div>
                )}
              </div>

              {/* when to show correct answers to students */}
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

              {/* optional passcode students need to enter before taking quiz */}
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

              {/* show one question at a time instead of all at once */}
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

              {/* require webcam during quiz */}
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

              {/* prevent students from going back to change answers */}
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

          {/* due date and availability dates section */}
          <Row className="mb-3 align-items-center">
            <Col md={3} className="text-end">
              <FormLabel>Assign</FormLabel>
            </Col>
            <Col md={9}>
              <div className="border rounded p-3">
                {/* assign to field - just shows everyone for now */}
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

          {/* cancel goes back without saving, save dispatches to redux and goes back */}
          <div className="d-flex justify-content-end gap-2 mb-4">
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/courses/${cidStr}/Quizzes/${qidStr}`)
              }
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={saveAndBack}>
              Save
            </Button>
          </div>
        </Form>
      )}

      {/* questions tab: shows the quiz questions editor component */}
      {activeTab === "questions" && (
        <div>
          {/* this component handles all the question adding/editing logic */}
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

