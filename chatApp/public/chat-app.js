const messageTypes={LEFT:'left' , RIGHT:'right' , LOGIN:'login'};

//chat related 

const chatWindow= document.getElementById('chat');
const messagesList=document.getElementById('messages-list');
const messageInput =document.getElementById('message-input');
const sendButton=document.getElementById('send-button');

//login related

let username='';
const usernameInput=document.getElementById('username-input');
const loginButton=document.getElementById('login-button');
const loginWindow=document.getElementById('login');

const messages=[]; // its gonna hold {author, date, content, type(left,right,login)}

//Connect to socket.io - automatically tries to connect on same port app was served from
const socket=io();

socket.on('message',(message) => {
    //update type of messages left or right based on username, if username is the author of messgae meanign its right type
    if(message.type!== messageTypes.LOGIN){
        if(message.author === username){
            message.type=messageTypes.RIGHT;
        }else{
            message.type=messageTypes.LEFT;
        }
    }
    messages.push(message);
    displayMessages();

    //scroll to the bottom
    chatWindow.scrollTop=chatWindow.scrollHeight;
});

createMessageHTML = (message) =>{
    if(message.type === messageTypes.LOGIN){
        return `
            <p class="secondary-text text-center mb-2">${message.author} joined the chat...</p>
        `;
    }
    return `
        <div class="message ${message.type===messageTypes.LEFT ? 'message-left' : 'message-right'}">
        <div class="message-details flex">
            <p class="flex-grow-1 message-author">${message.type === messageTypes.RIGHT ? '':message.author}</p>
            <p class="message-date">${message.date}</p>
        </div>
        <p class="message-content">${message.content}</p>
        </div>
    `;
};

displayMessages = () => {
    const messagesHTML = messages.map(message => createMessageHTML(message)).join('');
    messagesList.innerHTML=messagesHTML;
};

//send Button fucntionality when a user sends a message
sendButton.addEventListener('click',(e) =>{
    e.preventDefault(); //once we click send we stay on smae page
    if(messageInput.value==false){ //if no message is typed show alert and stay in same page
        alert('Please type a message to send');
        return; 
    }

    const date=new Date();

    const day=('0' + date.getDate()).slice(-2);
    const month=('0' + (date.getMonth() + 1)).slice(-2);
    const year=date.getFullYear();

    const hours = ('0' + date.getHours()).slice(-2);  
    const minutes = ('0' + date.getMinutes()).slice(-2); 
    const seconds = ('0' + date.getSeconds()).slice(-2);

    const dateStr= `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    const message = {
        author:username,
        date:dateStr,
        content:messageInput.value
    };
    sendMessage(message);
    messageInput.value=''; //this will clear the text input once the message is sent
    });

//login button functionalities when a user clicks on the login button
loginButton.addEventListener('click', (e)=>{
    e.preventDefault();
    if(usernameInput.value==false){
        alert('Please enter a username');
        return;
    } 
    username=usernameInput.value;
    sendMessage({author:username, type:messageTypes.LOGIN});

    //show chat window and hide login window , simply toggle b/w these thats why we have preventDEfault()
    loginWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');
});

sendMessage = message =>{
    socket.emit('message',message);
};