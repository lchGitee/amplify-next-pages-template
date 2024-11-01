import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut,user } = useAuthenticator();
  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }
  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}的 todos</h1>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={()=>deleteTodo(todo.id)}>{todo.content}</li>
        ))}
      </ul>
      <div>
        <button onClick={signOut}>Sign Out</button>
      </div>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
