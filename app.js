const {express,  http, socketIO, chatSocket, getMainRoutes} = require("./imports")
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
chatSocket(io);

app.use("/", getMainRoutes(express));

const SERVER_PORT = process.env.SERVER_PORT || 8000;
server.listen(SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${SERVER_PORT}`);
});