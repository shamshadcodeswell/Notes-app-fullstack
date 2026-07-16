import type { ApiResponse, Note } from "../type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NoteList = () => {
  const [list, setList] = useState<Note[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNotes() {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/notes`);
      const json = await data.json();
      if (json.data) {
        setList(json.data);
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
        console.log(isEmpty);
      }
    }
    fetchNotes();
  }, []);

  return (
    <div className="noteListContainer">
      <div className="createTaskButtonContainer">
        <button
          className="createTaskButton"
          onClick={() => navigate("/create")}
        >
          Create a note
        </button>
      </div>

      {isEmpty ? (
        <h1 className="emptyMessage">Your notes are empty</h1>
      ) : (
        list.map((note) => (
          <div key={note._id} className="note">
            <h2 className="noteTitle">{note.title}</h2>
            <h3 className="createdAt">
              Created : {new Date(note.createdAt).toLocaleDateString("en-IN")}
            </h3>
            <h3 className="lastModified">
              Updated : {new Date(note.updatedAt).toLocaleDateString("en-IN")}
            </h3>
            <p className="bodySnippet">{note.body}</p>
          </div>
        ))
      )}
    </div>
  );
};
export default NoteList;
