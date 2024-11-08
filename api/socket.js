const { Server } = require("socket.io");
const { chatSocket } = require("../imports");

let io;
export default function handler(req, res) {
    if (!io) {
        io = new Server(res.socket.server);
        chatSocket(io);
        res.socket.server.io = io;
    }
    res.end();
}