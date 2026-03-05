"use client";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import InputGroupText from "react-bootstrap/esm/InputGroupText";

export default function AssignmentsControls({
  addAssignment,
}: {
  addAssignment: () => void;
}) {
  return (
    <div>
      <div id="wd-modules-controls" className="text-nowrap">
        <Button
          variant="danger"
          size="lg"
          className="me-1 float-end"
          id="wd-add-assignment"
          onClick={addAssignment}
        >
          <FaPlus
            className="position-relative me-2"
            style={{ bottom: "1px" }}
          />
          Assignment
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="me-1 float-end"
          id="wd-add-group"
        >
          <FaPlus
            className="position-relative me-2"
            style={{ bottom: "1px" }}
          />
          Group
        </Button>
        <InputGroup className="me-1" style={{ width: "250px" }}>
          <InputGroupText className="bg-white border-end-0">
            <CiSearch />
          </InputGroupText>
          <FormControl
            type="text"
            placeholder="Search..."
            className="border-start-0"
          />
        </InputGroup>
      </div>
    </div>
  );
}
