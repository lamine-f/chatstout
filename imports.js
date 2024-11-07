module.exports = {
    express: require("express"),
    http: require("http"),
    socketIO: require("socket.io"),
    getMainRoutes: require("./routes/index"),
    chatSocket: require("./sockets/chatSocket"),
}