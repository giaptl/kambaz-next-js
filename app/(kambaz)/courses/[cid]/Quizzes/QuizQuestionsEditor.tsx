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

export default function QuizQuestionsEditor({ quizId }: { quizId: string }) {
  const dispatch = useDispatch();
  const questions = useSelector((s: RootState) =>
    s.questionsReducer.questions.filter((q: any) => q.quiz === quizId)
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await client.findQuestionsForQuiz(quizId);
      dispatch(setQuestions(data));
    };
    fetchQuestions();
  }, [quizId]);

  const totalPoints = questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);

  const syncQuizPoints = async (updatedQuestions: any[]) => {
    const pts = updatedQuestions.reduce((s: number, q: any) => s + (q.points || 0), 0);
    await client.updateQuiz({
      _id: quizId,
      points: pts,
      numQuestions: updatedQuestions.length,
    });
  };

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

  const handleSave = async (updated: any) => {
    const saved = await client.updateQuestion(updated);
    dispatch(updateQuestion(saved));
    setEditingId(null);
    const next = questions.map((q: any) => (q._id === saved._id ? saved : q));
    await syncQuizPoints(next);
  };

  const handleTypeChange = async (q: any, newType: string) => {
    const updated = { ...q, type: newType };
    const saved = await client.updateQuestion(updated);
    dispatch(updateQuestion(saved));
  };

  const handleDelete = async (questionId: string) => {
    await client.deleteQuestion(questionId);
    dispatch(deleteQuestion(questionId));
    const remaining = questions.filter((q: any) => q._id !== questionId);
    await syncQuizPoints(remaining);
  };

  return (
    <div>
      <div className="text-end mb-2 fw-bold">Points {totalPoints}</div>

      {questions.map((q: any) => (
        <div key={q._id}>
          {editingId === q._id ? (
            <div>
              <div className="d-flex gap-2 mb-2 align-items-center">
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
            <div className="border rounded p-3 mb-2 d-flex justify-content-between align-items-center">
              <div>
                <strong>{q.title}</strong>
                <span className="ms-2 text-muted small">
                  ({q.type.replace(/_/g, " ")}) — {q.points} pts
                </span>
              </div>
              <div className="d-flex gap-2">
                <Button size="sm" variant="outline-secondary"
                  onClick={() => setEditingId(q._id)}>Edit</Button>
                <Button size="sm" variant="outline-danger"
                  onClick={() => handleDelete(q._id)}>Delete</Button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="d-flex justify-content-center mt-3">
        <Button variant="outline-secondary" onClick={handleAdd}>
          + New Question
        </Button>
      </div>
    </div>
  );
}
