require('dotenv').config();

const router = require("express").Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth_middleware");
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

router.get('/', authMiddleware, async (req, res) => {
    const currentUser = req.user;
    const user = await User.find({_id: currentUser.id});
    return res.send(JSON.stringify(user));
})

router.get('/search', authMiddleware, async (req, res) => {
    const nickname = req.query.nickname;
    const users = await User.find({nickname: {$regex: new RegExp(nickname, 'i') }});
    return res.send(JSON.stringify(users));
})

router.put('/', authMiddleware, async (req, res) => {
    const request = req.body;
    const currentUser = req.user;
    let user = await User.findOne({_id: currentUser.id});

    if(request.nickname) user["nickname"] = request.nickname;
    if(request.email) user["email"] = request.email;
    if(request.password) user["password"] = bcrypt.hash(request.password, SALT_ROUNDS, async (err, hash) => hash);

    return await User.replaceOne({_id: currentUser.id}, user)
        .exec()
        .then((u) => res.send(u))
        .catch((err) => res.status(403).json({message: err}));

});


module.exports = router;