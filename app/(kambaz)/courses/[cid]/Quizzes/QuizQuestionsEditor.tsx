"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setQuestions, addQuestion, updateQuestion, deleteQuestion } from "./questionsReducer";
import * as client from "../../client";
import { Button, FormSelect } from "react-bootstrap";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import FillInBlankEditor from "./FillInBlankEditor";

// editor for all the questions in a quiz
export default function QuizQuestionsEditor({ quizId }: { quizId: string }) {
  const dispatch = useDispatch();
  // only grab the questions belonging to this quiz
  const questions = useSelector((s: RootState) =>
    s.questionsReducer.questions.filter((q: any) => q.quiz === quizId)
  );
  // which question is currently being edited, null means none
  const [editingId, setEditingId] = useState<string | null>(null);

  // fetch questions from the backend when the quiz changes
  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await client.findQuestionsForQuiz(quizId);
      dispatch(setQuestions(data));
    };
    fetchQuestions();
  }, [quizId]);

  // add up points across all questions
  const totalPoints = questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);

  // keep the quiz's total points and question count in sync with the questions list
  const syncQuizPoints = async (updatedQuestions: any[]) => {
    const pts = updatedQuestions.reduce((s: number, q: any) => s + (q.points || 0), 0);
    await client.updateQuiz({
      _id: quizId,
      points: pts,
      numQuestions: updatedQuestions.length,
    });
  };

  // make a new question with default values and start editing it right away
  const handleAdd = async () => {
    const newQuestion = await client.createQuestionForQuiz(quizId, {
      title: "New Question",
      type: "multiple_choice",
      points: 1,
      question: "",
      choices: ["", ""],
      correctAnswer: 0,
    });
    dispatch(addQuestion(newQuestion));
    setEditingId(newQuestion._id);
    await syncQuizPoints([...questions, newQuestion]);
  };

  // save changes to a question and update the quiz totals
  const handleSave = async (updated: any) => {
    const saved = await client.updateQuestion(updated);
    dispatch(updateQuestion(saved));
    setEditingId(null);
    const next = questions.map((q: any) => (q._id === saved._id ? saved : q));
    await syncQuizPoints(next);
  };

  // switch a question between multiple choice, true/false, fill in the blank
  const handleTypeChange = async (q: any, newType: string) => {
    const updated = { ...q, type: newType };
    const saved = await client.updateQuestion(updated);
    dispatch(updateQuestion(saved));
  };

  // delete a question and refresh the quiz totals
  const handleDelete = async (questionId: string) => {
    await client.deleteQuestion(questionId);
    dispatch(deleteQuestion(questionId));
    const remaining = questions.filter((q: any) => q._id !== questionId);
    await syncQuizPoints(remaining);
  };

  return (
    <div>
      {/* total points shown up top */}
      <div className="text-end mb-2 fw-bold">Points {totalPoints}</div>

      {/* loop through each question */}
      {questions.map((q: any) => (
        <div key={q._id}>
          {editingId === q._id ? (
            // edit mode that show the right editor for this question type
            <div>
              <div className="d-flex gap-2 mb-2 align-items-center">
                {/* dropdown to change the question type */}
                <FormSelect
                  style={{ width: "200px" }}
                  value={q.type}
                  onChange={(e) => handleTypeChange(q, e.target.value)}
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="fill_in_blank">Fill in the Blank</option>
                </FormSelect>
              </div>

              {/* pick the editor based on question type */}
              {q.type === "multiple_choice" && (
                <MultipleChoiceEditor
                  question={q}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              )}
              {q.type === "true_false" && (
                <TrueFalseEditor
                  question={q}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              )}
              {q.type === "fill_in_blank" && (
                <FillInBlankEditor
                  question={q}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </div>
          ) : (
            // view mode that show the title, type, points, and edit/delete buttons
            <div className="border rounded p-3 mb-2 d-flex justify-content-between align-items-center">
              <div>
                <strong>{q.title}</strong>
                <span className="ms-2 text-muted small">
                  ({q.type.replace(/_/g, " ")}) — {q.points} pts
                </span>
              </div>
              <div className="d-flex gap-2">
                {/* edit button, flips this question into edit mode */}
                <Button size="sm" variant="outline-secondary"
                  onClick={() => setEditingId(q._id)}>Edit</Button>
                {/* delete button */}
                <Button size="sm" variant="outline-danger"
                  onClick={() => handleDelete(q._id)}>Delete</Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* button to create a new question */}
      <div className="d-flex justify-content-center mt-3">
        <Button variant="outline-secondary" onClick={handleAdd}>
          + New Question
        </Button>
      </div>
    </div>
  );
}