import { io } from "../../app";

io.on("connection", (socket) => {
  console.log("usuário conectado");

  socket.on("select-room", (data) => {
    console.log(data);
  });
});
