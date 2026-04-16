"use client";
import { useState } from "react";
import { Button, FormControl, FormLabel } from "react-bootstrap";

// editor for true/false questions
export default function TrueFalseEditor({ question, onSave, onCancel }: any) {
  // hold edits here until the user saves
  const [local, setLocal] = useState({ ...question });

  return (
    <div className="border rounded p-3 mb-3">
      {/* title and points row */}
      <div className="d-flex gap-2 mb-2">
        {/* name of the question */}
        <FormControl
          placeholder="Question Title"
          value={local.title}
          onChange={(e) => setLocal({ ...local, title: e.target.value })}
        />
        {/* point value */}
        <FormControl
          type="number"
          style={{ width: "80px" }}
          value={local.points}
          onChange={(e) => setLocal({ ...local, points: Number(e.target.value) })}
        />
        <span className="align-self-center">pts</span>
      </div>

      {/* prompt students will see */}
      <FormLabel>Question</FormLabel>
      <FormControl
        as="textarea"
        rows={2}
        className="mb-3"
        value={local.question}
        onChange={(e) => setLocal({ ...local, question: e.target.value })}
      />

      {/* pick true or false as the correct answer */}
      <FormLabel>Correct Answer</FormLabel>
      <div className="d-flex gap-3 mb-3">
        {["True", "False"].map((opt) => (
          <label key={opt} className="d-flex align-items-center gap-2">
            {/* radio button, only one can be selected */}
            <input
              type="radio"
              name={`tf-${local._id}`}
              checked={local.correctAnswer === opt}
              onChange={() => setLocal({ ...local, correctAnswer: opt })}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* update sends changes back to the parent */}
      <div className="d-flex gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={() => onSave(local)}>Update Question</Button>
      </div>
    </div>
  );
}