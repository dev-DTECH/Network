let socket = io(),
    chat_box = document.getElementById("chat-box"),
    form=document.getElementById("form"),
    text=document.getElementById("text"),
    send_button=document.getElementById("send-button"),
    name=prompt("Enter the name that you want every one to know you with","Name")

socket.on("receive-chat", data => {
	chat_box.innerHTML += `
    <div class="chat">
        <div class="sender">
            <div class="sender-name">${data.sender.name}</div>
                <img src="${data.sender.image}" alt="" class="sender-image" />
            </div>
        <div class="chat-message">${data.message}</div>
    </div>
    `;
	// console.log(data);
});

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    socket.emit("send-chat",{
        sender:{
            name:name,
            image:"img.png"
        },
        message:text.value
    })
    text.value=''
})