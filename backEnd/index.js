import Express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/definedRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

import http from "http";
import { createServer } from "http";
import { Server } from "socket.io";

import path from "path";

//Initialize dotenv Access
dotenv.config();
const __dirname = path.resolve();
const port = process.env.API_PORT || process.env.MY_PORT;
const socketPort = 3000;
const mongoDBUrl = process.env.MONGODB_URL;
const allowedUrls = process.env.ALLOWED_URLS_FOR_SOCKET;

// Initialize Express
const app = Express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedUrls, // Allow requests from this origin
    methods: ["GET", "POST"],
  },
});

app.use(Express.json());

// Define the URLs which are allowed to access backend
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedUrls.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
  })
);

// Connect MongoDb via Mongoose
mongoose
  .connect(mongoDBUrl)
  .then(() => {
    console.log("DB Connection Successful!");
    // Set up MongoDB Change Streams
    const changeStream = mongoose.connection.collection("myusers").watch();

    changeStream.on("change", (change) => {
      const userId = change.documentKey._id.toString();
      // console.log(userId);

      if (userId) {
        // Broadcast the change only to the specific user's room
        io.to(userId).emit("dataChange", change.updateDescription);
      }
    });
  })
  .catch((err) => {
    console.log("DB Connection Failed", err.message);
  });

//   Define Routes (This is a Middleware,   app.use(middleware_Name) )
app.use("/", userRouter);

app.use(Express.static(path.join(__dirname, "/frontend/dist")));

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Inatennal Server Error";
  res.status(status).send({
    success: false,
    status,
    message,
  });
});

// Serve the main HTML file for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Express is listening on port ${port}`);
});

io.on("connection", (socket) => {
  // console.log("A user connected");

  // Listen for user ID when a user connects
  socket.on("userId", (userId) => {
    // console.log(`User ${userId} connected`);

    // Join a room based on the user ID
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

server.listen(socketPort, () => {
  console.log(`Socket.io server is running on http://localhost:${socketPort}`);
});
