import noteModel, { type NoteType } from "../db/models/note.model.js";
import type { ApiResponse } from "../types.js";
import type { Request, Response } from "express";
//------------------------------------------------------------------------------------display notes--------------------------------------------------------------------------------------------------------------
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

//--------------------------------------------------------------------------------------------edit note-------------------------------------------------------------------------------------------------------------------------

const editNote = async (req: Request, res: Response) => {
  try {
    const editedNote: NoteType = req.body;
    const note: NoteType | null = await noteModel.findByIdAndUpdate(
      req.params.id,
      editedNote,
      {
        new: true,
      },
    );
    if (!note) {
      const response: ApiResponse<null> = {
        success: false,
        message: "note not found",
        data: null,
      };
      return res.status(404).json(response);
    }
    const response: ApiResponse<null> = {
      success: true,
      message: "edited successfully",
      data: null,
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
//--------------------------------------------------------------------------------------------findandDisplayNote-----------------------------------------------------------------------------------------
const findAndDisplayNote = async (req: Request, res: Response) => {
  try {
    const note: NoteType | null = await noteModel.findById(req.params.id);
    if (!note) {
      const response: ApiResponse<null> = {
        success: false,
        message: "note not found",
        data: null,
      };
      res.status(404).json(response);
      return;
    }
    const response: ApiResponse<NoteType> = {
      success: true,
      message: "retrieval successful",
      data: note,
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
//---------------------------------------------------------------------------------------------------delete note----------------------------------------------------------------------------------------------------
const deleteNote = async (req: Request, res: Response) => {
  try {
    const deletedNote: NoteType | null = await noteModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedNote) {
      const response: ApiResponse<null> = {
        success: false,
        message: "note not found",
        data: null,
      };
      return res.status(404).json(response);
    } else {
      const response: ApiResponse<null> = {
        success: true,
        message: "note deleted",
        data: null,
      };
      res.status(200).json(response);
    }
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

export { displayNotes, createNote, editNote, findAndDisplayNote, deleteNote };
