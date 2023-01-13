const socket = io();
const userbox = document.getElementById("users");
let username;
//Allocates username and announces someone joined => Also displays all active users for new member
socket.on("connect", () => {
  if (userbox != null) {
    let user = "";
    while (user == "" || user == null) {
      user = prompt("Select a Username");
    }
    username = user;
    socket.emit("newUser", roomName, username);
    socket.emit("loadUsers", roomName);
    socket.on("loadUsers", (dic) => {
      loadUsers(dic);
    });
  }
});
socket.on("newRoom", (roomName) => {
  updateRooms(roomName);
});
socket.on("newUser", (username) => {
  addMessage("I Joined the Chat", username);
});
//Announces someone left and updates active users dict
socket.on("left", (username, roomName) => {
  addMessage("I left the chat", username);
  socket.emit("loadUsers", roomName);
});

const submit = document.getElementById("submit");
//send message to server through websocket
submit.addEventListener("click", () => {
  const message = document.getElementById("mess");
  socket.emit("message", roomName, message.value, username);
  message.value = "";
});
// triggered when server revieces a message
socket.on("message", (message, user) => {
  addMessage(message, user);
});

socket.on("clearRooms", (roomName) => {
  clearRoom(roomName);
});

function addMessage(message, user) {
  if (user != null) {
    const chatbox = document.getElementById("chat");
    const isScrolledToBottom =
      chatbox.scrollHeight - chatbox.clientHeight <= chatbox.scrollTop + 1;
    const messageBox = document.createElement("div");
    const para = document.createElement("p");
    para.innerText = message;
    para.innerText += "\n" + "--" + user;
    messageBox.style.border = "outset";
    messageBox.style.minHeight = "40px";
    messageBox.style.display = "flex";
    messageBox.style.alignContent = "center";
    messageBox.appendChild(para);
    chatbox.appendChild(messageBox);
    if (isScrolledToBottom) {
      chatbox.scrollTop = 10e9;
    }
  }
}

function loadUsers(dic) {
  const userbox = document.getElementById("users");
  userbox.innerHTML = "";
  for (user in dic) {
    const messageBox = document.createElement("div");
    const para = document.createElement("p");
    para.innerText = "User:" + dic[user];
    messageBox.style.border = "outset";
    messageBox.style.minHeight = "40px";
    messageBox.style.display = "flex";
    messageBox.style.alignContent = "center";
    messageBox.style.width = "100%";
    messageBox.appendChild(para);
    userbox.appendChild(messageBox);
  }
}
function updateRooms(roomName) {
  const roomBox = document.getElementById("room-container");
  if (roomBox == null) {
    console.log("server error");
  }
  const roomNamebox = document.createElement("div", "rooms");
  roomNamebox.setAttribute("id", roomName);
  const link = document.createElement("a");
  const name = document.createElement("p");
  name.innerText = roomName;
  name.style.margin = "0px";
  link.innerText = "Join Room";
  link.href = `/${roomName}`;
  roomNamebox.appendChild(name);
  roomNamebox.appendChild(link);
  roomNamebox.style.display = "flex";
  roomNamebox.style.flexDirection = "column";
  roomNamebox.style.width = "100%";
  roomNamebox.style.borderStyle = "outset";
  roomNamebox.style.height = "50px";
  roomNamebox.style.alignItems = "top";
  roomBox.appendChild(roomNamebox);
}
function loadRoomName(roomName) {
  const title = document.getElementById("title");
  title.innerText = roomName;
}
function clearRoom(roomName) {
  const roomBox = document.getElementById("room-container");
  if (roomBox == null) {
    console.log("server error");
  }
  for (const child of roomBox.children) {
    if (child.id == roomName) {
      removeChild(child);
    }
  }
}
