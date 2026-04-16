"use client";
import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa6";
import { setEnrollments } from "../../enrollmentsReducer";
import * as coursesClient from "../client";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer,
  );
  const [showNavigation, setShowNavigation] = useState(true);
  const [enrollmentsLoaded, setEnrollmentsLoaded] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === "FACULTY") {
      setEnrollmentsLoaded(true);
      return;
    }
    (async () => {
      try {
        const data = await coursesClient.findMyEnrollments(currentUser._id);
        dispatch(setEnrollments(data));
      } catch (e) {
        console.error(e);
      } finally {
        setEnrollmentsLoaded(true);
      }
    })();
  }, [currentUser?._id, currentUser?.role, dispatch]);

  const course = courses.find((c: any) => c._id === cid);

  if (!currentUser) {
    router.push("/account/signin");
    return null;
  }

  // protect route — redirect if not enrolled
  const isEnrolled = enrollments.some(
    (e: { user?: string; course?: string }) =>
      e.user === currentUser?._id && e.course === cid,
  );
  const canAccessCourse =
    currentUser?.role === "FACULTY" || isEnrolled;
  if (currentUser?.role !== "FACULTY" && !enrollmentsLoaded) {
    return null;
  }
  if (!canAccessCourse) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div id="wd-courses">
      <h2>
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          onClick={() => setShowNavigation(!showNavigation)}
          style={{ cursor: "pointer" }}
        />
        {course?.name}
      </h2>
      <hr />
      <div className="d-flex">
        <div>{showNavigation && <CourseNavigation />}</div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
