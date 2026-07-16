import { useState } from "react";
import type { ApiResponse, NewNote } from "../type";
import { useNavigate } from "react-router-dom";
import "./CreateNote.css";
const CreateNote = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const navigate = useNavigate();

  const submitNote = async () => {
    const newNote: NewNote = {
      title: title,
      body: body,
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    });
    const json: ApiResponse<null> = await res.json();
    if (json.success) {
      navigate("/");
    }
  };

  return (
    <div className="createNotePage">
      <div className="titleInput">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
      </div>
      <div className="bodyInput">
        <textarea
          value={body}
          placeholder="Start here..."
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>
      <div className="submitButtonConatiner">
        <button className="submitButton" onClick={submitNote}>
          Create
        </button>
      </div>
    </div>
  );
};
export default CreateNote;
