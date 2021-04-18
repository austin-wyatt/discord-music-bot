import axios from 'axios';


const DiscordAxiosInstance = axios.create({
    baseURL: 'http://localhost:54001/',
});

export const initialize = () => {
    DiscordAxiosInstance.get('initializeDiscord')
    .then((response) => {
        console.log(response)
    }).catch((error: any) => {
        console.log(error)
    })

}

export const playYoutubeLink = (link: string) => { //TODO, send track id
    DiscordAxiosInstance.put('playYoutubeLink&' + link)
    .then((response) => {

    }).catch((error: any) => {
        console.log(error)
    })
}

export const playMedia = (link: string) => {
    let encodedLink = encodeURI(link)
    DiscordAxiosInstance.put('playMedia&' + encodedLink)
    .then((response) => {
        
    }).catch((error: any) => {
        console.log(error)
    })
}

export const play = () => {
    DiscordAxiosInstance.get('play')
    .then((response) => {
        console.log(response)
    }).catch((error: any) => {
        console.log(error)
    })
}

export const pause = () => {
    DiscordAxiosInstance.get('pause')
    .then((response) => {
        console.log(response)
    }).catch((error: any) => {
        console.log(error)
    })
}

export const setVolume = (volume: number) => {
    DiscordAxiosInstance.put('setVolume&' + volume)
    .then((response) => {
        console.log(response)
    }).catch((error: any) => {
        console.log(error)
    })
}

let webSocketClient = new WebSocket('ws://localhost:54002/',"echo-protocol");

export const sendInterrupt = () => { 
    if(webSocketClient.readyState == webSocketClient.OPEN){
        // webSocketClient.send('video_selected')
    }
    else{
        webSocketClient = new WebSocket('ws://localhost:54002/',"echo-protocol");
        initializeWebSocket()
    }
}

const initializeWebSocket = () => {
    webSocketClient.onmessage = (event) => {
        console.log("Websocket message received")
        console.log(event)
        if(event.data == 'playback_ended'){ 
            console.log('advance video queue')
            //@ts-ignore, lord please forgive me for the atrocities I've committed
            if(window['playNextVideoInQueue']){
                //@ts-ignore
                window['playNextVideoInQueue']()
            }
        }
    }
    
    webSocketClient.onopen = (event) => {
        console.log("Websocket opened")
        console.log(event)
    }
}

initializeWebSocket()


