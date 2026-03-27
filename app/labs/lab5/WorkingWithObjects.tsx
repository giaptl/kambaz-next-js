"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });
  const [module, setModule] = useState({
    id: 1,
    name: "NodeJS Module",
    description: "Learn about NodeJS and ExpressJS",
    course: "NodeJS Course",
  });
  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;
  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>

      {/* Retrieving Objects */}
      <h4>Retrieving Objects</h4>
      <a
        id="wd-retrieve-assignments"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment`}
      >
        Get Assignment
      </a>
      <a
        id="wd-retrieve-module"
        className="btn btn-primary ms-2"
        href={`${HTTP_SERVER}/lab5/module`}
      >
        Get Module
      </a>
      <hr />

      {/* Retrieving Properties */}
      <h4>Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment/title`}
      >
        Get Assignment Title
      </a>
      <a
        id="wd-retrieve-assignment-score"
        className="btn btn-primary ms-2"
        href={`${HTTP_SERVER}/lab5/assignment/score`}
      >
        Get Assignment Score
      </a>
      <a
        id="wd-retrieve-assignment-completed"
        className="btn btn-primary ms-2"
        href={`${HTTP_SERVER}/lab5/assignment/completed`}
      >
        Get Assignment Completed
      </a>
      <a
        id="wd-retrieve-module-name"
        className="btn btn-primary ms-2"
        href={`${HTTP_SERVER}/lab5/module/name`}
      >
        Get Module Name
      </a>
      <a
        id="wd-retrieve-module-description"
        className="btn btn-primary ms-2"
        href={`${HTTP_SERVER}/lab5/module/description`}
      >
        Get Module Description
      </a>
      <hr />

      <h4>Modifying Properties</h4>

      <h5>Assignment</h5>
      <div className="d-flex gap-2 align-items-center mb-3">
        <FormControl
          className="flex-grow-1"
          id="wd-assignment-title"
          defaultValue={assignment.title}
          onChange={(e) =>
            setAssignment({ ...assignment, title: e.target.value })
          }
        />
        <a
          id="wd-update-assignment-title"
          className="btn btn-primary text-nowrap"
          href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
        >
          Update Title
        </a>
      </div>

      <div className="d-flex gap-2 align-items-center mb-3">
        <FormControl
          className="flex-grow-1"
          id="wd-assignment-score"
          type="number"
          defaultValue={assignment.score}
          onChange={(e) =>
            setAssignment({
              ...assignment,
              score: parseInt(e.target.value) || 0,
            })
          }
        />
        <a
          id="wd-update-assignment-score"
          className="btn btn-primary text-nowrap"
          href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
        >
          Update Score
        </a>
      </div>

      <div className="d-flex gap-2 align-items-center mb-3">
        <div className="form-check">
          <FormControl
            className="form-check-input"
            id="wd-assignment-completed"
            type="checkbox"
            checked={assignment.completed}
            onChange={(e) =>
              setAssignment({ ...assignment, completed: e.target.checked })
            }
          />
          <label
            className="form-check-label ms-2"
            htmlFor="wd-assignment-completed"
          >
            Completed
          </label>
        </div>
        <a
          id="wd-update-assignment-completed"
          className="btn btn-primary text-nowrap ms-auto"
          href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
        >
          Update Completed
        </a>
      </div>

      <h5>Module</h5>

      <div className="d-flex gap-2 align-items-center mb-3">
        <FormControl
          className="flex-grow-1"
          id="wd-module-name"
          defaultValue={module.name}
          onChange={(e) => setModule({ ...module, name: e.target.value })}
        />
        <a
          id="wd-update-module-title"
          className="btn btn-primary text-nowrap"
          href={`${MODULE_API_URL}/name/${module.name}`}
        >
          Update Name
        </a>
      </div>

      <div className="d-flex gap-2 align-items-center mb-3">
        <FormControl
          className="flex-grow-1"
          id="wd-module-description"
          placeholder="Module description"
          defaultValue={module.description}
          onChange={(e) =>
            setModule({ ...module, description: e.target.value })
          }
        />
        <a
          id="wd-update-module-description"
          className="btn btn-primary text-nowrap"
          href={`${MODULE_API_URL}/description/${module.description}`}
        >
          Update Description
        </a>
      </div>
    </div>
  );
}
