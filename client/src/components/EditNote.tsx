import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateNote.css";

const EditNote = () => {
  const { id } = useParams();
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchNote() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${id}`);
      const json = await res.json();
      if (json.data) {
        setTitle(json.data.title);
        setBody(json.data.body);
      }
    }
    fetchNote();
  }, []);

  const editNote = async () => {
    const editedNote = {
      title: title,
      body: body,
    };
    const res = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedNote),
    });
    const json = await res.json();
    if (json.success) {
      navigate(`/note/${id}`);
    }
  };

  return (
    <div className="createNotePage">
      <div className="titleInput">
        <input
          type="text"
          placeholder="Loading..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
      </div>
      <div className="bodyInput">
        <textarea
          value={body}
          placeholder="Loading..."
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>
      <div className="submitButtonConatiner">
        <button className="submitButton" onClick={editNote}>
          Edit
        </button>
      </div>
    </div>
  );
};
export default EditNote;
