const express = require("express");
const path = require("path");

const app = express(); // Configurando protocolo http
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public"))); // Definindo pasta de arquivos publicos
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let messages = [];

// Passando conexão
io.on("connection", socket => {
  console.log(`Socket conectado:${socket.id}`);

  socket.emit("previousMessage", messages);

  socket.on("sendMessage", data => {
    messages.push(data); // Colocando as mensagem dentro do array
    socket.broadcast.emit("receivedMessage", data); // Ouvindo todos os navegadores
  });
});

server.listen(3000);
