import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pinRoute from "./routes/pins.js"
import registerRoute from "./routes/users.js";
import cors from "cors";
const app = express()
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: ["Content-Type"],
    credentials: true
  }));
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true}).then(()=>{
    console.log("MongoDB connected");
}).catch((err)=>{
    console.log(err);
});

app.use("/api/pins/",pinRoute);

app.use("/api/users/",registerRoute);

app.listen(8000,()=>{
    console.log("backend server running at port 8000.");
})