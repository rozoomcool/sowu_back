const {verifyToken} = require("../service/jwt_service");

module.exports = (req, res, next) => {
    if(req.method === "OPTIONS") next();

    try{
        const accessToken = req.headers.authorization.split(' ')[1];

        if (!accessToken) return res.status(403).json({message: "User has not authenticated"});

        const decodeData = verifyToken(accessToken);
        req.user = decodeData;
        next();
        
    } catch (e) {
        return res.status(401).json({message: "Your token is expired!"});
    }
}