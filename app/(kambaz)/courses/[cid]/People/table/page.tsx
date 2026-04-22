"use client";
import { useCallback, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import * as coursesClient from "../../../client";
import PeopleDetails from "../Details";

export default function PeopleTable({
  users: externalUsers,
  fetchUsers: externalFetchUsers,
}: {
  users?: any[];
  fetchUsers?: () => void;
} = {}) {
  const { cid } = useParams();
  const [internalUsers, setInternalUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);

  const isExternalMode = externalUsers !== undefined;
  const users = isExternalMode ? externalUsers : internalUsers;

  const loadUsers = useCallback(async () => {
    if (isExternalMode) { setLoading(false); return; }
    if (!cid) return;
    setLoading(true);
    try {
      const data = await coursesClient.findUsersForCourse(cid as string);
      setInternalUsers(data);
    } catch (e) {
      console.error(e);
      setInternalUsers([]);
    } finally {
      setLoading(false);
    }
  }, [cid, isExternalMode]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  return (
    <div id="wd-people-table">
      {showDetails && (
        <PeopleDetails
          uid={showUserId}
          onClose={() => {
            setShowDetails(false);
          }}
        />
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
            </tr>
          </thead>
          <tbody>
            {users.filter((user) => user != null).map((user: any) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <span
                    className="text-decoration-none"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowDetails(true);
                      setShowUserId(user._id);
                    }}
                  >
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">{user.firstName} </span>
                    <span className="wd-last-name">{user.lastName}</span>
                  </span>
                </td>
                <td className="wd-login-id">{user.loginId}</td>
                <td className="wd-section">{user.section}</td>
                <td className="wd-role">{user.role}</td>
                <td className="wd-last-activity">{user.lastActivity}</td>
                <td className="wd-total-activity">{user.totalActivity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
