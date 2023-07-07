
function getLogin (message) {

    Swal.fire({
            title: message,
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: false,
            confirmButtonText: 'Look up',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                return fetch(`/adduser/${login}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json();
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Votre compte n'a pas pu etre créer`
                    )
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
            if (result.isConfirmed) {

                if (!result.value.valid){
                    getLogin("Déja pris !");

                }else{
                    localStorage.setItem("name", result.value.login);

                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                    Swal.fire({
                        title: `Bienvenue ${result.value.login} :)`,
                    })
                }
  
            }else{
                getLogin();
            }
        })

}

    if (localStorage.getItem("name") == "" || localStorage.getItem("name") == null){
        getLogin("Veuillez saisir un pseudo");
    }


const LOGIN = localStorage.getItem('name');

const appTitle = document.querySelector('#app-title');

const textMessageContainer = document.querySelector("div.text-message");

const sendMessage = document.querySelector("input#submit-message-value");
const sendBtn = document.querySelector("span#submit-btn");

// Establish a WebSocket connection
const socket = io();
let host = null;

socket.on("connect", () => {
    host = socket.id;
    textMessageContainer.innerHTML = "";
    socket.emit('s-id', socket.id);
});

socket.on("start", (data) => {
    data = JSON.parse(data);
    loadMessage(data)
});

socket.on('receiveMessage', (message) => {
    value = JSON.parse(message);
    showMessage(value);
});

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
    if (value.name === LOGIN){
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