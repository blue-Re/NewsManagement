import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../views/Login/Login'
import NewsSandBox from '../views/NewsSandBox/NewsSandBox'

export default function index() {
  const isAuth = () => {
    return (
      localStorage.getItem("token") ? <NewsSandBox/> : <Redirect to="/login"/>
    )
  }
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" render={ () => isAuth() } />
      </Switch>
    </HashRouter>
  )
}
