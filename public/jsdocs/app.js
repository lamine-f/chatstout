const getLogin = (message) => 
    Swal.fire(
        {
            title: message,
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: false,
            confirmButtonText: 'Look up',
            showLoaderOnConfirm: true,
            preConfirm: async (login) =>  {
                try {
                    response = await fetch(`/adduser/${login}`);
                    data = await response.json()
                    if (!response.ok) throw new Error (data.message)
                    return data;
                }catch (e) {
                    // `Votre compte n'a pas pu etre créer`
                    Swal.showValidationMessage(e.message)
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }
    )
    .then( 
        result => {
            if (result.isConfirmed) {
                localStorage.setItem("name", result.value.data);
                setTimeout(() => {
                    location.reload();
                }, 1000);
                Swal.fire({title: result.value.message})
            }
        }
    )

const userLogin = localStorage.getItem('name');

if (userLogin == "" || userLogin == null){ getLogin("Veuillez saisir un pseudo"); }


const appTitle = document.querySelector('#app-title');
const textMessageContainer = document.querySelector("div.text-message");
const sendMessage = document.querySelector("input#submit-message-value");
const sendBtn = document.querySelector("span#submit-btn");

function getReceiveMessageHTML (senderName, messageValue) {
    return `<div class="left-message" ondblclick=(doubleClickHandle())> <div class="message-container"> <p class="message-sender">${senderName}:</p><p class="message-value">${messageValue}</p></div></div>`;
}

function getSendMessageHTML (senderName, messageValue) {
    return `<div class="right-message"> <div class="message-container"> <p class="message-sender">${senderName}:</p><p class="message-value">${messageValue}</p></div></div>`;
}

function resetMessages () {
    textMessageContainer.innerHTML = textMessageContainer.innerHTML = ""
}

function showMessage (value) {
    if (value.name === userLogin){
        textMessageContainer.innerHTML += getSendMessageHTML(value.name , value.message)
    }else{
        textMessageContainer.innerHTML += getReceiveMessageHTML(value.name, value.message)
    }
}

function loadMessage (data) {
    data.forEach(message => {
        showMessage(message);
    });
}


// Establish a WebSocket connection
const socket = io();
let host = null;

socket.on("connect", () => {
    host = socket.id;
    textMessageContainer.innerHTML = "";
    socket.emit('handCheck', socket.id);
});

socket.on("start", (data) => {
    data = JSON.parse(data);
    loadMessage(data)
});

socket.on('receiveMessage', (message) => {
    value = JSON.parse(message);
    showMessage(value);
});



sendBtn.addEventListener('click', () => {
    if (sendMessage.value != ""){
        const message = JSON.stringify({author:host , name: localStorage.getItem('name') , message: sendMessage.value}); 
        socket.emit('sendMessage', message );
        sendMessage.value = "";
    }
});


replyBtns = document.querySelectorAll('div.left-message');
replyBtns.forEach((replyBtn) => {
    replyBtn.addEventListener('dblclick', () => {
        alert()
    })
})

const doubleClickHandle = () => {
    alert()
}

sendMessage.addEventListener('keydown', function(event) {
    if (event.key == "Control"){
        sendMessage.addEventListener('keydown', function(event) {
            if (event.key == "Enter"){
                sendBtn.click();
            }
          });
    }
  });
  
  appTitle.addEventListener('click', (e) => {
    e.target.setAttribute("class", "squizze")
    window.setTimeout(() => {
        e.target.setAttribute("class", "")
    }, 1000);

    fetch('/remove/iamroot')
    resetMessages()
  })