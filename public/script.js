

function escapeHtml(text) {

	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}


let socket = io(),
	chat_box = document.getElementById("chat-box"),
	form = document.getElementById("form"),
	text = document.getElementById("text"),
	send_button = document.getElementById("send-button"),
	user = {
		sender: {
			name:
			// Math.random()
			prompt(
				"Enter the name that you want every one to know you with",
				"Name"
			)
		},

		profile_image: "img.png"
	};

let lastchatdata, lastchatelement;

let notification_audio=document.getElementById("notification-audio")

console.log(user.sender.name);

function updatelastchat(data) {
	lastchatdata = data;
	Element = document.getElementsByClassName("chat");
	lastchatelement = Element[Element.length - 1];
}

var scrollToBottom = function() {
	window.scrollTo(0, document.body.scrollHeight);
};

socket.on("receive-chat-history", data => {
	chat_box.innerHTML = "";
	data.forEach(chat => {
		//message
		if (chat.message) {
			if (lastchatelement && lastchatdata.sender.name == chat.sender.name) {
				lastchatelement.innerHTML += `
            <div class="chat-message">${chat.message}</div>
            `;
			} else {
				chat_box.innerHTML += `
        <div class="chat" ${
					chat.sender.name == user.sender.name ? 'id="you-chat"' : ""
				}>
            <div class="sender" ${
							chat.sender.name == user.sender.name ? 'id="you-sender"' : ""
						}>
                <div class="sender-name">${chat.sender.name}</div>
                <img src="${chat.sender.image}" alt="" class="sender-image" />
            </div>
            <div class="chat-message">${chat.message}</div>
        </div>
        `;
			}
			scrollToBottom();
			updatelastchat(chat);
		}
		//file
		// else if (chat.file_name) {
		// 	if (lastchatelement && lastchatdata.sender.name == chat.sender.name) {
		// 		lastchatelement.innerHTML += `
		// 	<a href="./uploads/${chat.file_name}" class="chat-message" download>${chat.file_name}</a>
        //     `;
		// 	} else {
		// 		chat_box.innerHTML += `
        // <div class="chat" ${
		// 			chat.sender.name == user.sender.name ? 'id="you-chat"' : ""
		// 		}>
        //     <div class="sender" ${
		// 					chat.sender.name == user.sender.name ? 'id="you-sender"' : ""
		// 				}>
        //         <div class="sender-name">${chat.sender.name}</div>
        //         <img src="${chat.sender.image}" alt="" class="sender-image" />
        //     </div>
		// 	P<a href="./uploads/${chat.file_name}" class="chat-message" download>${
		// 			chat.file_name
		// 		}</a>
        // </div>
        // `;
		// 	}
		// 	scrollToBottom();
		// 	updatelastchat(chat);
		// }
	});
});

//message-receive

socket.on("receive-chat", data => {
	if (lastchatelement && lastchatdata.sender.name == data.sender.name) {
		lastchatelement.innerHTML += `
        <div class="chat-message">${data.message}</div>
        `;
	} else {
		chat_box.innerHTML += `
    <div class="chat">
        <div class="sender">
            <img src="${data.sender.image}" alt="" class="sender-image" />
            <div class="sender-name">${data.sender.name}</div>
        </div>
        <div class="chat-message">${data.message}</div>
    </div>
    `;
	}
	notification_audio.play();
	scrollToBottom();
	updatelastchat(data);
	// console.log(data);
});

form.addEventListener("submit", e => {
	e.preventDefault();

	var message = escapeHtml(text.value);

	if (lastchatelement && lastchatdata.sender.name == user.sender.name) {
		lastchatelement.innerHTML += `
        <div class="chat-message">${message}</div>
        `;
	} else {
		chat_box.innerHTML += `
        <div class="chat" id="you-chat">
            <div class="sender" id="you-sender">
                <img src="img.png" alt="" class="sender-image" />
                <div class="sender-name">${user.sender.name}</div>
            </div>
            <div class="chat-message">${message}</div>
        </div>
        `;
	}
	scrollToBottom();
	updatelastchat(user);
	socket.emit("send-chat", {
		sender: {
			name: user.sender.name,
			image: user.profile_image
		},
		message: message
	});
	text.value = "";
});

var uploader = new SocketIOFileUpload(socket);
let file_upload = document.getElementById("file-upload");
let file_upload_button = document.getElementById("file-upload-button");
let file_upload_form = document.getElementById("file-upload-form");

uploader.listenOnDrop(document.getElementById("file_drop"));

uploader.listenOnInput(file_upload);

uploader.addEventListener("progress", e => {
	console.log((e.bytesLoaded / e.file.size) * 100);
});
uploader.addEventListener("complete", e => {
	console.log("Upload complete");
	e1 = e;
});
file_upload_button.addEventListener("click", e => {
	if (e1) {
		console.log(e1.file.name);
		if (lastchatelement && lastchatdata.sender.name == user.sender.name) {
			lastchatelement.innerHTML += `
			<div class="chat-message">
				<a id="file-link" href="./uploads/${e1.file.name}">
					<img src="./style/file-logo.svg" alt="" srcset="" />
					<br>
					<div>
						${e1.file.name}
					</div>
				</a>
				<br>
				<a href="./uploads/${e1.file.name}" id="download-button" download>Download</a>
			</div>
			`;
		} else {
			chat_box.innerHTML += `
			<div class="chat" id="you-chat">
				<div class="sender" id="you-sender">
					<img src="img.png" alt="" class="sender-image" />
					<div class="sender-name">${user.sender.name}</div>
				</div>
				<div class="chat-message">
					<a id="file-link" href="./uploads/${e1.file.name}">
						<img src="./style/file-logo.svg" alt="" srcset="" />
						<br>
						<div>
							${e1.file.name}
						</div>
					</a>
					<br>
					<a href="./uploads/${e1.file.name}" id="download-button" download>Download</a>
				</div>
			</div>
			`;
		}
		scrollToBottom();
		updatelastchat(user);
		socket.emit("send-file", {
			sender: {
				name: user.sender.name,
				image: user.profile_image
			},
			message: `
			<a id="file-link" href="./uploads/${e1.file.name}">
				<img src="./style/file-logo.svg" alt="" srcset="" />
				<br>
				<div>
					${e1.file.name}
				</div>
			</a>
			<br>
			<a href="./uploads/${e1.file.name}" id="download-button" download>Download</a>		
			`
		});
	}
});
// socket.on("receive-file", data => {
// 	if (lastchatelement && lastchatdata.sender.name == data.sender.name) {
// 		lastchatelement.innerHTML += `
// 		<a href="./uploads/${data.file}" class="chat-message" download>${data.file_name}</a>
// 		`;
// 	} else {
// 		chat_box.innerHTML += `
// 		<div class="chat">
// 			<div class="sender">
// 				<img src="img.png" alt="" class="sender-image" />
// 				<div class="sender-name">${data.sender.name}</div>
// 			</div>
// 				<a href="./uploads/${data.file_name}" class="chat-message" download>${data.file_name}</a>
				
// 		</div>
// 		`;
// 	}
// 	scrollToBottom();
// 	updatelastchat(data);
// });

///Youtube///

let youtube_upload=document.getElementById("youtube-upload");
function upload_youtube(){
	if (lastchatelement && lastchatdata.sender.name == user.sender.name) {
		lastchatelement.innerHTML += `
		<div class="chat-message">
			<iframe id="youtube" src="${youtube_upload.value}" allowfullscreen></iframe>
		</div>
        `;
	} else {
		chat_box.innerHTML += `
        <div class="chat" id="you-chat">
            <div class="sender" id="you-sender">
                <img src="img.png" alt="" class="sender-image" />
                <div class="sender-name">${user.sender.name}</div>
            </div>
			<div class="chat-message">
				<iframe id="youtube" src="${youtube_upload.value}" allowfullscreen></iframe>
			</div>
        </div>
        `;
	}
	scrollToBottom();
	updatelastchat(user);
	socket.emit("send-chat",{
		sender: {
			name: user.sender.name,
			image: user.profile_image
		},
		message: `
		<iframe id="youtube" src="${youtube_upload.value}" allowfullscreen></iframe>
		`
	})
	console.log(youtube_upload.value);
}

