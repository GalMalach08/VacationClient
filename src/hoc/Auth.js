import React, { useState, useEffect } from 'react' // imrse
import { useHistory } from "react-router-dom"
        
export const authGaurd = (ComposedComponent, setIsAuthenticate) => {
    const AuthenticationCheck = (props) => {
        const history = useHistory()
        const [isAuth, setIsAuth] = useState(false)

        const isUserAuthenticate = async () => {
          const response = await fetch('/auth/isauth')
          const { success } = await response.json()
          if (success) {
            setIsAuthenticate(true)
            setIsAuth(true) 
            if(props.match.path === '/chart') {
              const user = JSON.parse(localStorage.getItem('user'))
              if(user.admin) {
                console.log('auth as admin')
              } else {
                console.log('not auth as admin')
                history.push('/')
              }
            }
          }
          else {
            setIsAuthenticate(false)
            setIsAuth(false)
            console.log('not auth')
            history.push('/signin')
          } 
        }     
        useEffect(() => {
           isUserAuthenticate()
        }, [])
        
          return(
            <>
            { isAuth ?
             <ComposedComponent {...props} /> 
            : null}
            </>
            )
        }
    return AuthenticationCheck
}
    



        