import type { ApiResponse, Note } from "../type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NoteList.css";

const NoteList = () => {
  const [list, setList] = useState<Note[]>([]);
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [filteredList, setFilteredList] = useState<Note[]>([]);
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNotes() {
      const data = await fetch(`${import.meta.env.VITE_API_URL}`);
      const json = await data.json();
      console.log(json);
      if (json.data) {
        setList(json.data);
        setFilteredList(json.data);
      }
    }
    fetchNotes();
  }, []);

  const sortByNewest = () => {
    setFilteredList(
      [...filteredList].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    );
  };
  const sortByOldest = () => {
    setFilteredList(
      [...filteredList].sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      ),
    );
  };

  const searchList = () => {
    setFilteredList(
      [...list].filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  };

  return (
    <div>
      <div className="searchBarContainer">
        <input
          className="searchBar"
          type="text"
          placeholder="Search Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <button className="SearchSumbitButton" onClick={() => searchList()}>
          Search
        </button>
      </div>
      <div className="noteListContainer">
        <div className="topbar">
          <div className="createTaskButtonContainer">
            <button
              className="createTaskButton"
              onClick={() => navigate("/create")}
            >
              Create a note
            </button>
          </div>
          <div className="sortingContainer">
            <button
              className="sortButton"
              onClick={() => setSortOpen(!sortOpen)}
            >
              Sort
            </button>
            <div className={`sortingOptions ${sortOpen ? "show" : ""}`}>
              <button
                onClick={() => {
                  setSortOpen(false);
                  sortByNewest();
                }}
              >
                Date - newest first
              </button>
              <button
                onClick={() => {
                  setSortOpen(false);
                  sortByOldest();
                }}
              >
                Date - oldest first
              </button>
            </div>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <h1 className="emptyMessage">No notes found</h1>
        ) : (
          filteredList.map((note) => (
            <div
              key={note._id}
              className="note"
              onClick={() => navigate(`/note/${note._id}`)}
            >
              <h2 className="noteTitle">{note.title}</h2>
              <div className="noteMeta">
                <h3 className="createdAt">
                  Created :{" "}
                  {new Date(note.createdAt).toLocaleDateString("en-IN")}
                </h3>
                <h3 className="lastModified">
                  Updated :{" "}
                  {new Date(note.updatedAt).toLocaleDateString("en-IN")}
                </h3>
              </div>
              <p className="bodySnippet">{note.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default NoteList;
