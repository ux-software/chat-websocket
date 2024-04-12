import { io } from "../../app";

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
}

const users: Array<User> = [];
const messages: Array<Message> = [];

io.on("connection", (socket) => {
  socket.on("select_room", (data, callback) => {
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

    io.to(data.room).emit("useronline", users);

    const dataResponse = {
      messageRoom: messages.filter((message) => message.room === data.room),
      userRoom: users.filter((user) => user.room === data.room),
    };

    callback(dataResponse);
  });
  socket.on("message", (data) => {
    // Criando a mensagem
    const message: Message = {
      text: data.message,
      room: data.room,
      create_at: new Date(),
      username: data.username,
    };

    // Adicionando a mensagem ao array de mensagens
    messages.push(message);

    // Emitindo a mensagem para todos os usuários da sala
    io.to(data.room).emit("message", message);
  });
});
