// src/index.ts

// Imports
import express from 'express';
import cors from 'cors';
import {v4 as uuidV4} from 'uuid';
import bodyParser, { BodyParser } from 'body-parser';


// Initialising express app
const app = express();

// Setting up middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const port = 5052;


type StreamDescriptionsObject = {
  [StreamID: string]: Object
}

let StreamDescs: StreamDescriptionsObject = {};

app.get('/', (req, res)=>{
  res.send('Hello!')
})

app.post('/api/registerStream', (req, res)=>{
  const newStreamID: string = uuidV4()
  StreamDescs[newStreamID] = req.body.sourceDesc

  res.send(newStreamID)
  console.log('New stream started', newStreamID)
})

app.get('/api/getStreamIDs', (req, res)=>{
  res.send(StreamDescs)
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
