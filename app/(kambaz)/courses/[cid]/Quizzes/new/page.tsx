"use client";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addQuiz } from "../reducer";

// headless route component doesn't show anything
// it just makes a new quiz and sends you to its edit 
// page right away this is the "new quiz" entry point
export default function NewQuiz() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  // useParams can return string or string[] make it a normal string
  const cidStr = Array.isArray(cid) ? cid[0] : cid;

  useEffect(() => {
    //Dispatch synchronously addQuiz is a local reducer so the new ID is available right away on ther action payload thass returned.
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
    // replace instead of push so user can't navigate back to blank route
    if (cidStr && newId) {
      router.replace(`/courses/${cidStr}/Quizzes/${newId}/edit`);
    }
  }, []); // run once, only on mount

  return null;
}
