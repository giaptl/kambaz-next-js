"use client";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import * as client from "../../../account/client";

export default function PeopleDetails({
  uid,
  onClose,
  fetchUsers,
}: {
  uid: string | null;
  onClose: () => void;
  fetchUsers: () => void;
}) {
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
  };

const saveUser = async () => {
  let updatedUser;
  if (name.trim() === "") {
    updatedUser = { ...user };
  } else {
    const parts = name.trim().split(" ");
    const firstName = parts[0];
    const lastName =
      parts.length > 1 ? parts.slice(1).join(" ") : user.lastName;
    updatedUser = { ...user, firstName, lastName };
  }
  await client.updateUser(updatedUser);
  setUser(updatedUser);
  setEditing(false);
};

  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    fetchUsers();
    onClose();
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);

  if (!uid) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button onClick={onClose} className="btn position-fixed end-0 top-0">
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      <div className="text-danger fs-4">
        {!editing && (
          <FaPencil
            onClick={() => setEditing(true)}
            className="float-end fs-5 mt-2"
          />
        )}
        {editing && (
          <FaCheck
            onClick={() => saveUser()}
            className="float-end fs-5 mt-2 me-2"
          />
        )}
        {!editing && (
          <div onClick={() => setEditing(true)} style={{ cursor: "pointer" }}>
            {user.firstName} {user.lastName}
          </div>
        )}
        {editing && (
          <input
            className="form-control w-50"
            defaultValue={`${user.firstName} ${user.lastName}`}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveUser();
            }}
          />
        )}
      </div>
      <b>Roles:</b> <span>{user.role}</span> <br />
      <b>Login ID:</b> <span>{user.loginId}</span> <br />
      <b>Section:</b> <span>{user.section}</span> <br />
      <b>Total Activity:</b> <span>{user.totalActivity}</span>
      <hr />
      <button
        onClick={() => deleteUser(uid)}
        className="btn btn-danger float-end"
      >
        Delete
      </button>
      <button onClick={onClose} className="btn btn-secondary float-end me-2">
        Cancel
      </button>
    </div>
  );
}
