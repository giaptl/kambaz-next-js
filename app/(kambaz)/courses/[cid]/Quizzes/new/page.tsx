"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewQuiz() {
  const { cid } = useParams();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/courses/${cid}/Quizzes/new`);
  }, []);
  return null;
}