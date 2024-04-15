const socket = io();

const urlParams = new URLSearchParams(window.location.search);

const username = urlParams.get("username");
const room = urlParams.get("select-row");

socket.emit("select_room", { username, room }, (dataResponse) => {
  console.log(dataResponse)
  dataResponse.messageRoom.forEach((message) => createMessage(message));
  createUsersOnline(dataResponse.userRoom);
});

const createUsersOnline = (data) => {
  const ulUser = document.getElementById("online");
  ulUser.innerHTML = "";

  data.forEach((user) => {
    if (user.username != null) {
      ulUser.innerHTML += `<li><a href="#">${user.username}</a></li>`;
    }
  });
};

const messageInput = document.getElementById("message_input")

messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    emitMessage()
  }
})

document.getElementById("button_submit").addEventListener("click", (event) => {
  emitMessage()
})

const emitMessage = () => {
  if (messageInput.value !== "") {
    const message = messageInput.value;

    const data = {
      username,
      room,
      message
    }

    console.log(data)

    socket.emit("message", data)
    messageInput.value = ""
  }
}

socket.on("message", (data) => {
  createMessage(data)
})

const createMessage = (data) => {
  const MessageDiv = document.getElementById("message-container");

  if (username === data.username) {
    MessageDiv.innerHTML += `<div class="user-message message">
    <span class="name">${data.username}</span>
    <p>${data.text}</p>
    <span class="data">${dayjs(data.create_at).format("DD/MM HH:mm")}</span>
    </div>`;
  } 
  else if(data.status === 500){
    MessageDiv.innerHTML += `<div class="error-message message">
    <span class="name">${data.username}</span>
    <p>${data.text}</p>
    <span class="data">${dayjs(data.create_at).format("DD/MM HH:mm")}</span>
    </div>`;
  }
  else {
    MessageDiv.innerHTML += `<div class="other-message message">
    <span class="name">${data.username}</span>
    <p>${data.text}</p>
    <span class="data">${dayjs(data.create_at).format("DD/MM HH:mm")}</span>
    </div>`;
  }
};


