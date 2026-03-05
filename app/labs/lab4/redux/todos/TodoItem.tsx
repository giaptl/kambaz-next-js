"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { ListGroupItem, Button } from "react-bootstrap";

export default function TodoItem({
  todo,
}: {
  todo: { id: string; title: string };
}) {
  const dispatch = useDispatch();
  return (
    <ListGroupItem
      key={todo.id}
      className="d-flex justify-content-between align-items-center"
    >
      {todo.title}
      <div className="d-flex gap-2">
        <Button onClick={() => dispatch(setTodo(todo))} id="wd-set-todo-click">
          {" "}
          Edit{" "}
        </Button>
        <Button
          className="btn btn-danger d-flex gap-2"
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
        >
          {" "}
          Delete{" "}
        </Button>
      </div>
    </ListGroupItem>
  );
}
