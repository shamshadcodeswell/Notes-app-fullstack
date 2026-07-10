import noteModel, { type NoteType } from "../db/models/note.model.js";
import type { ApiResponse } from "../types.js";
import type { Request, Response } from "express";

const displayNotes = async (req: Request, res: Response) => {
  try {
    const allTodo = await noteModel.find();
    if (allTodo.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: "no todo exists",
        data: null,
      };

      return res.status(404).json(response);
    }
    const response: ApiResponse<NoteType[]> = {
      success: true,
      message: "retrieval successful",
      data: allTodo,
    };
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message,
        data: null,
      };
      res.status(500).json(response);
    } else {
      const response: ApiResponse<null> = {
        success: false,
        message: "something went wrong",
        data: null,
      };
      res.status(500).json(response);
    }
  }
};
/*-----------------------------------------------------------------------------------------create note-----------------------------------------------------------------------------------------------------------*/
const createNote = async (req: Request, res: Response) => {
  try {
    const note: NoteType = req.body;
    await noteModel.create(note);
    const response: ApiResponse<null> = {
      success: true,
      message: "note created",
      data: null,
    };
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof Error) {
      const response: ApiResponse<null> = {
        success: false,
        message: error.message,
        data: null,
      };
      res.status(500).json(response);
    } else {
      const response: ApiResponse<null> = {
        success: false,
        message: "something went wrong",
        data: null,
      };
      res.status(500).json(response);
    }
  }
};
