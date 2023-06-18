
const escaped = (value) => {
    return value.replace(/"/g, '""').replace(/`/g, '``').replace(/'/g, "''");
} 
    
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const sqlite3 = require('sqlite3').verbose();

// Mise en place d'une socket
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Chemin relatif vers un fichier ou un répertoire
const relativePath = './public/index.html';

// Obtenez le chemin absolu
const absolutePath = path.resolve(relativePath);

const corsOptions = {
    origin: ['http://172.16.0.3:8000', 'http://10.7.100.237:8000', 'http://10.106.96.1:8000', '192.168.1.20:8000'],
};

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(absolutePath);
});

app.get('/adduser/:login', (req, res) => {
    const user_login = req.params.login.toLowerCase();
    const db = new sqlite3.Database(path.resolve("./database/chat-app.db"));
    db.serialize(() => {
        let valid = true;
        db.all('SELECT login FROM users', (err, rows) => {
            if (err) {
                console.error(err);
            } else {
                console.log(rows);
                rows.forEach(row => {
                    if (row.login.toLowerCase() == user_login) {
                        valid = false;
                        res.send({ valid });
                    }
                });
                if (valid) {
                    db.run(`INSERT INTO users(login) VALUES ('${user_login}')`);
                    res.send({ login: user_login, valid });
                }
            }
            db.close();
        });
    });
});

app.get('/remove/iamroot', (req, res) => {
    const db = new sqlite3.Database(path.resolve("./database/chat-app.db"));
    db.serialize(() => {
        db.run('DELETE FROM messages WHERE 1');
        db.run('DELETE FROM users WHERE 1');
    });
    res.send({ valid: true });
});

// Gérer les connexions socket.io
io.on('connection', (socket) => {
    console.log('A user connected');
    let data = null;

    // Diffuser le message à tous les clients connectés
    socket.on('s-id', (userId) => {
        const db = new sqlite3.Database(path.resolve("./database/chat-app.db"));
        db.serialize(() => {
            db.all('SELECT * FROM messages', (err, rows) => {
                if (err) {
                    console.error(err);
                } else {
                    // console.log(rows);
                    data = JSON.stringify(rows.map((row) => ({ name: row.to_login, message: row.value })));
                    io.to(userId).emit('start', data);
                }
                db.close();
            });
        });
    });

    socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);

        const user_login = escaped(JSON.parse(message).name.toLowerCase());
        const value = escaped(JSON.parse(message).message);
        const db = new sqlite3.Database(path.resolve("./database/chat-app.db"));
        db.serialize(() => {
            db.run(`INSERT INTO messages(to_login, value) VALUES ('${user_login}', '${value}')`);
        });
        console.log(message);
    });

    /*
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
    */
});

http.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});
