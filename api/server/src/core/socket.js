import socket from 'socket.io';
import http from 'http';

export default (http) => {
    const io = socket(http);

    io.on('connection', function(socket) {
        console.log("SOCKET Connected!");
        socket.emit('111', 'DDDDDDDDDDD')
    })

    return io;
};