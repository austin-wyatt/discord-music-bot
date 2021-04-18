import { Action, QueueState, Track } from "../../types";



const initialState: QueueState = {
    queue: []
};

export const ADD_TRACK = "ADD_TRACK"
export const REMOVE_TRACK = "REMOVE_TRACK"
export const CLEAR_QUEUE = "CLEAR_QUEUE"
export const SET_ORDER = "SET_ORDER"


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
        queue: initialState.queue
      };
    }
    case SET_ORDER: {
      return {
        ...state,
        queue: action.payload
      };
    }
    default:
      return state;
  }
}

export default queueState;
  