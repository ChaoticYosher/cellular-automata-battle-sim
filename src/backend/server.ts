import path from "path";
import http from "http";
import express from "express";
import { clientConnection } from "./clientConnection";
//import mysql from 'mysql'

const tmi = require("tmi.js");
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = require("socket.io")(server);

// let db =  mysql.createPool({
//     host: '',
//     user: ',
//     password: '',
//     database: ''
//   });

//set up the routes that point web requests to the right files.
app.use(express.static("/../public"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/index.html"));
});
app.get("/mystyle.css", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/mystyle.css"));
});
app.get("/bundle-front.js", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/bundle-front.js"));
});
app.get("/assets/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/" + req.path));
});

const client = new tmi.Client({
  // options: { debug: true, messagesLogLevel: "info" },
  connections: {
    reconnect: true,
    secure: true,
  },
  channels: ["chaoticyosher"],
});

client.connect();

//start the game communication server to handle player data
clientConnection(io, client);

//start the web server to distribute the games files.
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
