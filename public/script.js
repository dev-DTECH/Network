let socket = io("http://localhost:3000"),
	chat_box = document.getElementById("chat-box"),
	form = document.getElementById("form"),
	text = document.getElementById("text"),
	send_button = document.getElementById("send-button"),
    name = "Developer",
    // prompt(
	// 	"Enter the name that you want every one to know you with",
	// 	"Name"
    // );
    lastchat,
    lastchatelement;

var scrollToBottom = function() {
  window.scrollTo(0, document.body.scrollHeight);
}

socket.on("receive-chat-history", data => {
    data.forEach((chat)=>{
        chat_box.innerHTML +=`
        <div class="chat" ${(chat.sender.name == name)?'id="you-chat"':""}>
            <div class="sender" ${(chat.sender.name == name)?'id="you-sender"':""}>
                <div class="sender-name">${chat.sender.name}</div>
                <img src="${chat.sender.image}" alt="" class="sender-image" />
            </div>
            <div class="chat-message">${chat.message}</div>
        </div>
        `;
     scrollToBottom();
    })
});

socket.on("receive-chat", data => {
	chat_box.innerHTML += `
    <div class="chat">
        <div class="sender">
            <img src="${data.sender.image}" alt="" class="sender-image" />
            <div class="sender-name">${data.sender.name}</div>
        </div>
        <div class="chat-message">${data.message}</div>
    </div>
    `;
    scrollToBottom();
	// console.log(data);
});

form.addEventListener("submit", e => {
	e.preventDefault();
	chat_box.innerHTML += `
    <div class="chat" id="you-chat">
        <div class="sender" id="you-sender">
            <img src="img.png" alt="" class="sender-image" />
            <div class="sender-name">${name}</div>
        </div>
        <div class="chat-message">${text.value}</div>
    </div>
    `;
    scrollToBottom();
	socket.emit(
		"send-chat",
		{
			sender: {
				name: name,
				image: "img.png"
			},
			message: text.value
		}
	);
	text.value = "";
});
