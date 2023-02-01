import { AuthResponse } from './../types/auth.type'
import http from 'src/utils/http'

const authApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body),

  loginAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body),

  logout: () => http.post('/logout')
}

export default authApi
