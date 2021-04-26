import React,{ useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const LogOut = ({ setIsAuth }) => {
    const history = useHistory()

    const logOut = async () => {
        setIsAuth(false)
        localStorage.removeItem('user')
        // await fetch('/auth/logout')
        history.push('/signin') 
    }
    
    useEffect(() => {
        logOut()
    }, [])

    return null   
}

export default LogOut
