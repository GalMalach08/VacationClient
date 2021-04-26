import React, { useState } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom'; // imrr
import { authGaurd } from './hoc/Auth'
import Home from './components/home/Home'
import Header from './components/header/Header'
import LogOut from './components/logout/LogOut'
import SignIn from './components/SignIn/SignIn'
import SignUp from './components/signup/SignUp'
import Chart from './components/chart/Chart'

const Router = () => {
    const [isAuth, setIsAuth] = useState(false)

    return (
        <> 
            <BrowserRouter>
                {isAuth && <Header/>}
                <Switch>
                    <Route path='/signin' render={() => <SignIn  setIsAuth={setIsAuth}/> } />
                    <Route path='/signup' render={() => <SignUp  setIsAuth={setIsAuth}/> } />
                    <Route path='/chart' component={authGaurd(Chart, setIsAuth)}/>
                    <Route path='/logout' render={() => <LogOut setIsAuth={setIsAuth} /> } />  
                    <Route path='/' component={authGaurd(Home, setIsAuth)}/>
                </Switch>
            </BrowserRouter>
        </>   
    )
}

export default Router