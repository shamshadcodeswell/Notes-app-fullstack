import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Note } from "../type";
import "./NotePage.css";
import { useNavigate } from "react-router-dom";

const NotePage = () => {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const navigate = useNavigate();
  const [fetchError, setFetchError] = useState<string>("");
  const [deleteError, setDeleteError] = useState<string>("");

  useEffect(() => {
    async function fetchNote() {
      try {
        setFetchError("");
        const data = await fetch(`${import.meta.env.VITE_API_URL}/${id}`);
        const json = await data.json();
        setNote(json.data);
      } catch (error) {
        if (error instanceof Error) {
          setFetchError(error.message);
        } else {
          setFetchError(`Error in creating the note ${error}`);
        }
      }
    }
    fetchNote();
  }, [id]);

  const deleteNote = async () => {
    try {
      setDeleteError("");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError(`Error in creating the note ${error}`);
      }
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
          {deleteError && (
            <div className="errorMessageContainer">
              <p className="errorMessage">
                Error in deleting the note:{deleteError}
              </p>
            </div>
          )}
        </div>
        {fetchError && (
          <div className="errorMessageContainer">
            <p className="errorMessage">
              Error in fetching the note:{fetchError}
            </p>
          </div>
        )}
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
        <h1 className="Title">{note ? note.title : "loading..."}</h1>

        <p className="body">{note ? note.body : "loading"}</p>
      </div>
    </div>
  );
};
export default NotePage;
