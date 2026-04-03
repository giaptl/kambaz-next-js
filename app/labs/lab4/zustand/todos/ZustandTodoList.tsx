"use client";
import { useTodoStore } from "./useTodoStore";
import { ListGroup, ListGroupItem, Button, FormControl } from "react-bootstrap";

export default function ZustandTodoList() {
  const { todos, todo, setTodo, addTodo, deleteTodo, updateTodo } = useTodoStore(
    (state) => state
  );

  return (
    <div id="wd-todo-list-zustand">
      <h2>Todo List (Zustand)</h2>
      <ListGroup>
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
        {todos.map((t) => (
          <ListGroupItem key={t.id}
                         className="d-flex justify-content-between align-items-center">
            {t.title}
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={() => setTodo(t)}
                      id="wd-set-todo-click">Edit</Button>
              <Button variant="danger" onClick={() => deleteTodo(t.id)}
                      id="wd-delete-todo-click">Delete</Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}