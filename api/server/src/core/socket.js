import socket from 'socket.io';

const createSocket = (http) => {
    const io = socket(http);

    io.on('connection', function socketConnect() {
        console.log('SOCKET Connected!');

      io.on('SERVER:NEW_MESSAGE', function messageSocket(message) {
        io.emit('SERVER:NEW_MESSAGE', message)
      });
      io.on('SERVER:REMOVE_MESSAGE', function messageSocket(message) {
        io.emit('SERVER:REMOVE_MESSAGE', message)
      });
      io.on('SERVER:UPDATE_MESSAGE', function messageSocket(message) {
        io.emit('SERVER:UPDATE_MESSAGE', message)
      })
    });
    return io;
};

export default createSocket
