"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { RootState } from "../store";
import { setEnrollments } from "../enrollmentsReducer";
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
import * as client from "../courses/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const router = useRouter();
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer,
  );
  const [showAllCourses, setShowAllCourses] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      if (currentUser?.role === "FACULTY") {
        setShowAllCourses(true);
      } else {
        setShowAllCourses(false);
      }
    });
  }, [currentUser?._id, currentUser?.role]);

  const dispatch = useDispatch();
  const [course, setCourse] = useState({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });
  const isEnrolled = (courseId: string) =>
    enrollments.some(
      (e: { user?: string; course?: string }) =>
        e.user === currentUser?._id && e.course === courseId,
    );

  const loadDashboardData = useCallback(async () => {
    if (!currentUser) {
      dispatch(setCourses([]));
      dispatch(setEnrollments([]));
      return;
    }
    try {
      const [coursesData, enrollmentData] = await Promise.all([
        showAllCourses ? client.fetchAllCourses() : client.findMyCourses(),
        client.findMyEnrollments(),
      ]);
      dispatch(setCourses(coursesData));
      dispatch(setEnrollments(enrollmentData));
    } catch (error) {
      console.error(error);
    }
  }, [currentUser, showAllCourses, dispatch]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/account/signin");
    }
    void loadDashboardData();
  }, [currentUser, router, loadDashboardData]);

  if (!currentUser) {
    return null;
  }

  const displayedCourses = showAllCourses
    ? courses
    : courses.filter((c) => isEnrolled(c._id as string));

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c) =>
          (c as { _id: string })._id === course._id ? course : c,
        ),
      ),
    );
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(
      setCourses(
        courses.filter((c) => (c as { _id: string })._id !== courseId),
      ),
    );
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await client.enrollInCourse(courseId);
      await loadDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      await client.unenrollFromCourse(courseId);
      await loadDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      {currentUser?.role === "FACULTY" && (
        <>
          {" "}
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => {
                onAddNewCourse();
              }}
            >
              {" "}
              Add{" "}
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={() => {
                onUpdateCourse();
              }}
              id="wd-update-course-click"
            >
              Update{" "}
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
          <hr />{" "}
        </>
      )}
      <h2 id="wd-dashboard-published">
        Published Courses ({displayedCourses.length})
        <button
          className="btn btn-primary float-end"
          onClick={() => setShowAllCourses(!showAllCourses)}
          id="wd-enrollments-btn"
        >
          Enrollments
        </button>
      </h2>{" "}
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((courseItem) => (
            <Col
              key={courseItem._id as string}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  href={`/courses/${courseItem._id as string}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    src="/images/reactjs.jpg"
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {courseItem.name as string}{" "}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {courseItem.description as string}{" "}
                    </CardText>
                    <Button variant="primary"> Go </Button>
                    {currentUser?.role === "FACULTY" && (
                      <>
                        {" "}
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            onDeleteCourse(courseItem._id as string);
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
                            setCourse(courseItem as typeof course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>{" "}
                      </>
                    )}
                    {isEnrolled(courseItem._id as string) ? (
                      <button
                        className="btn btn-danger justify-content-end mt-2 d-flex"
                        id="wd-unenroll-click"
                        onClick={(e) => {
                          e.preventDefault();
                          void handleUnenroll(courseItem._id as string);
                        }}
                      >
                        Unenroll
                      </button>
                    ) : (
                      <button
                        className="btn btn-success justify-content-end mt-2 d-flex"
                        id="wd-enroll-click"
                        onClick={(e) => {
                          e.preventDefault();
                          void handleEnroll(courseItem._id as string);
                        }}
                      >
                        Enroll
                      </button>
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
