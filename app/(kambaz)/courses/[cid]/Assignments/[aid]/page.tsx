"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { addAssignment, updateAssignment } from "../reducer";
import { useState, useEffect } from "react";
import {
  Form,
  FormLabel,
  FormControl,
  FormSelect,
  FormCheck,
  Button,
  Row,
  Col,
} from "react-bootstrap";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer,
  );

  const existingAssignment = assignments.find((a: any) => a._id === aid);

  const [assignment, setAssignment] = useState<any>({
    title: "New Assignment",
    description: "",
    points: 100,
    dueDate: "",
    availableFromDate: "",
    availableUntilDate: "",
    course: cid,
  });

  useEffect(() => {
    if (existingAssignment) {
      setAssignment(existingAssignment);
    }
  }, [aid]);

  const handleSave = () => {
    if (existingAssignment) {
      dispatch(updateAssignment(assignment));
    } else {
      dispatch(addAssignment({ ...assignment, course: cid }));
    }
    router.push(`/courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
        <div className="mb-3">
          <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
          <FormControl
            id="wd-name"
            type="text"
            value={assignment.title}
            onChange={(e) =>
              setAssignment({ ...assignment, title: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <FormControl
            as="textarea"
            id="wd-description"
            rows={10}
            value={assignment.description}
            onChange={(e) =>
              setAssignment({ ...assignment, description: e.target.value })
            }
          />
        </div>
        <Row className="mb-3">
          <FormLabel column sm={3} className="text-end">
            Points
          </FormLabel>
          <Col sm={9}>
            <FormControl
              id="wd-points"
              type="number"
              value={assignment.points}
              onChange={(e) =>
                setAssignment({
                  ...assignment,
                  points: parseInt(e.target.value),
                })
              }
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <FormLabel column sm={3} className="text-end">
            Assignment Group
          </FormLabel>
          <Col sm={9}>
            <FormSelect id="wd-group">
              <option>ASSIGNMENTS</option>
            </FormSelect>
          </Col>
        </Row>
        <Row className="mb-3">
          <FormLabel column sm={3} className="text-end">
            Display Grade as
          </FormLabel>
          <Col sm={9}>
            <FormSelect id="wd-grade">
              <option>Percentage</option>
            </FormSelect>
          </Col>
        </Row>
        <Row className="mb-3">
          <FormLabel column sm={3} className="text-end">
            Submission Type
          </FormLabel>
          <Col sm={9}>
            <div className="border p-3">
              <FormSelect id="wd-type" className="mb-3">
                <option>Online</option>
              </FormSelect>
              <FormLabel className="fw-bold mb-2">
                Online Entry Options
              </FormLabel>
              <FormCheck
                type="checkbox"
                id="wd-text-entry"
                label="Text Entry"
                className="mb-2"
              />
              <FormCheck
                type="checkbox"
                id="wd-website-url"
                label="Website URL"
                className="mb-2"
                defaultChecked
              />
              <FormCheck
                type="checkbox"
                id="wd-media"
                label="Media Recordings"
                className="mb-2"
              />
              <FormCheck
                type="checkbox"
                id="wd-annotation"
                label="Student Annotation"
                className="mb-2"
              />
              <FormCheck
                type="checkbox"
                id="wd-file-uploads"
                label="File Uploads"
              />
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <FormLabel column sm={3} className="text-end">
            Assign
          </FormLabel>
          <Col sm={9}>
            <div className="border p-3">
              <div className="mb-3">
                <FormLabel htmlFor="wd-assign-to">Assign to</FormLabel>
                <FormControl
                  id="wd-assign-to"
                  type="text"
                  defaultValue="Everyone"
                />
              </div>
              <div className="mb-3">
                <FormLabel htmlFor="wd-due-date">Due</FormLabel>
                <FormControl
                  id="wd-due-date"
                  type="date"
                  value={assignment.dueDate}
                  onChange={(e) =>
                    setAssignment({ ...assignment, dueDate: e.target.value })
                  }
                />
              </div>
              <Row>
                <Col md={6}>
                  <FormLabel htmlFor="wd-available-from">
                    Available from
                  </FormLabel>
                  <FormControl
                    id="wd-available-from"
                    type="date"
                    value={assignment.availableFromDate}
                    onChange={(e) =>
                      setAssignment({
                        ...assignment,
                        availableFromDate: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={6}>
                  <FormLabel htmlFor="wd-until">Until</FormLabel>
                  <FormControl
                    id="wd-until"
                    type="date"
                    value={assignment.availableUntilDate}
                    onChange={(e) =>
                      setAssignment({
                        ...assignment,
                        availableUntilDate: e.target.value,
                      })
                    }
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <hr />
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="secondary"
            onClick={handleCancel}
            id="wd-cancel-assignment-btn"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSave}
            id="wd-save-assignment-btn"
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
