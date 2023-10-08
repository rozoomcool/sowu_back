const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
        minlength: [4, "Too short nickname"],
        maxlength: [24, "Too large nickname"],
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Too short password"],
        maxlength: [255, "Too large password"],
    },
})

module.exports = model('User', userSchema)