var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

var chatLists = [];

app.use(express.static('./'));

app.get('/', (req, res) => {
    let filePath = path.join(__dirname + '/index.html');
    return res.sendFile(filePath);
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnect');
    });

    socket.on('send-message', function (data) {
        chatLists.push(data);

        console.log('new-message-from-clinet', data);

        io.emit('new-message', data);
    });

    socket.on('load-message', function (data) {
        io.emit('send-chat-list', { chatLists, request_user_id: data.request_user_id });
    });

});

http.listen(8085, () => {
    console.log('Server Started Running On Port 8085');
});