import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../views/Login/Login'
import Detail from '../views/News/Detail'
import News from '../views/News/News'
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
        <Route path="/news" component={News} />
        <Route path="/detail/:id" component={Detail} />
        <Route path="/" render={ () => isAuth() } />
      </Switch>
    </HashRouter>
  )
}
