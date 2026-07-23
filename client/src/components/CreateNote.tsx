import { useState } from "react";
import type { ApiResponse, NewNote } from "../type";
import { useNavigate } from "react-router-dom";
import "./CreateNote.css";
import { useAuth } from "../context/AuthContext";

const CreateNote = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { accessToken } = useAuth();

  const navigate = useNavigate();

  const submitNote = async () => {
    if (title.trim() === "" || body.trim() === "") {
      setError("Enter appropriate title and body for the note");
      return;
    }
    const newNote: NewNote = {
      title: title,
      body: body,
    };
    try {
      setError("");
      const res = await fetch(`${import.meta.env.VITE_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newNote),
      });
      const json: ApiResponse<null> = await res.json();
      if (json.success) {
        navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`Error in creating the note ${error}`);
      }
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
      <div className="submitButtonContainer">
        <button className="submitButton" onClick={submitNote}>
          Create
        </button>
      </div>
      {error && (
        <div className="errorMessageContainer">
          <p className="errorMessage">Error in creating the note :{error}</p>
        </div>
      )}
    </div>
  );
};
export default CreateNote;
