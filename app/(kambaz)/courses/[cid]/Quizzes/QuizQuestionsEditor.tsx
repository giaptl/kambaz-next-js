"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { addQuestion, updateQuestion, deleteQuestion } from "./questionsReducer";
import { Button, FormSelect } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import FillInBlankEditor from "./FillInBlankEditor";

export default function QuizQuestionsEditor({ quizId }: { quizId: string }) {
  const dispatch = useDispatch();
  const questions = useSelector((s: RootState) =>
    s.questionsReducer.questions.filter((q: any) => q.quiz === quizId)
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalPoints = questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);

  const handleAdd = () => {
    const newId = uuidv4();
    dispatch(addQuestion({ quizId, _id: newId }));
    setEditingId(newId);
  };

  const handleSave = (updated: any) => {
    dispatch(updateQuestion(updated));
    setEditingId(null);
  };

  const handleTypeChange = (q: any, newType: string) => {
    dispatch(updateQuestion({ ...q, type: newType }));
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
                  {q.type === "multiple_choice" ? "Multiple Choice" : q.type === "true_false" ? "True/False" : "Fill in the Blank"} ({q.points}pts)
                </span>
              </div>
              <div className="d-flex gap-2">
                <Button size="sm" variant="outline-secondary"
                  onClick={() => setEditingId(q._id)}>Edit</Button>
                <Button size="sm" variant="outline-danger"
                  onClick={() => dispatch(deleteQuestion(q._id))}>Delete</Button>
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