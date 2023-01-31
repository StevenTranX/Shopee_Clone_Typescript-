# Data flow chức năng Authorization

- Authentication module : JWT

  - Register
  - Log in
  - Log out

> Flow của Authentication là gì ?

- Chuẩn bị :

  > viết sẵn các hàm lưu, lấy , xóa biến ở trong local storage

```js
export const saveAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const clearAccessTokenFromLS = () => {
  localStorage.removeItem('access_token')
}
export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''
```

> tạo 1 file App context để bọc lại component App để dùng state global

```js - viết Context

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  return <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>{children}</AppContext.Provider>
}

```

`Khi user đăng ký, ta sẽ vào class constructor của Http để khai báo biến tên là accessToken `

=> `Sau đó dùng kỹ thuật interceptors của Axios cung cấp để can thiệp vào data khi gửi request hoặc response lên server`

=> `Kiểm tra : nếu như url trả về là /login hoặc /register thì ta lưu access_token của server vào trong localStorage , nhớ phải handle lỗi dựa vào message lỗi của server trả ra   `

```js - lưu accessToken

(response) => {
        const { url } = response.config
        if (url === '/login' || url === '/register') {
          this.accessToken = (response.data as AuthResponse).data.access_token
          // lưu biến vào biến accessToken đã khai báo
          saveAccessTokenToLS(this.accessToken)
          // lưu biến này vào trong LocalStorage
        } else if (url === '/logout') {
          this.accessToken = ''
          clearAccessTokenFromLS()
        }
        return response
      },
```

```js - handle lỗi

 function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
```

=> `Sau khi handle access_token xong, quay lại chức năng login / register, lấy hàm setIsAuthenticated từ useContext( AppContext ) set bằng true`
=> `Từ trạng thái isAuthenticated , Viết 1 hàm ở Route để bảo vệ component, nếu như true, thì mới cho vào component ví dụ như profile, còn không thì chuyển sang trang Login `

```js - Component protected và rejected
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
```
