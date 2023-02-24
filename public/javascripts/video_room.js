// 前端實作程式碼
// import {io} from "socket.io-client"
// import Peer from "peerjs"

const users = {}
// const socket =io()
let socket = io("http://localhost:9526/")
const room_id = document.querySelector("#room_id").dataset.id
const p2p = new Peer({host:"/",port:9527})
const container = document.querySelector(".video-container")


console.log(room_id)
socket.emit("ENTER_ROOM",room_id,"buibui")
let p_id ="eel"


// peer
p2p.on("open", (p_id) =>{
    socket.emit("ENTER_ROOM",room_id,p_id)
})

// websocket
socket.on("USER_LEFT",(user_name)=>{
    if(users[user_name]){
        users[user_name].close()
    }
})


const v = document.createElement("video")
v.muted = true

// device
navigator.mediaDevices.getUserMedia({audio:true,video:true})
    .then((stream)=>{
        attachStreamToTarget(v,stream)

        socket.on("USER_ENTERED",(user_name)=>{
            // console.log("user entered : ",user_name)
            sendStreamToUser(user_name,stream)
        })

        p2p.on("call", (call) =>{
            console.log("call")
            call.answer(stream)


            const v = document.createElement("video")
            v.muted = true
            call.on("stream",(theirStream)=>{
                attachStreamToTarget(v, theirStream)
            })
        })

    })

//helper
function attachStreamToTarget(target,stream){
    target.srcObject=stream
    target.addEventListener("loadedmetadata",()=>{
        target.play()
    })
    console.log("播放成功")
    container.append(target)
}

function sendStreamToUser(user_name,stream){
    const call = p2p.call(user_name,stream)

    const v = document.createElement("video")
    v.muted = true

    call.on("stream",(theirStream)=>{
        attachStreamToTarget(v,theirStream)
    })

    call.on("close",()=>{
        v.remove()
    })

    users[user_name]=call

}