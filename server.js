let PORT = process.env.PORT || 3000,
	express = require('express'),
	fs = require("fs"),
	app = require('express')(),
	server = require('http').Server(app);

let io = require("socket.io")(server);
server.listen(PORT);
console.log(`Server online at http://localhost:${PORT}`);

app.use(express.static('public'))

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
  });

let numuser = 0,
  	chat="";

io.on("connection", socket => {
	// console.log("user connected");

	numuser++;
	console.log("Number of user = " + numuser);
	socket.emit("receive-chat",chat);

	socket.on("send-chat",data=>{
		socket.broadcast.emit('receive-chat',data)
		chat+=data
	})
	socket.on("disconnect", () => {
		// console.log("user disconnected");
		numuser--;
		console.log("Number of user = " + numuser);
	});
});
