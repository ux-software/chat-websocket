const socket = io();

const urlParams = new URLSearchParams(window.location.search);

const username = urlParams.get("username");
const room = urlParams.get("select-row");

const createMessage = (data) => {
  const MessageDiv = document.getElementById("message-container");

  if (username === data.username) {
    MessageDiv.innerHTML += `<div class="user-message message">
    <span class="name">${data.username}</span>
    <p>${data.text}</p>
    <span class="data">${dayjs(data.create_at).format("DD/MM HH:mm")}</span>
    </div>`;
  } else {
    MessageDiv.innerHTML += `<div class="other-message message">
    <span class="name">${data.username}</span>
    <p>${data.text}</p>
    <span class="data">${dayjs(data.create_at).format("DD/MM HH:mm")}</span>
    </div>`;
  }
};

const createUsersOnline = (data) => {
  const ulUser = document.getElementById("online");
  ulUser.innerHTML = "";

  data.forEach((user) => {
    if (user.username != null) {
      ulUser.innerHTML += `<li><a href="#">${user.username}</a></li>`;
    }
  });
};

socket.emit("select_room", { username, room }, (dataResponse) => {
  dataResponse.messageRoom.forEach((message) => createMessage(message));
  createUsersOnline(dataResponse.userRoom);
});
