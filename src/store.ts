import { create } from "zustand";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type CreateTodo = {
  title: string;
};

type TodoStore = {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  addTodo: (todo: CreateTodo) => Promise<void>;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
};

const URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : "http://localhost:3000/api";

export const useStore = create<TodoStore>((set) => ({
  todos: [],
  fetchTodos: async () => {
    try {
      const response = await fetch(`${URL}/todos`);
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const todos: Todo[] = await response.json();
      set({ todos });
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  },
  addTodo: async (todo) => {
    try {
      const response = await fetch(`${URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error("Failed to create todo");
      }
      const createdTodo: Todo = await response.json();
      set((state) => ({ todos: [...state.todos, createdTodo] }));
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  },
  updateTodo: async (updatedTodo) => {
    try {
      const response = await fetch(`${URL}/todos/${updatedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      const updatedItem: Todo = await response.json();
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === updatedItem.id ? updatedItem : todo
        ),
      }));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  },
  deleteTodo: async (id) => {
    try {
      const response = await fetch(`${URL}/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  },
}));
