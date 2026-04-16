"use client";
import { useState } from "react";
import { Button, FormControl, FormLabel } from "react-bootstrap";

// editor for multiple choice questions
export default function MultipleChoiceEditor({ question, onSave, onCancel }: any) {
  // useState to store edits here until the user actually saves
  const [local, setLocal] = useState({ ...question });

  // ability to update one of the choices without changing the original array
  const updateChoice = (i: number, val: string) => {
    const choices = [...local.choices];
    choices[i] = val;
    setLocal({ ...local, choices });
  };

  return (
    <div className="border rounded p-3 mb-3">
      <div className="d-flex gap-2 mb-2">
        {/* name of the question */}
        <FormControl
          placeholder="Question Title"
          value={local.title}
          onChange={(e) => setLocal({ ...local, title: e.target.value })}
        />
        <FormControl
          type="number"
          style={{ width: "80px" }}
          value={local.points}
          onChange={(e) => setLocal({ ...local, points: Number(e.target.value) })}
        />
        <span className="align-self-center">pts</span>
      </div>

      {/* the prompt that students can read*/}
      <FormLabel>Question</FormLabel>
      <FormControl
        as="textarea"
        rows={2}
        className="mb-3"
        value={local.question}
        onChange={(e) => setLocal({ ...local, question: e.target.value })}
      />

      {/* list of answer choices */}
      <FormLabel>Answers</FormLabel>
      {local.choices.map((choice: string, i: number) => (
        <div key={i} className="d-flex align-items-center gap-2 mb-2">
          <input
            type="radio"
            name={`correct-${local._id}`}
            checked={local.correctAnswer === i}
            onChange={() => setLocal({ ...local, correctAnswer: i })}
          />
          <FormControl
            value={choice}
            placeholder={local.correctAnswer === i ? "Correct Answer" : "Possible Answer"}
            onChange={(e) => updateChoice(i, e.target.value)}
          />
          {/* trash button */}
          <Button variant="outline-danger" size="sm"
            onClick={() => setLocal({ ...local, choices: local.choices.filter((_: any, j: number) => j !== i) })}>
            🗑
          </Button>
        </div>
      ))}
      {/* can add one more empty choice to the bottom */}
      <Button variant="link" onClick={() => setLocal({ ...local, choices: [...local.choices, ""] })}>
        + Add Another Answer
      </Button>

      {/* cancellation discards changes, update sends them to their parent */}
      <div className="d-flex gap-2 mt-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={() => onSave(local)}>Update Question</Button>
      </div>
    </div>
  );
}