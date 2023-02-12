## Logic quantity controller

> > Vấn đề đặt ra, làm sao có thể quản lý và tái sử dụng được component Quantity Controller mượt mà ?

1. Tạo 1 component Quantity Controller - cho nhận vào các prop là count từ state, và hàm để quản lý tăng giảm, cùng với custom className

2. Ở component này, ta sẽ viết các props để nhận vào như sau

- onIncrease : khi increase thì gọi hàm gì

- onDecrease : khi decrease thì gọi hàm gì

- onType : khi user nhấn vào thì sao

- max : giá trị max của sản phầm

- value : giá trị count trong ô input

- classNameWrapper : className bọc lại component để custom

- ...rest : để bung ra các props còn lại

3. Logic xử lý quantity của controller bên shopee

- Mặc định count là 1

- Khi người dùng nhập quá giá trị max thì count auto thành max

- Người dùng nhập text không được, chỉ nhập số

4. Viết hàm

```js
increase = () => {
  // kỹ thuật lính canh
  let _value = Number(value) // value ở component cha truyền xuống

  if (max !== undefined && _value > max) {
    _value = max
  }
  return onIncrease && onIncrease(_value)
  // nếu có inIncrease thì trả về onIncrease với giá trị _value
}

decrease = () => {
  let _value = Number(value)

  if (_value < 1) {
    _value = 1
  }
  return onDecrease && onDecrease(_value)
}
```

2 hàm trên để vào button của component, giờ viết hàm xử lý input

```ts
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  let _value = Number(event.target.value)

  if (max !== undefined && _value > max) {
    _value = max
  }
  if (_value < 1) {
    _value = 1
  }

  return onType && onType(_value)
}
```

5. ở component cha tạo state count , gọi <QuantityController> và truyền prop như sau

```js
const [buyCount, setBuyCount] = useState(1)
const handleBuyCount = (value: number) => {
  setBuyCount(value)
}
//...
;<QuantityController
  onDecrease={handleBuyCount}
  onIncrease={handleBuyCount}
  onType={handleBuyCount}
  value={buyCount}
  max={product.quantity}
/>
// Vậy nên khi decrease, increase, type thay đổi thì đều gọi hàm handleBuyCount để cập nhật lại state buyCount
```
