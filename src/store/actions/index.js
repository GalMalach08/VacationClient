export const setVacationsState = (vacations) => ({ 
    type:'GET_VACATIONS',
    payload:vacations
})
export const authUser = (user) => ({ 
    type:'AUTH_USER',
    payload:user
})

export const addVacationToRedux = (vacation) => ({ 
    type:'ADD_VACATION',
    payload:vacation
})

export const updateVacations = (vacations) => ({ 
    type:'UPDATE_VACATION',
    payload:vacations
})



