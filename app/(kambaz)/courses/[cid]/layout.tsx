"use client";
import { ReactNode, useState } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa6";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer,
  );
  const [showNavigation, setShowNavigation] = useState(true);

  const course = courses.find((c: any) => c._id === cid);

  // protect route — redirect if not enrolled
  const isEnrolled = enrollments.some(
    (e: any) => e.user === currentUser?._id && e.course === cid,
  );
  if (!isEnrolled) {
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
