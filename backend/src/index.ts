// src/index.ts

//
// TODO: setup ice candidate exchanging
//
//
//

// Imports
import express from 'express';
import cors from 'cors';
import {v4 as uuidV4} from 'uuid';
import bodyParser, { BodyParser } from 'body-parser';
import { Server } from 'socket.io';
import {createServer} from 'http';
import {RTCPeerConnection, RTCSessionDescription} from 'werift';

// Initialising express app
const app = express();
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

// Setting up middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


// Constants
const PORT = 5052;
const ICE_CONFIG: any = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

// stream id -> {streamerDesc: string, streamerSocketID: string}
type streamDescriptions = {
  [StreamID: string]: {
    streamerDesc: RTCSessionDescriptionInit,
    streamerSocketID?: string
  }
}

// map stream id to socket id
// type socketStreamPair = {
//   [StreamID: string]: string
// }

let streamDescs: streamDescriptions = {};
// let socketIdToStreamID:socketStreamPair = {};

// Signalling using socket.io

io.on('connection', (socket)=>{
  console.log('client connected!', socket.id)

  socket.on('signal-register', (streamID)=>{
    console.log('got register', socket.id)
    streamDescs[streamID].streamerSocketID = socket.id;
    // console.log(streamDescs)
  })

  socket.on('ice-candidate', (candidate, destSocketID)=>{

  })

})


// REST API using Express

app.get('/api', (req, res)=>{
  res.send('Hello!')
})


//to be replaced by auth on client side
app.get('/getUserID', (req, res)=>{
  
  const newUserID: string = uuidV4();
  console.log(typeof newUserID)
  res.send({UserID: newUserID})

})

app.post('/api/registerStream', async (req, res)=>{
  const newStreamID: string = uuidV4()
  streamDescs[newStreamID] = {streamerDesc: req.body.streamerDesc}

  // setup server as a viewer for this streamer
  const peerConnection = new RTCPeerConnection(ICE_CONFIG)
  const localDescription = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(localDescription)

  await peerConnection.setRemoteDescription(new RTCSessionDescription(String(req.body.streamerDesc), "answer"))

  res.send({streamID: newStreamID, serverDesc: localDescription})
  console.log('New stream started', newStreamID)
  

})

app.get('/api/getStreamIDs', (req, res)=>{
  res.send(streamDescs)
})


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
