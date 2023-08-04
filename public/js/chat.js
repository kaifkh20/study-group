

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


const query = window.location.search
const channelCode = query.split('=')[2]

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


socket.emit('channelCode',channelCode)

socket.on('userData',(users)=>{
    // console.log(users.users);
    console.log("its working");
})

socket.on('roomData',({channelName,users})=>{
    console.log(users);
    const html = ejs.render(sBTemplate,{channelName,users})
    document.querySelector('#sidebar').innerHTML = html
})

socket.emit('join',channelCode)





