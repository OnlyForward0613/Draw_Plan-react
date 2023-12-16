import {
    RETRIEVE_DATA
  } from '../actions/types';


const initialState = {
    data: null
};

function adminReducer (state = initialState, action){
    const {type, payload} = action;

    switch(type){

        case RETRIEVE_DATA:
            return {
                ...state,
                data: payload
            }
        default:
            return state;
            break;
    }

}

export default adminReducer