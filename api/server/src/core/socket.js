import socket from 'socket.io';

const createSocket = (http) => {
    const io = socket(http);

    io.on('connection', function socketConnect(currentSocket) {
        console.log('SOCKET Connected!');

      io.on('SERVER:NEW_MESSAGE', function messageSocket(message) {
        io.emit('SERVER:NEW_MESSAGE', message)
      });
      io.on('SERVER:UPDATE_MESSAGE', function messageSocket(message) {
        io.emit('SERVER:UPDATE_MESSAGE', message)
      });
      io.on('SERVER:REMOVE_MESSAGE', function messageSocket(messageI) {
        io.emit('SERVER:REMOVE_MESSAGE', messageI)
      });
      currentSocket.on('SERVER:IS_TYPING', (currentUserData) => {
        console.info('currentUserData', currentUserData);
        io.emit('SERVER:IS_TYPING', currentUserData)
      });
    });
    return io;
};

export default createSocket
