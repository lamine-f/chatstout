module.exports = (express) => {
    const { addUser, removeAllUsers } = require("../controllers/userController");
    const router = express.Router();
    router.get("/adduser/:login", (req, res) => process.stdout.write(`Request from ${req.ip} on /adduser/${req.params.login.toLowerCase()} `) & addUser(req, res));
    router.get("/remove/iamroot", (req, res) => process.stdout.write(`Request from ${req.ip} on /remove/iamroot `) & removeAllUsers(req, res));
    return router;
};
