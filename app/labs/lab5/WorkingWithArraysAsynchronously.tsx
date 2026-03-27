"use client";
import { TiDelete } from "react-icons/ti";
import { FaPencil } from "react-icons/fa6";
import React, { useState, useEffect } from "react";
import * as client from "./client";
import { FaPlusCircle } from "react-icons/fa";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaTrash } from "react-icons/fa6";
export default function WorkingWithArraysAsynchronously() {

  const [errorMessage, setErrorMessage] = useState(null);

  const [todos, setTodos] = useState<any[]>([]);
  const editTodo = (todo: any) => {
    const updatedTodos = todos.map((t) =>
      t.id === todo.id ? { ...todo, editing: true } : t,
    );
    setTodos(updatedTodos);
  };


  const createNewTodo = async () => {
    const todos = await client.createNewTodo();
    setTodos(todos);
  };

  const postNewTodo = async () => {
    const newTodo = await client.postNewTodo({
      title: "New Posted Todo",
      completed: false,
    });
    setTodos([...todos, newTodo]);
  };

  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    setTodos(todos);
  };


  const deleteTodo = async (todo: any) => {
    try {
        setErrorMessage(null);
      await client.deleteTodo(todo);
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(newTodos);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Error deleting todo");
    }
  };

  const updateTodo = async (todo: any) => {
    try {
        setErrorMessage(null);
      await client.updateTodo(todo);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Error updating todo");
    }
  };

  const removeTodo = async (todo: any) => {
    try {
      setErrorMessage(null);
      const updatedTodos = await client.removeTodo(todo);
      setTodos(updatedTodos);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Error removing todo");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (
        <div
          id="wd-todo-error-message"
          className="alert alert-danger mb-2 mt-2"
        >
          {errorMessage}
        </div>
      )}
      <h4>
        Todos
        <FaPlusCircle
          onClick={createNewTodo}
          className="text-success float-end fs-3"
        />
        <FaPlusCircle
          onClick={postNewTodo}
          className="text-primary float-end fs-3 me-3"
          id="wd-post-todo"
        />
      </h4>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroupItem key={todo.id}>
            <input
              type="checkbox"
              className="form-check-input me-2"
              defaultChecked={todo.completed}
              onChange={(e) =>
                updateTodo({ ...todo, completed: e.target.checked })
              }
            />
            {!todo.editing ? (
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>
            ) : (
              <FormControl
                className="w-50"
                defaultValue={todo.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
                onChange={
                  (e) => updateTodo({ ...todo, title: e.target.value })
                }
              />
            )}
            <TiDelete
              onClick={(e) => {
                e.preventDefault();
                deleteTodo(todo);
              }}
              className="text-danger float-end me-2 fs-3"
              id="wd-delete-todo"
            />

            <FaTrash
              onClick={(e) => {
                e.preventDefault();
                removeTodo(todo);
              }}
              className="text-danger float-end mt-1"
              id="wd-remove-todo"
            />

            <FaPencil
              onClick={() => editTodo(todo)}
              className="text-primary float-end me-2 mt-1"
            />
          </ListGroupItem>
        ))}
      </ListGroup>{" "}
      <hr />
    </div>
  );
}
