"use client";
import { useParams } from "next/navigation";

export default function Grades() {
  const { cid } = useParams();
  return (
    <div id="wd-grades">
      <h2>Grades</h2>
      <p>Grades for course {cid} will appear here.</p>
    </div>
  );
}
