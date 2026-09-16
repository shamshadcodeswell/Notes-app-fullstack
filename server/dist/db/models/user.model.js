import mongoose, {} from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already in use"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        unique: true,
    },
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=user.model.js.map