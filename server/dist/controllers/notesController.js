import noteModel, {} from "../db/models/note.model.js";
//------------------------------------------------------------------------------------display notes--------------------------------------------------------------------------------------------------------------
const displayNotes = async (req, res) => {
    try {
        const allTodo = await noteModel.find({ user: req.userId });
        if (allTodo.length === 0) {
            const response = {
                success: false,
                message: "no todo exists",
                data: null,
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            message: "retrieval successful",
            data: allTodo,
        };
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            const response = {
                success: false,
                message: error.message,
                data: null,
            };
            res.status(500).json(response);
        }
        else {
            const response = {
                success: false,
                message: "something went wrong",
                data: null,
            };
            res.status(500).json(response);
        }
    }
};
/*-----------------------------------------------------------------------------------------create note-----------------------------------------------------------------------------------------------------------*/
const createNote = async (req, res) => {
    try {
        const note = {
            user: req.userId,
            title: req.body.title,
            body: req.body.body,
        };
        await noteModel.create(note);
        const response = {
            success: true,
            message: "note created",
            data: null,
        };
        res.status(201).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            const response = {
                success: false,
                message: error.message,
                data: null,
            };
            res.status(500).json(response);
        }
        else {
            const response = {
                success: false,
                message: "something went wrong",
                data: null,
            };
            res.status(500).json(response);
        }
    }
};
//--------------------------------------------------------------------------------------------edit note-------------------------------------------------------------------------------------------------------------------------
const editNote = async (req, res) => {
    try {
        const editedNote = req.body;
        const note = await noteModel.findOneAndUpdate({ _id: req.params.id, user: req.userId }, editedNote, {
            new: true,
        });
        if (!note) {
            const response = {
                success: false,
                message: "note not found",
                data: null,
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            message: "edited successfully",
            data: null,
        };
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            const response = {
                success: false,
                message: error.message,
                data: null,
            };
            res.status(500).json(response);
        }
        else {
            const response = {
                success: false,
                message: "something went wrong",
                data: null,
            };
            res.status(500).json(response);
        }
    }
};
//--------------------------------------------------------------------------------------------findandDisplayNote-----------------------------------------------------------------------------------------
const findAndDisplayNote = async (req, res) => {
    try {
        const note = await noteModel.findOne({
            _id: req.params.id,
            user: req.userId,
        });
        if (!note) {
            const response = {
                success: false,
                message: "note not found",
                data: null,
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            success: true,
            message: "retrieval successful",
            data: note,
        };
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Error) {
            const response = {
                success: false,
                message: error.message,
                data: null,
            };
            res.status(500).json(response);
        }
        else {
            const response = {
                success: false,
                message: "something went wrong",
                data: null,
            };
            res.status(500).json(response);
        }
    }
};
//---------------------------------------------------------------------------------------------------delete note----------------------------------------------------------------------------------------------------
const deleteNote = async (req, res) => {
    try {
        const deletedNote = await noteModel.findOneAndDelete({
            _id: req.params.id,
            user: req.userId,
        });
        if (!deletedNote) {
            const response = {
                success: false,
                message: "note not found",
                data: null,
            };
            return res.status(404).json(response);
        }
        else {
            const response = {
                success: true,
                message: "note deleted",
                data: null,
            };
            res.status(200).json(response);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            const response = {
                success: false,
                message: error.message,
                data: null,
            };
            res.status(500).json(response);
        }
        else {
            const response = {
                success: false,
                message: "something went wrong",
                data: null,
            };
            res.status(500).json(response);
        }
    }
};
export { displayNotes, createNote, editNote, findAndDisplayNote, deleteNote };
//# sourceMappingURL=notesController.js.map