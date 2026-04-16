"use client";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addQuiz } from "../reducer";

export default function NewQuiz() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const cidStr = Array.isArray(cid) ? cid[0] : cid;

  useEffect(() => {
    const action = dispatch(
      addQuiz({
        title: "New Quiz",
        description: "",
        course: cidStr,
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
        questions: [],
      }),
    );
    const newId = (action.payload as any)._id;
    if (cidStr && newId) {
      router.replace(`/courses/${cidStr}/Quizzes/${newId}/edit`);
    }
  }, []);

  return null;
}
