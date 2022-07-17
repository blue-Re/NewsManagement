import React from 'react'
import RouterIndex from './router/index'
import './App.css'
import { Provider } from 'react-redux'
import store from './redux/store'

export default function App() {
  return (
    <Provider store={store}>
      <RouterIndex></RouterIndex>
    </Provider>
  )
}
