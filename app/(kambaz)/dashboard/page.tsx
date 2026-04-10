"use client";
import * as client from "../courses/client";
import * as enrollmentsClient from "../enrollments/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RootState } from "../store";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  FormControl,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../courses/reducer";

export default function Dashboard() {
  const courses = useSelector(
    (state: RootState) => state.coursesReducer.courses,
  ) as any[];
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const dispatch = useDispatch();

  const [showAllCourses, setShowAllCourses] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
  });

  const fetchCourses = async () => {
    try {
      const data = await client.fetchAllCourses();
      dispatch(setCourses(data));
    } catch (error) {
      console.error("fetchCourses error:", error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const enrolledCourses = await enrollmentsClient.fetchMyEnrollments();
      setEnrolledCourseIds(enrolledCourses.map((c: any) => c._id));
    } catch (error) {
      console.error("fetchEnrollments error:", error);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchCourses();
    if (currentUser.role === "STUDENT") {
      fetchEnrollments();
    }
  }, [currentUser]);

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  const displayedCourses: any[] =
    currentUser?.role === "FACULTY" ||
    currentUser?.role === "ADMIN" ||
    showAllCourses
      ? courses
      : courses.filter((c) => isEnrolled(c._id));

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      {currentUser?.role === "FACULTY" && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={async () => {
                const newCourse = await client.createCourse(course);
                dispatch(setCourses([...courses, newCourse]));
              }}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              id="wd-update-course-click"
              onClick={async () => {
                await client.updateCourse(course);
                dispatch(
                  setCourses(
                    courses.map((c) => (c._id === course._id ? course : c)),
                  ),
                );
              }}
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">
        Published Courses ({displayedCourses.length})
        {currentUser?.role === "STUDENT" && (
          <>
            <button
              className="btn btn-primary float-end ms-2"
              id="wd-all-courses-btn"
              onClick={() => setShowAllCourses(true)}
            >
              All Courses
            </button>
            <button
              className="btn btn-secondary float-end ms-2"
              id="wd-my-courses-btn"
              onClick={() => setShowAllCourses(false)}
            >
              My Courses
            </button>
          </>
        )}
        <button
          className="btn btn-primary float-end"
          id="wd-enrollments-btn"
          onClick={() => setShowAllCourses(!showAllCourses)}
        >
          Enrollments
        </button>
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((course) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  href={`/courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    src="/images/reactjs.jpg"
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>
                    <Button variant="primary">Go</Button>
                    {currentUser?.role === "FACULTY" && (
                      <>
                        <button
                          onClick={async (event) => {
                            event.preventDefault();
                            await client.deleteCourse(course._id);
                            dispatch(
                              setCourses(
                                courses.filter((c) => c._id !== course._id),
                              ),
                            );
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>
                      </>
                    )}
                    {currentUser?.role === "STUDENT" && showAllCourses &&(
                      <>
                        {isEnrolled(course._id) ? (
                          <button
                            className="btn btn-danger mt-2 float-end"
                            id="wd-unenroll-click"
                            onClick={async (e) => {
                              e.preventDefault();
                              await enrollmentsClient.unenrollFromCourse(
                                course._id,
                              );
                              await fetchEnrollments();
                            }}
                          >
                            Unenroll
                          </button>
                        ) : (
                          <button
                            className="btn btn-success mt-2 float-end"
                            id="wd-enroll-click"
                            onClick={async (e) => {
                              e.preventDefault();
                              await enrollmentsClient.enrollInCourse(
                                course._id,
                              );
                              await fetchEnrollments();
                            }}
                          >
                            Enroll
                          </button>
                        )}
                      </>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
