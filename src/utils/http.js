import axios from 'axios'
import store from '../redux/store'

axios.defaults.baseURL = "http://localhost:5000"

axios.interceptors.request.use(
  (config) => {
    store.dispatch({
      type: 'changeLoading',
      payload: true
    })
    return config
  },
  (error) => {
    return new Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    store.dispatch({
      type: 'changeLoading',
      payload: false
    })
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)