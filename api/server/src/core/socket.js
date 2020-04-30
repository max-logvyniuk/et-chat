import socket from 'socket.io';

const createSocket = (http) => {
  const io = socket(http);

  io.on('connection', function socketConnect(currentSocket) {
    console.info('SOCKET Connected!');
    currentSocket.on('SERVER:IS_TYPING', (currentUserData) => {
      io.emit('SERVER:IS_TYPING', currentUserData)
    });
  });
  return io;
};

export default createSocket
