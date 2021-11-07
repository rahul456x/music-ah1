const express = require('express');

const server = express()

server.all('/', (req, res)=>{
  res.send('Host 24/7 ready')
})

function keepAlive(){
  server.listen(3000, ()=>{console.log("-- Server is online --")});
}

module.exports = keepAlive;