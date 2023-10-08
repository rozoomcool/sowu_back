const redisClient = require('../redis_client');

function connectionHandler (sock, io) {
    io.emit('message', sock.handshake.headers.socketId);
    
    socket.on('private_message', (data) => {
        redisClient.get(data.recipientNickname,(err, recipientSocketId) => {
            if (err) {
              console.error(err);
              return;
            }
            if (recipientSocketId) {
              io.to(recipientSocketId).emit('message', { message });
            } else {
              console.error(`Пользователь ${recipientNickname} не найден.`);
            }
          });
    });
}

module.exports = connectionHandler