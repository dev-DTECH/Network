let socket = io(),
	chat_box = document.getElementById("chat-box"),
	form = document.getElementById("form"),
	text = document.getElementById("text"),
	send_button = document.getElementById("send-button"),
	user = {
		sender: {
			name:
			//  Math.random()
		prompt(
			"Enter the name that you want every one to know you with",
			"Name"
		)
		},

		profile_image: "img.png"
	};

let lastchatdata ,
	lastchatelement;

console.log(user.sender.name)

function updatelastchat(data) {
	lastchatdata = data;
	Element = document.getElementsByClassName("chat");
	lastchatelement = Element[Element.length - 1];
}

var scrollToBottom = function() {
	window.scrollTo(0, document.body.scrollHeight);
};

socket.on("receive-chat-history", data => {
	chat_box.innerHTML="";
	data.forEach(chat => {


		if (lastchatelement && lastchatdata.sender.name == chat.sender.name) {
			lastchatelement.innerHTML += `
            <div class="chat-message">${chat.message}</div>
            `;
		} else {
			chat_box.innerHTML += `
        <div class="chat" ${chat.sender.name == user.sender.name ? 'id="you-chat"' : ""}>
            <div class="sender" ${chat.sender.name == user.sender.name ? 'id="you-sender"' : ""}>
                <div class="sender-name">${chat.sender.name}</div>
                <img src="${chat.sender.image}" alt="" class="sender-image" />
            </div>
            <div class="chat-message">${chat.message}</div>
        </div>
        `;
		}
		scrollToBottom();
		updatelastchat(chat);
	});
});



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
	scrollToBottom();
	updatelastchat(data);
	// console.log(data);
});



form.addEventListener("submit", e => {
    e.preventDefault()

	if (lastchatelement && lastchatdata.sender.name == user.sender.name) {
		lastchatelement.innerHTML += `
        <div class="chat-message">${text.value}</div>
        `;
	}else {
		chat_box.innerHTML += `
        <div class="chat" id="you-chat">
            <div class="sender" id="you-sender">
                <img src="img.png" alt="" class="sender-image" />
                <div class="sender-name">${user.sender.name}</div>
            </div>
            <div class="chat-message">${text.value}</div>
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
		message: text.value
	});
    text.value = "";

});

var uploader = new SocketIOFileUpload(socket);
let file_upload=document.getElementById("file-upload")
let file_upload_button=document.getElementById("file-upload-button")
let file_upload_form=document.getElementById("file-upload-form")

uploader.listenOnDrop(document.getElementById("file_drop"));

uploader.listenOnSubmit(file_upload_button,file_upload);

uploader.addEventListener("progress",e=>{
	console.log(e.bytesLoaded / e.file.size*100)
})
uploader.addEventListener("complete",e=>{
	console.log("Upload complete")
	// chat_box.innerHTML+=`
	// <div class="chat" id="you-chat">
	// 	<div class="sender" id="you-sender">
	// 		<img src="img.png" alt="" class="sender-image" />
	// 		<div class="sender-name">${user.sender.name}</div>
	// 	</div>
	// 	<a href="./upload/${e.file}" class="chat-message">${text.value}</a>
	// </div>
	// `
e1=e
})
file_upload_button.addEventListener("click",e=>{
	if(e1){
		console.log(e1.file.name)
		if (lastchatelement && lastchatdata.sender.name == user.sender.name) {
			lastchatelement.innerHTML += `
			<a href="./uploads/${e1.file.name}" class="chat-message" download>${e1.file.name}</a>
			`;
		}
		else{
			chat_box.innerHTML+=`
			<div class="chat" id="you-chat">
				<div class="sender" id="you-sender">
					<img src="img.png" alt="" class="sender-image" />
					<div class="sender-name">${user.sender.name}</div>
				</div>
				<a href="./uploads/${e1.file.name}" class="chat-message" download>${e1.file.name}</a>
			</div>
			`
		}
		scrollToBottom();
		updatelastchat(user);
		socket.emit("send-file", {
			sender: {
				name: user.sender.name,
				image: user.profile_image
			},
			file_name: e1.file.name
		});
	}

})
socket.on("receive-file",data=>{
	if (lastchatelement && lastchatdata.sender.name == user.sender.name) {
		lastchatelement.innerHTML += `
		<a href="./uploads/${data.file_name}" class="chat-message" download>${data.file_name}</a>
		`;
	}
	else{
		chat_box.innerHTML+=`
		<div class="chat">
			<div class="sender">
				<img src="img.png" alt="" class="sender-image" />
				<div class="sender-name">${data.sender.name}</div>
			</div>
				<a href="./uploads/${data.file_name}" class="chat-message" download>${data.file_name}</a>
				
		</div>
		`
	}
	scrollToBottom();
	updatelastchat(data);
})
// setInterval(()=>{
// 	console.log()

// }, 1000)