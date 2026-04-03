"use client";
import { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Form, FormLabel, Row, Col } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import type { User } from "../../../../account/reducer";
import * as coursesClient from "../../../client";
import * as accountClient from "../../../../account/client";

const defaultUser = (): User => ({
  _id: "",
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  dob: "2000-01-01",
  role: "STUDENT",
  loginId: "",
  section: "S101",
  lastActivity: "—",
  totalActivity: "—",
});

export default function PeopleTable() {
  const { cid } = useParams();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<User>(defaultUser);

  const loadUsers = useCallback(async () => {
    if (!cid) return;
    setLoading(true);
    try {
      const data = await coursesClient.findUsersForCourse(cid as string);
      setUsers(data as User[]);
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [cid]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const openCreate = () => {
    setEditing(false);
    setForm(defaultUser());
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditing(true);
    setForm({ ...user });
    setShowModal(true);
  };

  const saveUser = async () => {
    if (!cid) return;
    try {
      if (editing && form._id) {
        await accountClient.updateUser(form);
      } else {
        const { _id: _omit, ...rest } = form;
        await coursesClient.createUserForCourse(cid as string, rest);
      }
      setShowModal(false);
      await loadUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const removeUser = async (userId: string) => {
    if (!window.confirm("Remove this user from the system?")) return;
    try {
      await accountClient.deleteUser(userId);
      await loadUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div id="wd-people-table">
      {isFaculty && (
        <div className="mb-3">
          <Button variant="primary" id="wd-add-user-btn" onClick={openCreate}>
            Add user
          </Button>
        </div>
      )}
      {loading ? (
        <p className="text-muted">Loading roster…</p>
      ) : (
        <Table striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Login ID</th>
              <th>Section</th>
              <th>Role</th>
              <th>Last Activity</th>
              <th>Total Activity</th>
              {isFaculty && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName} </span>
                  <span className="wd-last-name">{user.lastName}</span>
                </td>
                <td className="wd-login-id">{user.loginId}</td>
                <td className="wd-section">{user.section}</td>
                <td className="wd-role">{user.role}</td>
                <td className="wd-last-activity">{user.lastActivity}</td>
                <td className="wd-total-activity">{user.totalActivity}</td>
                {isFaculty && (
                  <td className="text-nowrap">
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-1"
                      id={`wd-edit-user-${user._id}`}
                      onClick={() => openEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      id={`wd-delete-user-${user._id}`}
                      disabled={user._id === currentUser?._id}
                      onClick={() => void removeUser(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit user" : "Add user"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col md={6}>
              <FormLabel>Username</FormLabel>
              <Form.Control
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                disabled={editing}
              />
            </Col>
            <Col md={6}>
              <FormLabel>Password</FormLabel>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <FormLabel>First name</FormLabel>
              <Form.Control
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </Col>
            <Col md={6}>
              <FormLabel>Last name</FormLabel>
              <Form.Control
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <FormLabel>Email</FormLabel>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Col>
            <Col md={6}>
              <FormLabel>Date of birth</FormLabel>
              <Form.Control
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}>
              <FormLabel>Role</FormLabel>
              <Form.Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="FACULTY">FACULTY</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <FormLabel>Login ID</FormLabel>
              <Form.Control
                value={form.loginId}
                onChange={(e) =>
                  setForm({ ...form, loginId: e.target.value })
                }
              />
            </Col>
            <Col md={4}>
              <FormLabel>Section</FormLabel>
              <Form.Control
                value={form.section}
                onChange={(e) =>
                  setForm({ ...form, section: e.target.value })
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormLabel>Last activity</FormLabel>
              <Form.Control
                value={form.lastActivity}
                onChange={(e) =>
                  setForm({ ...form, lastActivity: e.target.value })
                }
              />
            </Col>
            <Col md={6}>
              <FormLabel>Total activity</FormLabel>
              <Form.Control
                value={form.totalActivity}
                onChange={(e) =>
                  setForm({ ...form, totalActivity: e.target.value })
                }
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void saveUser()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
