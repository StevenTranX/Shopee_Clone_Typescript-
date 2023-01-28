import axios, { type AxiosInstance } from 'axios'

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'Application/json'
      }
    })
  }
}

const http = new Http().instance

export default http
