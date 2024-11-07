const { response } = require("express");
const getDBInstance = require("../config/db");

const addUser = (req, res) => {
    const userLogin = req.params.login.toLowerCase();
    const db = getDBInstance();
    db.get("SELECT login FROM users WHERE LOWER(login) = ?", [userLogin], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (row) return res.status(409).json({ message: "User alredy exists" });
        db.run("INSERT INTO users(login) VALUES (?)", [userLogin], (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.status(201).json({ data: userLogin, message: "User created" });
        });
    });
};

const removeAllUsers = (_, res) => {
    const db = getDBInstance();
    db.serialize(() => {
        db.run("DELETE FROM messages", () => 
            db.run("DELETE FROM users", () => {
                    let response = { message: "cleaned" };
                    res.status(200).json(response); 
                    process.stdout.write(`have response: ${JSON.stringify(response)}\n`)
                }
            )
        );
    });
};

module.exports = { addUser, removeAllUsers };
