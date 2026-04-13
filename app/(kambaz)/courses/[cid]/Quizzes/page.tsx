"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteQuiz, togglePublish } from "./reducer";
import {
  ListGroup,
  ListGroupItem,
  FormControl,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { VscTriangleDown } from "react-icons/vsc";
import { FaTrash, FaRocket } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import GreenCheckmark from "../Modules/GreenCheckmark";
import Link from "next/link";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const [search, setSearch] = useState("");
  const [studentView, setStudentView] = useState(false);
  const [sortBy, setSortBy] = useState("none");

  const handleDelete = (quizId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this quiz?",
    );
    if (confirmed) dispatch(deleteQuiz(quizId));
  };

  const courseQuizzes = quizzes
    .filter((q: any) => q.course === cid)
    .filter((q: any) => q.title.toLowerCase().includes(search.toLowerCase()))
    .filter((q: any) => {
      if (studentView || currentUser?.role === "STUDENT") return q.published;
      return true;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "availableDate") {
        if (!a.availableFromDate) return 1;
        if (!b.availableFromDate) return -1;
        return a.availableFromDate.localeCompare(b.availableFromDate);
      }
      return 0;
    });

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
          <select
            className="form-select"
            style={{ width: "200px" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="wd-sort-quizzes"
          >
            <option value="none">Sort by...</option>
            <option value="availableDate">Available Date</option>
          </select>
          <button
            className="btn btn-secondary"
            onClick={() => setStudentView(!studentView)}
            id="wd-student-view-btn"
          >
            {studentView ? "Faculty View" : "Student View"}
          </button>
          {currentUser?.role === "FACULTY" && !studentView && (
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
                        {quiz.published ? (
                          <FaCheckCircle
                            className="text-success"
                            style={{ cursor: "pointer" }}
                            title="Published - click to unpublish"
                            onClick={() => dispatch(togglePublish(quiz._id))}
                            id="wd-publish-quiz-btn"
                          />
                        ) : (
                          <FaBan
                            className="text-secondary"
                            style={{ cursor: "pointer" }}
                            title="Unpublished - click to publish"
                            onClick={() => dispatch(togglePublish(quiz._id))}
                            id="wd-unpublish-quiz-btn"
                          />
                        )}
                        {currentUser?.role === "FACULTY" && !studentView && (
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="link"
                              className="p-0 text-dark"
                              id={`quiz-menu-${quiz._id}`}
                            >
                              <IoEllipsisVertical className="fs-4" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  router.push(
                                    `/courses/${cid}/Quizzes/${quiz._id}/edit`,
                                  )
                                }
                              >
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleDelete(quiz._id)}
                              >
                                Delete
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  dispatch(togglePublish(quiz._id))
                                }
                              >
                                {quiz.published ? "Unpublish" : "Publish"}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </div>
                    </div>
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
