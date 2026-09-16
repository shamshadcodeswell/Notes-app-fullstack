import mongoose, {} from "mongoose";
const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    refreshTokenHash: {
        type: String,
    },
    ip: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    revoked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
export default mongoose.model("Session", sessionSchema);
//# sourceMappingURL=session.model.js.map