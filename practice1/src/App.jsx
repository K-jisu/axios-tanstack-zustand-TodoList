import React, { useState, useEffect } from "react";
import api from "./axios/api";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

function App() {
  const [todo, setTodo] = useState("");
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const queryClient = useQueryClient();

  const fetchTodos = async () => {
    const { data } = await api.get("/todos");
    return data;
  };

  const addTodo = async (newTodo) => {
    await api.post("/todos", newTodo);
  };

  const removeTodo = async (targetId) => {
    await api.delete("/todos/" + targetId);
  };

  const updateTodo = async ( {editId, editTitle} ) => {
    await api.patch(`/todos/${editId}`, { title: editTitle });
  };

  const {
    data: todos,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    // select: (todos) => {
    //   return todos.map((todo) => {
    //     return { ...todo, test: 1 };
    //   });
    // },
    placeholderData: keepPreviousData,
  });

  const { mutate: addMutate } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const { mutate: removeMutate } = useMutation({
    mutationFn: removeTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      // console.log("업데이트 성공");
      queryClient.invalidateQueries(["todos"]);
    },
  });

  if (isPending) {
    return <div>로딩중</div>;
  }
  if (isError) {
    return <div>오류가 발생했습니다.</div>;
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addMutate({ title: todo, isDone: false });
        }}
      >
        <input
          type="text"
          value={todo}
          onChange={(e) => {
            return setTodo(e.target.value);
          }}
        />
        <button type="submit">제출</button>
        <input
          type="text"
          value={editId}
          placeholder="변경할 id입력"
          onChange={(e) => setEditId(e.target.value)}
        />
        <input
          type="text"
          value={editTitle}
          placeholder="변경할 제목입력"
          onChange={(e) => setEditTitle(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            // console.log(editId, editTitle);
            updateMutate({ editId, editTitle });
          }}
        >
          수정
        </button>
      </form>

      {todos?.map((todo) => {
        return (
          <div key={todo.id} style={{ display: "flex", gap: "10px" }}>
            <h4>{todo.title}</h4>
            <p>{todo.isDone ? "Done" : "Not Done"}</p>
            <button
              onClick={() => {
                removeMutate(todo.id);
              }}
            >
              삭제
            </button>
          </div>
        );
      })}
    </>
  );
}

export default App;
