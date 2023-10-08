require('dotenv').config()

const express = require("express")
const http = require('http')
const mongoose = require("mongoose")
const cors = require("cors")

const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, {cors: {
    origin: '*',
    methods: ['GET', 'POST']
}})
const connectionHandler = require('./socket_handlers/connection_handler')
const userRouter = require("./routes/user_route")
const authRouter = require("./routes/auth_router")
const authMiddleware = require("./middleware/auth_middleware")
const socketAuthMiddleware = require('./socket_handlers/socket_auth_middleware')

let corsOptions = {
    origin: "localhost"
}

app.use(cors(corsOptions))

app.use('/', express.json())

app.use('/user', userRouter)

app.use('/auth', authRouter)

app.get("/", (req, res) => {
    res.send("Hello")
})

io.use((socket, next) => socketAuthMiddleware(socket, next, io))

io.on('connection', (sock) => connectionHandler(sock, io))

async function start() {
    try{
        await mongoose.connect(process.env.DB_CONNECT).then(
            () => console.error("Database connection successful!")
        ).catch(() => console.error("Database connection failed!"))
        
        server.listen(PORT, () => {
            console.log(`Server starts on port: ${PORT}!`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()