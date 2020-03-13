import socket from 'socket.io';

const createSocket = (http) => {
    const io = socket(http);

    io.on('connection', function() {
        console.log("SOCKET Connected!");
        io.emit('111', 'DDDDDDDDDDD')
    });

    return io;
};

export default createSocket
