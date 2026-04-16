"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import * as client from "../../../client";

export default function NewQuiz() {
  const { cid } = useParams();
  const router = useRouter();
  const cidStr = Array.isArray(cid) ? cid[0] : cid;

  useEffect(() => {
    const createAndRedirect = async () => {
      if (!cidStr) return;
      const newQuiz = await client.createQuizForCourse(cidStr, {
        title: "New Quiz",
        description: "",
        quizType: "Graded Quiz",
        points: 0,
        assignmentGroup: "QUIZZES",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        howManyAttempts: 1,
        showCorrectAnswers: "Immediately",
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: "",
        availableFromDate: "",
        untilDate: "",
        published: false,
      });
      router.replace(`/courses/${cidStr}/Quizzes/${newQuiz._id}`);
    };
    createAndRedirect();
  }, []);

  return null;
}
