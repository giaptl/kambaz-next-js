"use client";
import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa6";
import * as enrollmentsClient from "../../enrollments/client";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const [showNavigation, setShowNavigation] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);

  const course = courses.find((c: any) => c._id === cid) as any;

  useEffect(() => {
    const checkEnrollment = async () => {
      if (currentUser?.role !== "STUDENT") {
        setIsEnrolled(true);
        return;
      }
      try {
        const enrolledCourses = await enrollmentsClient.fetchMyEnrollments();
        const enrolled = enrolledCourses.some((c: any) => c._id === cid);
        setIsEnrolled(enrolled);
        if (!enrolled) {
          router.push("/dashboard");
        }
      } catch (error) {
        setIsEnrolled(false);
        router.push("/dashboard");
      }
    };
    checkEnrollment();
  }, [cid, currentUser]);

  if (isEnrolled === null) return null;
  if (!isEnrolled) return null;

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
