import Link from "next/link";
export default function CourseNavigation() {
  return (
    <div id="wd-courses-navigation">
      <Link href="/courses/1234/home" id="wd-course-home-link">Home</Link><br/>
      <Link href="/courses/1234/modules" id="wd-course-modules-link">Modules
        </Link><br/>
      <Link href="/courses/1234/piazza" id="wd-course-piazza-link">Piazza</Link><br/>
      <Link href="/courses/1234/zoom" id="wd-course-zoom-link">Zoom</Link><br/>
      <Link href="/courses/1234/assignments" id="wd-course-assignments-link">
          Assignments</Link><br/>
      <Link href="/courses/1234/quizzes" id="wd-course-quizzes-link">Quizzes
        </Link><br/>
      <Link href="/courses/1234/grades" id="wd-course-grades-link">Grades</Link><br/>
      <Link href="/courses/1234/people/table" id="wd-course-people-link">People</Link><br/>
    </div>
  );}

