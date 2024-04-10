const socket = io();

const urlParams = new URLSearchParams(window.location.search);

const username = urlParams.get("username");
const room = urlParams.get("select-row");

socket.emit("select-room", { username, room });

socket.emit("hello", { name: "Jhonatas" });
