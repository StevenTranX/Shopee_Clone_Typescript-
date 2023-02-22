# Data flow chức năng Authorization

- Authentication module : JWT

  - Register
  - Log in
  - Log out

> Flow của Authentication là gì ?

- Chuẩn bị :

  > viết sẵn các hàm lưu, lấy , xóa biến ( access_token ) ở trong local storage

```js
export const setAccessTokenToLS = (access_token: string) => {
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
          setAccessTokenToLS(this.accessToken)
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

## Xử lý accessToken bị hết hạn

> situation : accessToken sau 1 thời gian sẽ bị hết hạn, và khi chúng ta thêm product vào giỏ hàng, message sẽ toast lên `" Token không đúng " 3 lần` và chức năng logout cũng`không hoạt động` vì khi logout ta cần accessToken để gửi lên API để logout

Việc cần làm :

- disable retry của queryClient

```js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})
```

- handle lỗi 401 ( token không đúng )

  1. khi lỗi trả về 401, vào interceptor handle lỗi,

  ```js
  function (error: AxiosError) {
  if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLS()
        }
  }
  ```

  2. xóa localStorage

  3. reset context API

- Nhưng khi xóa localStorage thì muốn cập nhật lại UI phải reload lại trang, ta có thể dùng `window.location.reload () ` để page tự reload lại, lúc này trang của chúng ta sẽ không mang tính web app nữa, -> không được hay

> Ta có thể dụng `new Event Target` và `new Event `( tạo 1 sự kiện ) rồi để bên App lắng nghe, sau khi lắng nghe thì reset lại state và clean up sự kiện.

```js auth.ts
const locaStorageEvent = new EventTarget()

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  localStorageEvent.dispatchEvent(clearLSEvent)
}
```

> sau khi bắn 1 event ra rồi, qua file App.ts để lắng nghe sự kiện và handle nó

```js App.ts
const { reset } = useContext(AppContext)

useEffect(() => {
  localEventTarget.addEventListener('clearLS', reset)

  return () => {
    localEventTarget.removeEventListener('clearLS', reset)
  }
}, [reset])
```

> Viết hàm reset từ ` useContext` rồi export ra ( nhớ khai báo kiểu dữ liệu cho reset )

```js
const reset = () => {
  setIsAuthenticated(false)
  setExtendedPurchases([])
  setProfile(null)
}
```
