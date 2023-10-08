const {verifyToken} = require('../service/jwt_service');
const redisClient = require('../redis_client');

module.exports = (socket, next, io) => {
    try {
        const token = socket.handshake.headers.auth;

        if (!token) return next(new Error(401))

        const decodeData = verifyToken(token);
        socket.handshake.headers.userId = decodeData.id;
        socket.handshake.headers.userNickname = decodeData.id;

        redisClient.set(userNickname, socket.id, (err, reply) => {
            if (err){
                console.log('Ошибка в socket_auth_middleware, при сохранении данных клиента');
                return next(new Error(500));
            }
        });

        return next();
    } catch (e) {
        return next(new Error(401))
    }
}