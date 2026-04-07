"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { updateQuiz } from "../reducer";
import { Button, Form, FormCheck, FormControl, FormLabel, FormSelect, Row, Col } from "react-bootstrap";

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
      title: "Unnamed Quiz",
      description: "",
      quizType: "Graded Quiz",
      points: existingQuiz?.points ?? 0,
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
    }),
    [existingQuiz?.points]
  );

  const [quizSettings, setQuizSettings] = useState<any>(defaultSettings);

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

  const handleSaveAndPublish = () => {
    if (!existingQuiz) return;
    dispatch(updateQuiz({ ...quizSettings, published: true }));
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

      {/* Top bar: Points and Published status */}
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
        <span>Points {quizSettings.points}</span>
        <span>{quizSettings.published ? "✅ Published" : "🚫 Not Published"}</span>
        <span style={{ cursor: "pointer", fontSize: "20px" }}>⋮</span>
      </div>

      {/* Tabs: Details / Questions */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className="nav-link active">Details</button>
        </li>
        <li className="nav-item">
          <button className="nav-link"
            onClick={() => router.push(`/courses/${cidStr}/Quizzes/${qidStr}/questions`)}>
            Questions
          </button>
        </li>
      </ul>

      <Form>
        {/* Title */}
        <div className="mb-3">
          <FormControl
            value={quizSettings.title || ""}
            onChange={(e) => setQuizSettings({ ...quizSettings, title: e.target.value })}
          />
        </div>

        {/* Quiz Instructions */}
        <div className="mb-3">
          <FormLabel>Quiz Instructions:</FormLabel>
          <FormControl as="textarea" rows={6}
            value={quizSettings.description || ""}
            onChange={(e) => setQuizSettings({ ...quizSettings, description: e.target.value })}
          />
        </div>

        {/* Quiz Type */}
        <Row className="mb-3 align-items-center">
          <Col md={3} className="text-end">
            <FormLabel>Quiz Type</FormLabel>
          </Col>
          <Col md={9}>
            <FormSelect
              value={quizSettings.quizType}
              onChange={(e) => setQuizSettings({ ...quizSettings, quizType: e.target.value })}
            >
              <option>Graded Quiz</option>
              <option>Practice Quiz</option>
              <option>Graded Survey</option>
              <option>Ungraded Survey</option>
            </FormSelect>
          </Col>
        </Row>

        {/* Assignment Group */}
        <Row className="mb-3 align-items-center">
          <Col md={3} className="text-end">
            <FormLabel>Assignment Group</FormLabel>
          </Col>
          <Col md={9}>
            <FormSelect
              value={quizSettings.assignmentGroup}
              onChange={(e) => setQuizSettings({ ...quizSettings, assignmentGroup: e.target.value })}
            >
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="PROJECT">PROJECT</option>
            </FormSelect>
          </Col>
        </Row>

        {/* Options */}
        <Row className="mb-3">
          <Col md={3} className="text-end">
            <FormLabel>Options</FormLabel>
          </Col>
          <Col md={9}>
            <FormCheck type="checkbox" id="wd-shuffle-answers" label="Shuffle Answers"
              className="mb-2"
              checked={!!quizSettings.shuffleAnswers}
              onChange={(e) => setQuizSettings({ ...quizSettings, shuffleAnswers: e.target.checked })}
            />

            <div className="d-flex align-items-center gap-2 mb-2">
              <FormCheck type="checkbox" id="wd-time-limit-check" label="Time Limit"
                checked={quizSettings.timeLimit > 0}
                onChange={(e) => setQuizSettings({ ...quizSettings, timeLimit: e.target.checked ? 20 : 0 })}
              />
              {quizSettings.timeLimit > 0 && (
                <>
                  <FormControl type="number" style={{ width: "80px" }}
                    value={quizSettings.timeLimit}
                    onChange={(e) => setQuizSettings({ ...quizSettings, timeLimit: parseInt(e.target.value) || 0 })}
                  />
                  <span>Minutes</span>
                </>
              )}
            </div>

            <div className="border rounded p-3 mb-2">
              <FormCheck type="checkbox" id="wd-multiple-attempts" label="Allow Multiple Attempts"
                checked={!!quizSettings.multipleAttempts}
                onChange={(e) => setQuizSettings({ ...quizSettings, multipleAttempts: e.target.checked })}
              />
              {quizSettings.multipleAttempts && (
                <div className="d-flex align-items-center gap-2 mt-2 ms-4">
                  <FormLabel className="mb-0">How Many Attempts:</FormLabel>
                  <FormControl type="number" style={{ width: "80px" }}
                    min={1}
                    value={quizSettings.howManyAttempts}
                    onChange={(e) => setQuizSettings({ ...quizSettings, howManyAttempts: parseInt(e.target.value) || 1 })}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Assign section */}
        <Row className="mb-3 align-items-center">
          <Col md={3} className="text-end">
            <FormLabel>Assign</FormLabel>
          </Col>
          <Col md={9}>
            <div className="border rounded p-3">
              <div className="mb-3">
                <FormLabel className="fw-bold">Assign to</FormLabel>
                <FormControl placeholder="Everyone" />
              </div>
              <div className="mb-3">
                <FormLabel className="fw-bold">Due</FormLabel>
                <FormControl type="text"
                  value={quizSettings.dueDate}
                  onChange={(e) => setQuizSettings({ ...quizSettings, dueDate: e.target.value })}
                  placeholder="e.g. Sep 21 at 1pm"
                />
              </div>
              <Row>
                <Col md={6}>
                  <FormLabel className="fw-bold">Available from</FormLabel>
                  <FormControl type="text"
                    value={quizSettings.availableFromDate}
                    onChange={(e) => setQuizSettings({ ...quizSettings, availableFromDate: e.target.value })}
                    placeholder="e.g. Nov 30 at 11:40am"
                  />
                </Col>
                <Col md={6}>
                  <FormLabel className="fw-bold">Until</FormLabel>
                  <FormControl type="text"
                    value={quizSettings.untilDate}
                    onChange={(e) => setQuizSettings({ ...quizSettings, untilDate: e.target.value })}
                    placeholder="e.g. Dec 2 at 11:59pm"
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />

        {/* Bottom buttons */}
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleCancel} id="wd-cancel-quiz-btn">
            Cancel
          </Button>
          <Button variant="success" onClick={handleSaveAndPublish}
            disabled={!existingQuiz} id="wd-save-publish-quiz-btn">
            Save &amp; Publish
          </Button>
          <Button variant="danger" onClick={handleSave}
            disabled={!existingQuiz} id="wd-save-quiz-btn">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}