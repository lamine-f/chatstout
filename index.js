const { express, getMainRoutes } = require("./imports");
const app = express();

app.use("/", getMainRoutes(express));

module.exports = app;
