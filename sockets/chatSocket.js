const getDBInstance = require("../config/db");
const { sendMessage } = require("../controllers/messageController");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`Socket client connected from ${socket.handshake.address} `);
        socket.on("handCheck", (userId) => {
            const db = getDBInstance();
            db.all("SELECT * FROM messages", (err, rows) => {
                if (err) return console.error("Database error:", err);
                const data = JSON.stringify(rows.map(row => ({ name: row.to_login, message: row.value })));
                io.to(userId).emit("start", data);
                console.log(`Socket client retrieving all message from ${socket.handshake.address} `);
            });
        });

        socket.on("sendMessage", (message) => {
            io.emit("receiveMessage", message);
            sendMessage(message); // Sauvegarde le message en utilisant le contrôleur
        });
    });
};