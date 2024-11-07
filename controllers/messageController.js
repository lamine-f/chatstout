const getDBInstance = require("../config/db");
const SQLEscape = value => value.replace(/"/g, '""').replace(/`/g, '``').replace(/'/g, "''");

const sendMessage = (message) => {
    const parsedMessage = JSON.parse(message);
    const userLogin = SQLEscape(parsedMessage.name.toLowerCase());
    const messageValue = SQLEscape(parsedMessage.message);
    const db = getDBInstance();
    db.run(
        "INSERT INTO messages(to_login, value) VALUES (?, ?)",
        [userLogin, messageValue],
        err => err && console.error("Database error:", err)
    );
};

module.exports = { sendMessage };