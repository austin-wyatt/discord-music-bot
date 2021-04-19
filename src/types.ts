export enum Pages{
    Home,
    Playback,
    Tracks
}

export interface Track{
    id: number,
    url: string,
    displayname: string,
    categoryid: number
    mediatype: MediaType
}

export interface Category{
    id: number,
    name: string,
    expanded: boolean
}

export enum MediaType{
    LocalResource,
    YoutubeLink,
    MediaLink
}

export const MediaTypesArray = [0, 1, 2];

export const DefaultTrack: Track = {
    id: 0,
    url: '',
    displayname: '',
    categoryid: 0,
    mediatype: MediaType.LocalResource
}

export const DefaultCategory: Category = {
    id: 1,
    name: '',
    expanded: true
}


interface mediaTypeMap{
    [key:number]: string
}
export const mapMediaTypeToString: mediaTypeMap = {
    [MediaType.LocalResource]: 'Local Resource',
    [MediaType.MediaLink]: 'Online Resource',
    [MediaType.YoutubeLink]: 'Youtube Link'
}

export interface Action{
    type: string,
    payload: any
}

export interface QueueState{ //TODO, add loop
    queue: Track[],
    nextEntry: Track | null,
    previousEntry: Track | null,
    currentEntry: Track | null,
    loop: boolean
}

export interface RootState{
    queue: QueueState
}

export interface Channel{
    id: number,
    name: string
}

export interface Guild{
    id: number,
    name: string,
    channels: Channel[]
}
