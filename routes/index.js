const INDEX_FILE_PATH = require("path").resolve(process.env.INDEX_FILE_PATH || "./public/index.html") ;
const getUserRoutes = require("./userRoutes");    
module.exports = (express) => {
    const router = express.Router();
    router.get("/", (req, res) => process.stdout.write(`Request from ${req.ip} on / `) & res.sendFile(INDEX_FILE_PATH) & process.stdout.write(`have response ${INDEX_FILE_PATH} \n`));
    router.use(express.static("public"));
    router.use("/", getUserRoutes(express));
    return router;
};
