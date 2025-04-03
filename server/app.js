const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { MONGOURI } = require("./keys");
const Message = require("./models/message"); // Import Message model

const app = express();
const PORT = 2048;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// MongoDB connection
mongoose.connect(MONGOURI);
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

// Import models
require("./models/user");
require("./models/post");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(require("./routes/message")); // Message routes

// Socket.io logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", ({ userId }) => {
    socket.join(userId); // Join a room with user ID
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const message = new Message({ sender: senderId, receiver: receiverId, text });
      await message.save();

      io.to(receiverId).emit("receiveMessage", message);
      io.to(senderId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
