var cors = require('cors');
var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');
app.use(cors());

mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
var Schema = mongoose.Schema;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected");
});

var state = new Schema({
    data: [
       { label: String, value: String },
     ],
     
},{collection:"StateData"});
var StateData = mongoose.model('StateData',state)

app.get('/getData', function(req, res){
StateData.find().then(function(doc){
  console.log(doc)
  res.header("Content-Type",'application/json');
  res.send(JSON.stringify(doc[0]));
})
});

app.get('/renewData', function(req, res){
  StateData.find().then(function(doc){
    
    StateData.findById(doc[0]._id.toString(),function(err,rs){
      rs.data = [
        { label: '<5', value: getRandomInt(1000000) },
        { label: '5-13', value:  getRandomInt(1000000)},
        { label: '14-17', value:  getRandomInt(1000000)},
        { label: '18-24', value:  getRandomInt(1000000)},
        { label: '25-44', value:  getRandomInt(1000000)},
        { label: '45-64', value:  getRandomInt(1000000)},
        { label: '≥65', value:  getRandomInt(1000000)},
      ]
      rs.save();
    })
    io.emit("changedata","true");
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(doc[0]._id.toString()));
  })
});
  

io.on('connect', function(socket){
  
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

http.listen(3600, function(){
  console.log('listening on *:3600');
});