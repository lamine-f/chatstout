const sqlite3 = require("sqlite3").verbose();
const DB_ENTRY_POINT_PATH = require("path").resolve(process.env.DB_ENTRY_POINT_PATH || "./persistence/chat-app.db");
/*
 * Should implement logic for instance use
*/
let instance = null;
module.exports = getDBInstance = () => {
    if (instance == null) instance = new sqlite3.Database(DB_ENTRY_POINT_PATH);
    return instance;
};
