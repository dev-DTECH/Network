let PORT = process.env.PORT || 3000,
	express = require('express'),
	fs = require("fs"),
	app = require('express')(),
	server = require('http').Server(app),
	siofu = require("socketio-file-upload");

// let passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const keys = require("./config");


let io = require("socket.io")(server);
server.listen(PORT);
console.log(`Server online at http://localhost:${PORT}`);

app.use(express.static('public'))
// app.use(express.static('./public/uploads'))


app.use(siofu.router)

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
  });

let numuser = 0,
  	chat=[];

io.on("connection", socket => {
	// console.log("user connected");

	numuser++;
	console.log("Number of user: " + numuser);
	socket.emit("receive-chat-history",chat)

	// socket.emit("receive-chat",chat);

	socket.on("send-chat",data=>{
		socket.broadcast.emit('receive-chat',data)
		chat.push(data)
		// console.log(chat)
	})
	socket.on("send-file",data=>{
		socket.broadcast.emit('receive-chat',data)
		chat.push(data)
		// console.log(chat)
	})
	socket.on("send-video-stream",data=>{
		socket.broadcast.emit('receive-video-stream',data)
		// chat.push(data)
		// console.log(chat)
	})


	var uploader = new siofu();
    uploader.dir = "./public/uploads/";
    uploader.listen(socket);

	socket.on("disconnect", () => {
		// console.log("user disconnected");
		numuser--;
		console.log("Number of user: " + numuser);
	});
});

// passport.use(new GoogleStrategy({
// 	clientID: keys.GOOGLE.clientID,
// 	clientSecret: keys.GOOGLE.clientSecret,
// 	callbackURL: "/auth/google/callback"
// },
// (accessToken, refreshToken, profile, cb) => {
// 	console.log(profile);
// 	user = { ...profile };
// 	return cb(null, profile);
// }));