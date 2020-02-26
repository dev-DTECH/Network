let socket = io(),
    chat_box = document.getElementById("chat-box"),
    form=document.getElementById("form"),
    text=document.getElementById("text"),
    send_button=document.getElementById("send-button"),
    name=prompt("Enter the name that you want every one to know you with","Name")

socket.on("receive-chat", data => {
	chat_box.innerHTML += data;
    // console.log(data);
    
});

form.addEventListener('submit',(e)=>{
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
    socket.emit("send-chat",`

    <div class="chat">
        <div class="sender">
            <img src="img.png" alt="" class="sender-image" />
            <div class="sender-name">${name}</div>
        </div>
        <div class="chat-message">${text.value}</div>
    </div>
    `
    )
    text.value=''
})