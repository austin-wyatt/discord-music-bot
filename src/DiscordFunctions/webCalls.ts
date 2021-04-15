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

export const playYoutubeLink = () => {
    DiscordAxiosInstance.put('playYoutubeLink&SnJ5Xnw4Wkk')
    .then((response) => {
        console.log(response)
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
