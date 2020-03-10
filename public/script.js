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
