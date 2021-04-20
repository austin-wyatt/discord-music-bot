import axios from 'axios';
import { Guild } from '../types';


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

export const joinChannel = (guildID: number, channelID: number) => {
    DiscordAxiosInstance.put('joinChannel&' + guildID + '&' + channelID)
    .then((response) => {
        console.log(response)
    }).catch((error: any) => {
        console.log(error)
    })
}


export interface GuildReturnData{
    [key: number]: Guild
}

export const getServers = (fnCallback: (guildData: GuildReturnData) => void) => {
    DiscordAxiosInstance.get('getServers')
    .then((response) => {
        fnCallback(response.data)
    }).catch((error: any) => {
        console.log(error)
    })
}

export const getServersFromIDs = (guildIDs: number[], fnCallback: (guildData: GuildReturnData) => void) => {
    DiscordAxiosInstance.get('getServersFromIDs&' + JSON.stringify(guildIDs))
    .then((response) => {
        fnCallback(response.data)
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

export const sendVolumeRequest = () => { 
    if(webSocketClient.readyState == webSocketClient.OPEN){
        webSocketClient.send('get_volume')
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
        if(event.data.startsWith('volume')){
            console.log(event.data)
        }
    }
    
    webSocketClient.onopen = (event) => {
        console.log("Websocket opened")
        console.log(event)
    }
}

initializeWebSocket()


