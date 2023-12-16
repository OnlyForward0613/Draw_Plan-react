import {
    SAVE_RESULT
} from '../actions/types';

const initilaState = {
    data : null
};

function resultReducer (state = initilaState, action) {
    const {type, payload} = action;

    switch(type) {
        case SAVE_RESULT:
            return {
                ...state,
                data: payload
            }
        default:
            return state;
    }
}

export default resultReducer