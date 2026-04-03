"use client";
import { useTodos } from "./todosContext";
import { ListGroupItem, Button } from "react-bootstrap";

export default function TodoItem({ todo }: { todo: { id: string; title: string } }) {
  const { deleteTodo, setTodo } = useTodos()!;
  return (
    <ListGroupItem className="d-flex justify-content-between align-items-center"
                   key={todo.id}>
      {todo.title}
      <div className="d-flex gap-2">
        <Button variant="primary" onClick={() => setTodo(todo)}
                id="wd-set-todo-click">Edit</Button>
        <Button variant="danger" onClick={() => deleteTodo(todo.id)}
                id="wd-delete-todo-click">Delete</Button>
      </div>
    </ListGroupItem>
  );
}