
export default function usersReducer(state={data:{}},action) {
    switch(action.type){
        case 'AUTH_USER':
            return {...state,data:{...action.payload}}
        default:
            return state;
    }
}