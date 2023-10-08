require('dotenv').config();

const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const {generateAccessToken} = require('../service/jwt_service');
const {generateRefreshToken} = require('../service/jwt_service');
const {verifyRefreshToken} = require('../service/jwt_service');
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

router.post('/reg', async (req, res) => {
    const {nickname, email, password} = req.body;
    
    try{
        bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
            const user = new User({
                nickname: nickname,
                email: email,
                password: hash
            })
            return await user.save()
                .then(() => res.status(200).json({message: "Registration is successful"}))
                .catch((err) => res.status(400).json({message: err.message}));
        })
    } catch (e) {
        return res.status(500).json({message: "Registration is failed!"});
    }
})

router.post('/login', async (req, res) => {
    try{
        const {login: nickname, password} = req.body;
        const user = await User.findOne({nickname});
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                
                const accessToken = generateAccessToken(user.id, user.nickname);
                const refreshToken = generateRefreshToken(user.id);

                return res.status(200).json({accessToken, refreshToken});
            })
        } else {
            return res.status(400).json({message: "User is not exist!"});
        }
    } catch (e) {
        return res.status(400).json({message: "Authentication is failed!"});
    }
})

router.get('/refresh', async (req, res) => {
    try{
        if (req.headers['refreshtoken'].length > 10) {
            const decodeData = verifyRefreshToken(req.headers['refreshtoken']);
            const userId = decodeData.id;
            const userNickname = decodeData.nickname;

            const accessToken = generateAccessToken(userId, userNickname);
            const  refreshToken = generateRefreshToken(userId);

            return res.status(200).json({accessToken, refreshToken});
        } else {
            return res.status(400).json({message: "Authentication is failed!"});
        }
    } catch (e) {
        console.log('error in auth router get /refresh');
        return res.status(400).json({message: "Authentication is failed!"});
    }
})

module.exports = router;