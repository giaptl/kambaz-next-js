"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../../../client";
import {
  Button,
  Form,
  FormCheck,
  FormControl,
  FormLabel,
  FormSelect,
  Row,
  Col,
} from "react-bootstrap";

export default function QuizDetailsPage() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const cidStr = Array.isArray(cid) ? cid[0] : cid;
  const qidStr = Array.isArray(qid) ? qid[0] : qid;

  const defaultSettings = {
    title: "Unnamed Quiz",
    description: "",
    quizType: "Graded Quiz",
    points: 0,
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
  };

  const [quizSettings, setQuizSettings] = useState<any>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qidStr) return;
      const quiz = await client.findQuizById(qidStr);
      if (quiz) {
        setQuizSettings({
          ...defaultSettings,
          ...quiz,
          dueDate: quiz.dueDate ?? "",
          availableFromDate: quiz.availableFromDate ?? "",
          untilDate: quiz.untilDate ?? "",
        });
      }
      setLoaded(true);
    };
    fetchQuiz();
  }, [qidStr]);

  const set = (key: string, val: any) =>
    setQuizSettings((prev: any) => ({ ...prev, [key]: val }));

  const isFaculty = currentUser?.role === "FACULTY";

  const handleCancel = () =>
    cidStr && router.push(`/courses/${cidStr}/Quizzes`);

  const handleSave = async () => {
    await client.updateQuiz(quizSettings);
    if (cidStr) router.push(`/courses/${cidStr}/Quizzes`);
  };

  const handleSaveAndPublish = async () => {
    await client.updateQuiz({ ...quizSettings, published: true });
    if (cidStr) router.push(`/courses/${cidStr}/Quizzes`);
  };

  if (!loaded) return null;

  if (!isFaculty) {
    return (
      <div className="p-4">
        <h2 className="mb-3">{quizSettings.title}</h2>
        <Button id="wd-start-quiz-btn" variant="primary">
          Start Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4" id="wd-quiz-details-editor">
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
        <span>Points {quizSettings.points}</span>
        <span>
          {quizSettings.published ? "Published" : "Not Published"}
        </span>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className="nav-link active">Details</button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            onClick={() =>
              router.push(`/courses/${cidStr}/Quizzes/${qidStr}/questions`)
            }
          >
            Questions
          </button>
        </li>
      </ul>

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
            <FormCheck
              type="checkbox"
              id="wd-shuffle-answers"
              label="Shuffle Answers"
              className="mb-2"
              checked={!!quizSettings.shuffleAnswers}
              onChange={(e) => set("shuffleAnswers", e.target.checked)}
            />

            <div className="d-flex align-items-center gap-2 mb-2">
              <FormCheck
                type="checkbox"
                id="wd-time-limit-check"
                label="Time Limit"
                checked={quizSettings.timeLimit > 0}
                onChange={(e) => set("timeLimit", e.target.checked ? 20 : 0)}
              />
              {quizSettings.timeLimit > 0 && (
                <>
                  <FormControl
                    type="number"
                    style={{ width: "80px" }}
                    value={quizSettings.timeLimit}
                    onChange={(e) =>
                      set("timeLimit", parseInt(e.target.value) || 0)
                    }
                  />
                  <span>Minutes</span>
                </>
              )}
            </div>

            <div className="border rounded p-3 mb-2">
              <FormCheck
                type="checkbox"
                id="wd-multiple-attempts"
                label="Allow Multiple Attempts"
                checked={!!quizSettings.multipleAttempts}
                onChange={(e) => set("multipleAttempts", e.target.checked)}
              />
              {quizSettings.multipleAttempts && (
                <div className="d-flex align-items-center gap-2 mt-2 ms-4">
                  <FormLabel className="mb-0">How Many Attempts:</FormLabel>
                  <FormControl
                    type="number"
                    style={{ width: "80px" }}
                    min={1}
                    value={quizSettings.howManyAttempts}
                    onChange={(e) =>
                      set("howManyAttempts", parseInt(e.target.value) || 1)
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
                  <option value="Immediately">Immediately</option>
                  <option value="After Last Attempt">After Last Attempt</option>
                  <option value="Never">Never</option>
                </FormSelect>
              </Col>
            </Row>

            <Row className="mb-2 align-items-center">
              <Col xs="auto">
                <FormLabel className="mb-0">Access Code:</FormLabel>
              </Col>
              <Col>
                <FormControl
                  type="text"
                  id="wd-access-code"
                  placeholder="Leave blank for no code"
                  value={quizSettings.accessCode || ""}
                  onChange={(e) => set("accessCode", e.target.value)}
                />
              </Col>
            </Row>

            <FormCheck
              type="checkbox"
              id="wd-one-question-at-a-time"
              label="One Question at a Time"
              className="mb-2"
              checked={!!quizSettings.oneQuestionAtATime}
              onChange={(e) => set("oneQuestionAtATime", e.target.checked)}
            />

            <FormCheck
              type="checkbox"
              id="wd-webcam-required"
              label="Webcam Required"
              className="mb-2"
              checked={!!quizSettings.webcamRequired}
              onChange={(e) => set("webcamRequired", e.target.checked)}
            />

            <FormCheck
              type="checkbox"
              id="wd-lock-questions"
              label="Lock Questions After Answering"
              checked={!!quizSettings.lockQuestionsAfterAnswering}
              onChange={(e) =>
                set("lockQuestionsAfterAnswering", e.target.checked)
              }
            />
          </Col>
        </Row>

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
                <FormControl
                  type="date"
                  id="wd-due-date"
                  value={quizSettings.dueDate}
                  onChange={(e) => set("dueDate", e.target.value)}
                />
              </div>
              <Row>
                <Col md={6}>
                  <FormLabel className="fw-bold">Available from</FormLabel>
                  <FormControl
                    type="date"
                    id="wd-available-from"
                    value={quizSettings.availableFromDate}
                    onChange={(e) => set("availableFromDate", e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <FormLabel className="fw-bold">Until</FormLabel>
                  <FormControl
                    type="date"
                    id="wd-until"
                    value={quizSettings.untilDate}
                    onChange={(e) => set("untilDate", e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="secondary"
            onClick={handleCancel}
            id="wd-cancel-quiz-btn"
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSaveAndPublish}
            id="wd-save-publish-quiz-btn"
          >
            Save &amp; Publish
          </Button>
          <Button
            variant="danger"
            onClick={handleSave}
            id="wd-save-quiz-btn"
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
