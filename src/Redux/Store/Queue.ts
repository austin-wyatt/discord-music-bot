import { Action, QueueState } from "../../types";



const initialState: QueueState = {
    queue: [],
    nextEntry: null,
    previousEntry: null,
    currentEntry: null,
    loop: false
};

export const ADD_TRACK = "ADD_TRACK"
export const REMOVE_TRACK = "REMOVE_TRACK"
export const CLEAR_QUEUE = "CLEAR_QUEUE"
export const SET_ORDER = "SET_ORDER" //figure out if I want to do this

export const SET_NEXT_ENTRY = "SET_NEXT_ENTRY"
export const SET_PREVIOUS_ENTRY = "SET_PREVIOUS_ENTRY"
export const SET_CURRENT_ENTRY = "SET_CURRENT_ENTRY"

export const SET_LOOP = "SET_LOOP"



const queueState = (state = initialState, action: Action) => {
  switch (action.type) {
    case ADD_TRACK: {
      const temp = state.queue
      if(!temp.find(t => t.id == action.payload.id)){
        temp.push(action.payload)
      }
      return {
        ...state,
        queue: temp
      };
    }
    case REMOVE_TRACK: {
      const temp = state.queue.filter(q => q.id != action.payload.id)
      return {
        ...state,
        queue: temp
      };
    }
    case CLEAR_QUEUE: {
      return {
        ...state,
        queue: []
      };
    }
    case SET_ORDER: {
      return {
        ...state, 
        queue: action.payload
      };
    }
    case SET_NEXT_ENTRY: {
      return {
        ...state, 
        nextEntry: action.payload
      };
    }
    case SET_PREVIOUS_ENTRY: {
      return {
        ...state, 
        previousEntry: action.payload
      };
    }
    case SET_CURRENT_ENTRY: {
      return {
        ...state, 
        currentEntry: action.payload
      };
    }
    case SET_LOOP: {
      return {
        ...state, 
        loop: action.payload
      };
    }
    default:
      return state;
  }
}

export default queueState;
  