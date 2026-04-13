"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { RootState } from "../../../store";
import { setAssignments } from "./reducer";
import * as coursesClient from "../../client";
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
  const courseAssignments = assignments.filter((a: { course?: string }) => {
    return a.course === cid;
  });

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  const fetchAssignments = useCallback(async () => {
    if (!cid) return;
    try {
      const data = await coursesClient.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(data));
    } catch (e) {
      console.error(e);
    }
  }, [cid, dispatch]);

  useEffect(() => {
    void fetchAssignments();
  }, [fetchAssignments]);

  const handleDelete = async (assignmentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this assignment?",
    );
    if (!confirmed) return;
    try {
      await coursesClient.deleteAssignment(assignmentId);
      dispatch(
        setAssignments(
          assignments.filter(
            (a: { _id?: string }) => a._id !== assignmentId,
          ) as Record<string, unknown>[],
        ),
      );
    } catch (e) {
      console.error(e);
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
              {courseAssignments.map((assignment: Record<string, unknown>) => (
                <ListGroupItem
                  key={String(assignment._id)}
                  className="wd-lesson p-3 ps-1"
                >
                  <div className="d-flex align-items-center">
                    <BsGripVertical className="me-2 fs-3" />
                    <SlNote className="me-2 fs-1 mt-1 text-success" />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <Link
                          href={`/courses/${cid}/Assignments/${String(assignment._id)}`}
                          className="text-dark text-decoration-none fw-bold"
                        >
                          {String(assignment.title ?? "")}
                        </Link>
                        {currentUser?.role === "FACULTY" && (
                          <FaTrash
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => void handleDelete(String(assignment._id))}
                            id="wd-delete-assignment-click"
                          />
                        )}
                      </div>
                      <div className="small mt-1">
                        <span className="text-danger">Multiple Modules</span>
                        <span className="text-muted">
                          {" "}
                          | <b>Not available until</b>{" "}
                          {(assignment.availableFrom ??
                            assignment.availableFromDate) as string}{" "}
                          at 12:00am | <b>Due</b>{" "}
                          {String(assignment.dueDate)} at 11:59pm |{" "}
                          {String(assignment.points)} pts
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
