## React-router-v6 cung cấp cho chúng ta state khi di chuyển qua lại giữa các trang

B1 . Thêm state khi dùng useNavigate

```js
const navigate = useNavigate()

navigate('/', {
  state: 'Content'
})
```

B2. Gọi state ở trang khác bằng useLocation

```js
const location = useLocation()
```

// => Truy xuất bằng **location.state**

Lưu ý : State vẫn giữ nguyên dù có refresh trang, chuyển trang mới mất
