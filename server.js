let PORT = process.env.PORT || 3000;
let http = require("http"),
	fs = require("fs"),
	url = require("url");

let io = require("socket.io")(
	http
		.createServer(function(req, res) {
			if (req.url[req.url.length - 1] == "/") req.url += "index.html";
			var purl = url.parse(req.url, true);
			if (purl.pathname == "/hello") {
				res.writeHead(200, { "Content-Type": "text/plain" });
				res.end("hello " + (purl.query.name || "world")); // notice i use querystring arguments here http://127.0.0.1:1337/hello?name=me!
			} else {
				fs.exists(__dirname + "/public" + purl.pathname, function(exists) {
					if (exists) {
						var extention = purl.pathname.match(/\..+$/)[0];
						var mime = {
							".js": "text/javascript; charset=UTF-8",
							".txt": "text/plain; charset=UTF-8",
							".html": "text/html; charset=UTF-8",
							".css": "text/css",
							".png": "image/png",
							".gif": "image/gif",
							".jpg": "image/jpeg"
						};

						res.writeHead(200, { "Content-Type": mime[extention] });
						fs.readFile(__dirname + "/public" + purl.pathname, function(
							err,
							data
						) {
							if (err) throw err;
							res.end(data);
						});
					} else {
						console.log(__dirname + "/public" + purl.pathname);

						res.writeHead(404, { "Content-Type": "text/plain" });
						res.end("File Not Found");
					}
				});
			}
		})
		.listen(PORT)
);
console.log("Server online at http://localhost:3000");

let numuser = 0;

io.on("connection", socket => {
	// console.log("user connected");

	numuser++;
	console.log("Number of user = " + numuser);
	socket.emit("receive-chat", {
		sender:{
			name:"Ramdom",
			image:"img.png"
		},
		message:"Ad amet mollit cupidatat exercitation eu enim. Cillum magna voluptate anim esse laborum esse commodo elit. Nostrud irure eiusmod excepteur voluptate commodo esse excepteur. Occaecat cillum aliquip magna aute exercitation aliquip elit officia. Nisi cillum nisi cupidatat laboris veniam occaecat esse veniam eu ex veniam. Sint deserunt non esse labore veniam. Anim eiusmod culpa sunt occaecat tempor minim."
	});

	socket.on("send-chat",data=>{
		socket.broadcast.emit('receive-chat',data)
	})
	socket.on("disconnect", () => {
		// console.log("user disconnected");
		numuser--;
		console.log("Number of user = " + numuser);
	});
});
