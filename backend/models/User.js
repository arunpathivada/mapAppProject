import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 20,
        required:true,
        unique:true
    },
    email: {
        type: String,
        max: 50,
        required:true,
        unique:true
        },
    password: {
        type: String,
        max: 50,
        required:true,
        unique:true
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;
