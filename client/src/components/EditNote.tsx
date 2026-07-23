import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateNote.css";
import { useAuth } from "../context/AuthContext";

const EditNote = () => {
  const { id } = useParams();
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [fetchError, setFetchError] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  useEffect(() => {
    async function fetchNote() {
      try {
        setFetchError("");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await res.json();
        if (json.data) {
          setTitle(json.data.title);
          setBody(json.data.body);
        }
      } catch (error) {
        if (error instanceof Error) {
          setFetchError(error.message);
        } else {
          setFetchError(`error ,${error}`);
        }
      }
    }
    fetchNote();
  }, [id]);

  const editNote = async () => {
    const editedNote = {
      title: title,
      body: body,
    };
    try {
      setError("");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedNote),
      });
      const json = await res.json();
      if (json.success) {
        navigate(`/note/${id}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`error, ${error}`);
      }
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
      {fetchError && (
        <div className="errorMessageContainer">
          <p className="errorMessage">Error in getting note :{fetchError}</p>
        </div>
      )}
      <div className="submitButtonConatiner">
        <button className="submitButton" onClick={editNote}>
          Edit
        </button>
      </div>
      {error && (
        <div className="errorMessageContainer">
          <p className="errorMessage">Error in editing the note:{error}</p>
        </div>
      )}
    </div>
  );
};
export default EditNote;
