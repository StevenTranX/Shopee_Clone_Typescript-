## Flow của việc cài đặt axios và Api như thế nào ?

1 Đầu tiên ta tạo 1 class constructor Http, nhớ khai báo kiểu dữ liệu, rồi tạo property instance = axios.createInstance({
// trong này khai báo baseUrl, headers, config ....
})
2 tạo 1 http class Http rồi export http

```js
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
```

3 Sau khi đã có http, t tạo 1 folder api cho mỗi category như product, hay profile/ user, authentication

```js
const authApi = {
  login(data) {
    return http.post('/login', data)
  }
}
sau đó export default authApi

```

4 Sau khi setUp xong Api, bây giờ ta gọi api rất gọn và clean

```js
const loginAccountMutation = useMutation({
  mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.loginAccount(body)
})
```
