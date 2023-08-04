

const socket = io('127.0.0.1:3000')
// const User = require('.../model/server')
// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sBTemplate = document.querySelector('#sidebar-template').innerHTML
const imageLinkTemplate = document.querySelector('#image-link-template').innerHTML


const {userName,channelCode} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const room = channelCode


const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = ejs.render(messageTemplate, {
        username : message.username,
        message: message.text,
        createdAt: message.createdAt
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = ejs.render(locationMessageTemplate, {
        username : message.username,
        url: message.url,
        createdAt: message.createdAt
    })
    // console.log(html);
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.emit('join',{channelCode,userName})

// socket.emit('channelCode',channelCode)

socket.on('userData',(users)=>{
    // console.log(users.users);
    console.log("its working");
})

socket.on('roomData',({channelName,users})=>{
    console.log(channelName,users);
    const html = ejs.render(sBTemplate,{channelName,users})
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage',{userName,message,channelCode}, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat : position.coords.latitude,
            long: position.coords.longitude,
            userName,channelCode
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})


socket.emit('join',{userName,channelCode})






