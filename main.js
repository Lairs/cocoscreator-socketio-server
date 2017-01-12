var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var redis = require('socket.io-redis');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//io.adapter('/main lobby');
//console.log(redis({ host: 'localhost', port: 6379 }));
//console.log(io.adapter);

io.on('connection', function(socket){
  console.log('a user connected');

  //add certified, this will be modified after checker db
  socket.certified = false;

  //go to room
  socket.join("lobby",function(err){
  	console.log("join room cb, only run on err?");
  	//console.log(err);
  	console.log(socket.rooms);
  	//console.log(io.to('lobby'));

  	//console.log(io.sockets);
  	console.log(io.sockets.adapter.rooms['lobby']);
  	console.log(io.sockets.adapter.rooms['lobby'].sockets);
  	console.log(io.sockets.adapter.rooms['lobby'].length);
  	console.log(io.sockets.connected);

  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  	console.log(socket.rooms);
  	//need check room exist on player leave, system clean room
  	console.log(io.sockets.adapter.rooms['lobby']);
  	console.log(io.sockets.connected);
  });

  socket.on('clientLogIn', function(logInData){
    console.log('client request login');
    console.log(logInData);

    //check data?
    if('rares' == logInData.acc && '123' == logInData.pw)
    {
    	console.log("login success");
    	socket.certified = true;
    	socket.emit('login_success');
    	socket.username = logInData.acc;
    }
    else
    {
    	console.log("login fail");
    	socket.certified = false;
    	socket.emit('login_fail');
    }
  });



  socket.on('chat message', function(msg){
  	
  	//console.log(chechCertified(socket));
  	if(chechCertified(socket))
  	{
  		//send every one and self?
		io.emit('chat message', socket.username + ":" + msg);
  	}
  	else
  	{
  		console.log("not certified, kick client");
  		socket.disconnect();
  	}
  	
  });

  //tracing data
  //console.log(socket);
  console.log(socket.rooms);
  //console.log(socket.client);
  //console.log(socket.conn);
  //console.log(socket.request);
  console.log(socket.id);
  //console.log(socket.rooms);

  //active kick client
  //socket.disconnect();
  // setTimeout(function(){
  // 	console.log("delay disconnect");
  // 	socket.disconnect();
  // },3000);
  //tell client you are connected -> so they dont know?
  //socket.emit("connected","welcome");
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function chechCertified(socket)
{
	console.log("check certify");
	console.log(socket.certified);
	if(socket.certified)
	{
		return true;
	}
	else
	{
		return false;
	}
	return false;
}
