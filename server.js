//BLINK

const express = require("express");
const app = express();
const path = require("path")
const cors = require("cors")

//Mise en place d'une socket
const http = require('http').createServer(app);
const io = require('socket.io')(http);



// Relative path to a file or directory
const relativePath = './public_html/index.html';

// Get the absolute path
const absolutePath = path.resolve(relativePath);

const corsOptions = {
    origin: ['http://172.16.0.3:8000', 'http://10.7.100.237:8000', 'http://10.106.96.1:8000', '192.168.1.20:8000'],
};
    
app.use(cors(corsOptions));
app.use(express.static('public_html'));

app.get('/', (req, res) => {
    res.sendFile(absolutePath)
});
    



// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');
    // Broadcast the message to all connected clients

    socket.on('s-id', (id_value) => {
        io.emit('start', 'start')
    });


    socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);
        console.log(message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
    console.log('A user disconnected');
    });
});


http.listen(8000, console.log("http://localhost:"+8000));

