import sessionModel from "../db/models/session.model.js";
import userModel, { type userType } from "../db/models/user.model.js";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const userExist: userType = userModel.findOne({ email: email });
    if (userExist) throw new Error("User already exists");

    const session = sessionModel.create({});
  } catch (error) {}
};
