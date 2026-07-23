import type { Note } from "../type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NoteList.css";
import { useAuth } from "../context/AuthContext";

const NoteList = () => {
  const [list, setList] = useState<Note[]>([]);
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [filteredList, setFilteredList] = useState<Note[]>([]);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  useEffect(() => {
    async function fetchNotes() {
      try {
        setError("");
        const data = await fetch(`${import.meta.env.VITE_API_URL}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const json = await data.json();
        if (json.data) {
          setList(json.data);
          setFilteredList(json.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`Error in retrieving notes ${error}`);
        }
      } finally {
        setLoading(false);
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

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shimmerNote">
              <div className="shimmerLine shimmerTitle"></div>
              <div className="shimmerLine shimmerMeta"></div>
              <div className="shimmerLine shimmerBody"></div>
              <div className="shimmerLine shimmerBodyShort"></div>
            </div>
          ))
        ) : error ? (
          <div className="errorMessageContainer">
            <p className="errorMessage">Error in retrieving notes:{error}</p>
          </div>
        ) : filteredList.length === 0 ? (
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
