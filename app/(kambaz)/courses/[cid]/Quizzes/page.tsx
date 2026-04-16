"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { setQuizzes, deleteQuiz, updateQuiz } from "./reducer";
import * as client from "../../client";
import {
  ListGroup,
  ListGroupItem,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { VscTriangleDown } from "react-icons/vsc";
import { FaTrash, FaRocket } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import GreenCheckmark from "../Modules/GreenCheckmark";
import Link from "next/link";

export default function () {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const [search, setSearch] = useState("");
  const [studentView, setStudentView] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isFaculty = currentUser?.role === "FACULTY" && !studentView;
  const cidStr = Array.isArray(cid) ? cid[0] : cid;

  const fetchQuizzes = async () => {
    if (!cidStr) return;
    const data = await client.findQuizzesForCourse(cidStr);
    dispatch(setQuizzes(data));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cidStr]);

  const courseQuizzes = quizzes
    .filter((q: any) => q.course === cidStr)
    .filter((q: any) => isFaculty || q.published)
    .filter((q: any) => q.title.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDelete = async (quizId: string) => {
    setOpenMenuId(null);
    if (window.confirm("Are you sure you want to remove this quiz?")) {
      await client.deleteQuiz(quizId);
      dispatch(deleteQuiz(quizId));
    }
  };

  const handleTogglePublish = async (quiz: any) => {
    setOpenMenuId(null);
    const updated = { ...quiz, published: !quiz.published };
    await client.updateQuiz(updated);
    dispatch(updateQuiz(updated));
  };

  return (
    <div>
      {/* Top Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text className="bg-white border-end-0">
            <CiSearch />
          </InputGroup.Text>
          <FormControl
            placeholder="Search for Quiz"
            className="border-start-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-secondary"
            onClick={() => setStudentView(!studentView)}
            id="wd-student-view-btn"
          >
            {studentView ? "Faculty View" : "Student View"}
          </button>
          {isFaculty && (
            <button
              className="btn btn-danger"
              id="wd-add-quiz-btn"
              onClick={() => router.push(`/courses/${cid}/Quizzes/new`)}
            >
              <BsPlus className="fs-4" /> Quiz
            </button>
          )}
          <IoEllipsisVertical className="fs-4" style={{ cursor: "pointer" }} />
        </div>
      </div>

      {/* Quiz List */}
      <ListGroup className="rounded-0" id="wd-quizzes">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <VscTriangleDown className="me-2 fs-5" />
            <b>Assignment Quizzes</b>
          </div>
          <ListGroup className="rounded-0">
            {courseQuizzes.map((quiz: any) => (
              <ListGroupItem key={quiz._id} className="p-3 ps-1">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3 text-secondary" />
                  <FaRocket className="me-3 fs-4 text-success" />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <Link
                        href={`/courses/${cid}/Quizzes/${quiz._id}`}
                        className="text-dark text-decoration-none fw-bold"
                      >
                        {quiz.title}
                      </Link>
                      <div className="d-flex align-items-center gap-3">
                        {/* Publish toggle icon */}
                        <span
                          style={{ cursor: isFaculty ? "pointer" : "default" }}
                          onClick={() => isFaculty && handleTogglePublish(quiz)}
                          title={
                            quiz.published
                              ? "Click to unpublish"
                              : "Click to publish"
                          }
                        >
                          {quiz.published ? "✅" : "🚫"}
                        </span>

                        {/* Trash — faculty only */}
                        {isFaculty && (
                          <FaTrash
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(quiz._id)}
                            id="wd-delete-quiz-click"
                          />
                        )}

                        {/* 3-dot context menu — faculty only */}
                        {isFaculty && (
                          <div
                            className="position-relative"
                            ref={openMenuId === quiz._id ? menuRef : null}
                          >
                            <IoEllipsisVertical
                              className="fs-4"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === quiz._id ? null : quiz._id,
                                )
                              }
                            />
                            {openMenuId === quiz._id && (
                              <div
                                className="position-absolute end-0 bg-white border rounded shadow"
                                style={{
                                  zIndex: 1000,
                                  minWidth: "150px",
                                  top: "24px",
                                }}
                              >
                                <div
                                  className="px-3 py-2"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    router.push(
                                      `/courses/${cid}/Quizzes/${quiz._id}`,
                                    );
                                  }}
                                >
                                  Edit
                                </div>
                                <div
                                  className="px-3 py-2"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDelete(quiz._id)}
                                >
                                  Delete
                                </div>
                                <div
                                  className="px-3 py-2"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleTogglePublish(quiz)}
                                >
                                  {quiz.published ? "Unpublish" : "Publish"}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quiz meta info */}
                    <div className="small mt-1 text-muted">
                      {quiz.status === "Closed" && (
                        <span className="fw-bold">Closed</span>
                      )}
                      {quiz.status === "Available" && (
                        <span>
                          <span className="text-danger fw-bold">Available</span>{" "}
                          {quiz.availableFromDate}
                        </span>
                      )}
                      {quiz.status === "Not available" && (
                        <span>
                          <b>Not available until</b>{" "}
                          <span className="text-danger">
                            {quiz.availableFromDate}
                          </span>
                        </span>
                      )}{" "}
                      | <b>Due</b>{" "}
                      <span
                        className={
                          quiz.dueDate === "Multiple Dates" ? "text-danger" : ""
                        }
                      >
                        {quiz.dueDate}
                      </span>{" "}
                      | {quiz.points} pts | {quiz.numQuestions} Questions
                    </div>
                  </div>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
