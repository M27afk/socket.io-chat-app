import Express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"

const app=Express()
const port=4000
const server=http.Server(app)

app.use(cors());

const socketIO = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});
    
socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("message", (data) => {
        console.log(data);
        socketIO.emit("messageResponse", data);
    });
    socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
    });
});

app.get("/api",(req,res)=>{
    res.send("Chat app")
})
server.listen(port,(req,res)=>{
    console.log(`Listening on ${port}`)
})

