import { Action, Track } from '../types'
import { ADD_TRACK, REMOVE_TRACK, CLEAR_QUEUE, SET_ORDER, SET_NEXT_ENTRY, SET_PREVIOUS_ENTRY, SET_CURRENT_ENTRY, SET_LOOP } from './Store/Queue'

export const addTrackToQueue = (track: Track): Action => ({
    type: ADD_TRACK,
    payload: track   
})

export const removeTrackFromQueue = (track: Track): Action => ({
    type: REMOVE_TRACK,
    payload: track   
})

export const clearQueue = (): Action => ({
    type: CLEAR_QUEUE,
    payload: []   
})

export const setQueueOrder = (tracks: Track[]): Action => ({
    type: SET_ORDER,
    payload: tracks  
})

export const setNextEntry = (track: Track): Action => ({
    type: SET_NEXT_ENTRY,
    payload: track  
})

export const setPreviousEntry = (track: Track): Action => ({
    type: SET_PREVIOUS_ENTRY,
    payload: track  
})

export const setCurrentEntry = (track: Track): Action => ({
    type: SET_CURRENT_ENTRY,
    payload: track  
})

export const setLoop = (loop: boolean): Action => ({
    type: SET_LOOP,
    payload: loop  
})