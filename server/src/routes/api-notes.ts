import express from "express";
const router = express.Router();

router.route("/api/notes").get().post();
router.route("/api/notes/:id").get().put().delete();
