require('dotenv').config();

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

module.exports.generateAccessToken = (id, nickname) => {
    const payload = {
        id,
        nickname
    };
    return jwt.sign(payload, secretKey, {expiresIn: 1000 * 60});
}

module.exports.generateRefreshToken = (id) => {
    const payload = {
        id
    };
    return jwt.sign(payload, refreshSecretKey, {expiresIn: 3600*24*3});
}

module.exports.verifyToken = (token) => {
    try{
        return jwt.verify(token, secretKey);
    } catch (e) {
        console.log(`'error in verifyRefreshToken' ${e}`);
    }
}

module.exports.verifyRefreshToken = (token) => {
    try{
        return jwt.verify(token, refreshSecretKey);
    } catch (e) {
        console.log(`'error in verifyRefreshToken ${e}'`);
    }
}