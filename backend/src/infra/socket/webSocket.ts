import { io } from "../../app";
import { PrismaClient } from "@prisma/client";

interface User {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  text: string;
  room: string;
  create_at: Date;
  username: string;
  status: number;
}

const users: Array<User> = [];
const prismaC = new PrismaClient();

io.on("connection", (socket) => {
  socket.on("select_room", async (data, callback) => {
    console.log("esse código foi executado", data, callback);
    socket.join(data.room);

    const userIsInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userIsInRoom) {
      userIsInRoom.socket_id = socket.id;
    } else {
      users.push({
        room: data.room,
        username: data.username,
        socket_id: socket.id,
      });
    }

    try {
      io.to(data.room).emit("useronline", users);
      const messages = await prismaC.message.findMany({
        where: {
          room: data.room,
        },
      });
      const dataResponse = {
        messageRoom: messages,
        userRoom: users.filter((user) => user.room === data.room),
      };
      callback(dataResponse);
    } catch (error) {
      socket.emit("useronline", users);
    }
  });
  socket.on("message", async (data) => {
    const message: Message = {
      text: data.message,
      room: data.room,
      create_at: new Date(),
      username: data.Username,
      status: 200,
    };

    try {
      await prismaC.message.create({
        data: message,
      });
      io.to(data.room).emit("message", message);
    } catch (error) {
      message.status = 500;
      message.username = "error";
      message.text = "erro ao acessar o banco" + error;
      socket.emit("message", message);
    }
  });
});
