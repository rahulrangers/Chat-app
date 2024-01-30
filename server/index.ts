import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import User from "./db/user";
import Message from "./db/msg";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const Secret = "hackme";
const app = express();
async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://rahulreddy6118:rahul2004@cluster0.vuuiiev.mongodb.net/chat-app?retryWrites=true&w=majority"
    );
  } catch (error) {
    console.log(error);
  }
}
connect();

app.use(bodyParser.json());
app.use(cors());
const httpserver = createServer(app);
const io = new Server(httpserver, {
  cors: {
    origin: "http://localhost:5173"
  }
});
app.get("/users", async (req, res) => {
  const users = await User.find({});

  res.json({ users });
});
app.post("/signin", async (req: Request, res: Response) => {
  const { name, password } = req.body;

  try {
    const user = await User.create({
      name: name,
      password: password
    });
    res.status(200).json({
      message: "successfully created the account",
      name: req.body.name,
      _id:user._id
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name: name });
  if (user) {
    if (user.password != undefined)
      if (user.password == password) {
        if (typeof Secret === "string") {
          const token = jwt.sign({ name }, Secret);
          res.json({ message: "Logged in successfully", token, user: user, success: true });
        }
      } else {
        res.status(400).json({ msg: "please enter correct password", success: false });
      }
  } else {
    res.status(400).json({ msg: "user doesn't exist", token: "", success: false });
  }
});
app.post("/addmsg", async (req, res) => {
  const { sender, reciever, message } = req.body;
  const msg = await Message.findOneAndUpdate({ user1: sender, user2: reciever }, { $push: { messagesUser1: message,messagesUser2:" " } },{ new: true });
  if (msg) {
    res.status(200).json({ msg });
  }
  if (!msg) {
    const msg2 = await Message.findOneAndUpdate({ user1: reciever, user2: sender }, { $push: { messagesUser1:" ", messagesUser2: message } },{ new: true });
    if (msg2) {
      res.status(200).json({ msg2 });
    } else {
      const newmsg = await Message.create({ user1: sender, user2: reciever, messagesUser1: [message], messagesUser2: [" "] });
      res.status(200).json({ newmsg });
    }
  }
});
app.post("/msg", async (req, res) => {
  const { sender, reciever } = req.body;
  const msg = await Message.findOne({ user1: sender, user2: reciever });
  if (msg) {
    res.status(200).json({ success: true, sendermsg: msg.messagesUser1, recievermsg: msg.messagesUser2 });
  }
  if (!msg) {
    const msg2 = await Message.findOne({ user1: reciever, user2: sender });
    if (msg2) {
      res.status(200).json({ success: true, sendermsg: msg2.messagesUser2, recievermsg: msg2.messagesUser1 });
    } else {
      res.status(404).json({ success: false, error: "no old msgs found" });
    }
  }
});
io.on("connection", async (socket: Socket) => {
  console.log("connected");
  const userid = socket.handshake.auth.id;
  console.log(userid);
  if (userid) {
    const user = await User.findById(userid);
    await User.findByIdAndUpdate(userid, { $set: { is_online: true } });
    if (user) {
      console.log(user.name + " connected");
      socket.on("disconnect", async () => {
        await User.findByIdAndUpdate(userid, { $set: { is_online: false } });
        console.log(user.name + " disconnected");
      });
    }
  }

  socket.on("newchat", data => {
    console.log("this is data", data);
    socket.broadcast.emit("newchat", data);
  });
});

httpserver.listen(5000, () => {
  console.log("listening to port 5000");
});
