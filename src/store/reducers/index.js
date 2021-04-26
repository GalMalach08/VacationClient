import { combineReducers } from 'redux';
import vacations from './vacations_reducer';
import users from './users_reducer'

const appReducers =combineReducers({
    users,
    vacations
})
export default appReducers; // this goes to the index of the store and helps build the store