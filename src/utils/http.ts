import path from 'src/constants/path'
import { clearLS, getAccessTokenFromLS, setProfileToLS } from 'src/utils/auth'
import { AuthResponse } from './../types/auth.type'
import { HttpStatusCode } from './../constants/httpStatusCode'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import axios, { AxiosError, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { setAccessTokenToLS } from './auth'
import config from 'src/constants/config'

// TODO : viết handle xử lý lưu access_token vào local storage khi response trả về
class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    // ?? tại sao thay vì chỉ cần dùng hàm getAccessTokenFromLS để lấy được accessToken rồi, ta lại còn phải khai báo accessToken ở trong
    // ?? class constructor để làm gì nữa ?
    // * vì khi ta dùng getAccessTokenFromLS là ta truy xuất dữ liệu ở LS, mà làm như vậy là truy xuất vào trong ổ cứng
    // * còn ta khai báo biến accessToken trong constructor thì dữ liệu được truy xuất trên ram
    // * MÀ TRUY XUẤT Ở RAM THÌ LẠI NHANH HƠN Ổ CỨNG
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'Application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === path.register || url === path.login) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          setAccessTokenToLS(this.accessToken)
          setProfileToLS(data.data.user)
        } else if (url === path.logout) {
          this.accessToken = ''
          clearLS()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLS()
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
