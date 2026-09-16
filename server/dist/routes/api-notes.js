import { displayNotes, createNote, editNote, findAndDisplayNote, deleteNote, } from "../controllers/notesController.js";
import { authenticate } from "../middleware/authenticate.js";
import express from "express";
const notesRouter = express.Router();
notesRouter.use(authenticate);
notesRouter.route("").get(displayNotes).post(createNote);
notesRouter
    .route("/:id")
    .get(findAndDisplayNote)
    .put(editNote)
    .delete(deleteNote);
export default notesRouter;
//# sourceMappingURL=api-notes.js.map