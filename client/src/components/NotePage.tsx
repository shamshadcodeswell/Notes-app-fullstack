import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Note } from "../type";
import "./NotePage.css";
import { useNavigate } from "react-router-dom";

const NotePage = () => {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNote() {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/${id}`);
      const json = await data.json();
      setNote(json.data);
    }
    fetchNote();
  }, []);

  const deleteNote = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.success) {
      navigate("/");
    }
  };

  return (
    <div className="NotePage">
      <div className="topBar">
        <div className="actions">
          <button
            className="editButton"
            onClick={() => navigate(`/note/edit/${id}`)}
          >
            Edit
          </button>
          <button className="deleteButton" onClick={deleteNote}>
            delete
          </button>
        </div>
        <div className="dates">
          <h2 className="createdAt">
            {" "}
            Created :{" "}
            {note?.createdAt ? new Date(note.createdAt).toDateString() : ""}
          </h2>
          <h2 className="updatedAt">
            Last Updated :
            {note?.updatedAt ? new Date(note.updatedAt).toDateString() : ""}
          </h2>
        </div>
      </div>
      <div className="Note">
        <h1 className="Title">{note?.title}</h1>

        <p className="body">{note?.body}</p>
      </div>
    </div>
  );
};
export default NotePage;
