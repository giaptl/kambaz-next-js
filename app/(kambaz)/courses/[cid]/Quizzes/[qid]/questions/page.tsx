"use client";

import { useParams, useRouter } from "next/navigation";
import QuizQuestionsEditor from "../../QuizQuestionsEditor";

export default function QuestionsPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const cidStr = Array.isArray(cid) ? cid[0] : cid;
  const qidStr = Array.isArray(qid) ? qid[0] : qid;

  return (
    <div className="p-4">
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className="nav-link"
            onClick={() =>
              router.push(`/courses/${cidStr}/Quizzes/${qidStr}`)
            }
          >
            Details
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link active">Questions</button>
        </li>
      </ul>

      {qidStr && <QuizQuestionsEditor quizId={qidStr} />}
    </div>
  );
}
