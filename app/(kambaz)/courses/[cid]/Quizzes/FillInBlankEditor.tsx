"use client";
import { useState } from "react";
import { Button, FormControl, FormLabel } from "react-bootstrap";

/**
 * editor for Fill-in-the-Blank Questions
 * parent component passes to the editor the question data along with the functions for saving/cancelling editing process
 */
export default function FillInBlankEditor({ question, onSave, onCancel }: any) {
  const [local, setLocal] = useState({
    ...question,
    answers: question.answers ?? [""],
  });

  //exchange one value for another, but copy the array to avoid changing state
  const updateAnswer = (i: number, val: string) => {
    const answers = [...local.answers];
    answers[i] = val;
    setLocal({ ...local, answers });
  };

  return (
    <div className="border rounded p-3 mb-3">
      <div className="d-flex gap-2 mb-2">
        <FormControl
          placeholder="Question Title"
          value={local.title}
          onChange={(e) => setLocal({ ...local, title: e.target.value })}
        />
        {/*how many points question is worth*/}
        <FormControl
          type="number"
          style={{ width: "80px" }}
          value={local.points}
          onChange={(e) => setLocal({ ...local, points: Number(e.target.value) })}
        />
        <span className="align-self-center">pt{local.points !== 1 ? "s" : ""}</span>
      </div>

      <FormLabel>Question</FormLabel>
      <FormControl
        as="textarea"
        rows={2}
        className="mb-3"
        value={local.question}
        onChange={(e) => setLocal({ ...local, question: e.target.value })}
      />

      <FormLabel>Possible Correct Answers</FormLabel>
      {/* title and points should be placed side by side at the beginning */}
      {local.answers.map((ans: string, i: number) => (
        <div key={i} className="d-flex gap-2 mb-2">
          <FormControl
            value={ans}
            placeholder="Possible Answer"
            onChange={(e) => updateAnswer(i, e.target.value)}
          />
          <Button variant="outline-danger" size="sm"
            onClick={() => setLocal({ ...local, answers: local.answers.filter((_: any, j: number) => j !== i) })}>
            🗑
          </Button>
        </div>
      ))}
      <Button variant="link" onClick={() => setLocal({ ...local, answers: [...local.answers, ""] })}>
        + Add Another Answer
      </Button>
      
      {/* update sends everything to the parent*/}
      <div className="d-flex gap-2 mt-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={() => onSave(local)}>Update Question</Button>
      </div>
    </div>
  );
}