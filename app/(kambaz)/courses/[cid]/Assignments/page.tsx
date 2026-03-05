"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "./reducer";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { SlNote } from "react-icons/sl";
import { VscTriangleDown } from "react-icons/vsc";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import AssignmentControlButtons from "./AssignmentControlButtons";
import AssignmentsControls from "./assignmentsControls";

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer,
  );
  const courseAssignments = assignments.filter((a: any) => a.course === cid);

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const handleDelete = (assignmentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this assignment?",
    );
    if (confirmed) {
      dispatch(deleteAssignment(assignmentId));
    }
  };

  return (
    <div>
      {currentUser?.role === "FACULTY" && (
        <AssignmentsControls
          addAssignment={() => router.push(`/courses/${cid}/Assignments/new`)}
        />
      )}
      <div className="mt-4">
        <ListGroup className="rounded-0" id="wd-modules">
          <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
              <div>
                <BsGripVertical className="me-2 fs-3" />
                <VscTriangleDown className="me-2 fs-5" />
                ASSIGNMENTS
              </div>
              <div className="d-flex align-items-center">
                <span className="border rounded-pill px-3 py-1 me-2">
                  40% of Total
                </span>
                <AssignmentControlButtons />
              </div>
            </div>
            <ListGroup className="wd-lessons rounded-0">
              {courseAssignments.map((assignment: any) => (
                <ListGroupItem
                  key={assignment._id}
                  className="wd-lesson p-3 ps-1"
                >
                  <div className="d-flex align-items-center">
                    <BsGripVertical className="me-2 fs-3" />
                    <SlNote className="me-2 fs-1 mt-1 text-success" />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <Link
                          href={`/courses/${cid}/Assignments/${assignment._id}`}
                          className="text-dark text-decoration-none fw-bold"
                        >
                          {assignment.title}
                        </Link>
                        {currentUser?.role === "FACULTY" && (
                          <FaTrash
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(assignment._id)}
                            id="wd-delete-assignment-click"
                          />
                        )}
                      </div>
                      <div className="small mt-1">
                        <span className="text-danger">Multiple Modules</span>
                        <span className="text-muted">
                          {" "}
                          | <b>Not available until</b>{" "}
                          {assignment.availableFromDate} at 12:00am | <b>Due</b>{" "}
                          {assignment.dueDate} at 11:59pm | {assignment.points}{" "}
                          pts
                        </span>
                      </div>
                    </div>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      </div>
    </div>
  );
}
