import { Action, Track } from '../types'
import { ADD_TRACK, REMOVE_TRACK, CLEAR_QUEUE, SET_ORDER } from './Store/Queue'

export const addTrackToQueue = (track: Track): Action => ({
    type: ADD_TRACK,
    payload: track   
})

export const removeTrackFromQueue = (track: Track): Action => ({
    type: REMOVE_TRACK,
    payload: track   
})

export const clearQueue = (track: Track): Action => ({
    type: CLEAR_QUEUE,
    payload: []   
})

export const setQueueOrder = (tracks: Track[]): Action => ({
    type: SET_ORDER,
    payload: tracks  
})