"use client";
import { useTodos } from "./todosContext";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";

export default function TodoForm() {
  const { todo, setTodo, addTodo, updateTodo } = useTodos()!;
  return (
    <ListGroupItem className="d-flex justify-content-between align-items-center gap-2">
      <FormControl
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <div className="d-flex gap-2">
        <Button variant="warning" onClick={updateTodo}
                id="wd-update-todo-click">Update</Button>
        <Button variant="success" onClick={addTodo}
                id="wd-add-todo-click">Add</Button>
      </div>
    </ListGroupItem>
  );
}