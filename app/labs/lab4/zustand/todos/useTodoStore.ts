import { create } from "zustand";

interface Todo {
  id: string;
  title: string;
}

interface TodoState {
  todos: Todo[];
  todo: Todo;
  setTodo: (todo: Todo) => void;
  addTodo: () => void;
  deleteTodo: (id: string) => void;
  updateTodo: () => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ],
  todo: { id: "-1", title: "Learn Mongo" },

  setTodo: (todo) => set({ todo }),

  addTodo: () => set((state) => ({
    todos: [...state.todos, { ...state.todo, id: new Date().getTime().toString() }],
    todo: { id: "-1", title: "" },
  })),

  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter((t) => t.id !== id),
  })),

  updateTodo: () => set((state) => ({
    todos: state.todos.map((t) => (t.id === state.todo.id ? state.todo : t)),
    todo: { id: "-1", title: "" },
  })),
}));