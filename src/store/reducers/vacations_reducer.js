export default function vacationsReducer(state={data:[]},action) {
    switch(action.type){
        case 'GET_VACATIONS':
            return {...state,data:[...action.payload]}
            case 'ADD_VACATION':
            return {...state,data:[...state.data, action.payload]}
            case 'UPDATE_VACATION':
            return {...state,data:[...action.payload]}
        default:
            return state;
    }
}
