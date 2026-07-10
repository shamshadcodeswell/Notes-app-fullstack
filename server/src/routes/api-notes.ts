import {
  displayNotes,
  createNote,
  editNote,
  findAndDisplayNote,
  deleteNote,
} from "../controllers/notesController.js";

import express from "express";
const notesRouter = express.Router();

notesRouter.route("").get(displayNotes).post(createNote);
notesRouter
  .route("/:id")
  .get(findAndDisplayNote)
  .put(editNote)
  .delete(deleteNote);

export default notesRouter;
