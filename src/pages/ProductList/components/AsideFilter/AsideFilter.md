## Tổng quát Flow data của Aside Filter :

# I . Category

- Dùng data trả về từ url `/categories` để render ra các thư mục như điện thoại, quần áo ...

- Khi click vào các category thì <active> lên, và gọi lại api với `?category=` mới

> Cũng như flow cũ, setup `type` cho Category để biết loại data trả về ( name , \_id ), setup `categoryApi` để getData

> > gọi APi bằng react-query, không cần tham số

> > > Truyền `queryConfig và categoryData` từ `ProductList` để lấy configURL cũng như data để render

> > > > Dùng categoryData để map ra giao diện, classNames để css active khi isActive === categoryItem.\_id

# II. Rule validate của price && Cách dùng phương thức test ở trong yup

     Về logic khoản giá này thì nó giống như 1 cái mini Form, thay vì hồi trước mình chưa có exp nên khai báo useForm ở component lớn nhất rồi truyền 1 đống props xuống ( props drilling )
     Ta sẽ khai báo useForm ở component AsideFilter này luôn, rồi chỉ truyền prop 1 cấp xuống InputNumber

    > 1. Đầu tiên ta khai báo `price_max` `price_min` ở rules.ts

    ```js

price_min: yup.string().test({
name: 'price-not-allowed',
message: 'Giá không phù hợp',
test: testPriceMinMax
}),
price_max: yup.string().test({
name: 'price-not-allowed',
message: 'Giá không phù hợp',
test: testPriceMinMax
})

    ```

> 2 Hàm .test() hoạt động như thế nào
> `syntax` :

```ts
Schema.test(name: string, message: string | function | any, test: function): Schema
```

Hàm sẽ nhận 3 tham số : name , message để hiện ra lỗi, và function test để custom cái rule cho riêng chúng ta, sau đó tạo 1 function declarations để dùng từ khóa `this` rồi custom rule.

- lưu ý, phương thức test nên trả ra `true` để báo valid hoặc `false` là invalid

# Validate price

`Nếu có price_min và price_max thì price_max >= price_min`
`Còn không thì có price_min thì không có price_max và ngược lại`

```ts
function testPriceMinMax(this: yup.TestContext<AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  // Đầu tiên lấy price_max, price_min từ object cha là yup.object({})
  if (price_min !== '' && price_max !== '') {
    // Nếu có price_min và price_max
    return Number(price_max) >= Number(price_min)
    // thì trả ra true khi price_max > price_min thôi còn không thì false
  }
  return price_min !== '' || price_max !== ''
  // Nếu tất cả trường hợp ở trên không có thì lấy giá trị của price_min hoặc price_max, còn lại không hợp lệ
}
```

## III. Input Number không nhập được text, xử lý component không nhận register

`Xem logic ở InputNumber.md`

# IV. Xử lý forwardRef để component con có behavior shouldFocusOnError ()

const InputNumber = forwardRef<HTMLInputElement, Props>(function (ref) {
....
sử dụng ref ở trong component
})

# V. Cách tạo type NoUndefined để loại bỏ trường hợp ... | undefined của FormData

```ts
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
// cú pháp `-?` sẽ loại bỏ undefiend của key optional
```

Hiểu nôm na là tạo 1 type tên là NoundefinedField có generic type là <T>

Trong key của generic type đó có type là <NonNullable>

`Phânf này khó `

# VI. Submit khoản giá để cập nhật filter

Logic giống như phần SortProductList, kết hợp navigate và createSearchParams để update gọi lại API.

### Xử lý render ratingStar & handleRemoveAll

# Xử lý render ratingStar

Sau khi có giao diện renderStar với 5 sao - Array(5).fill(0).map() thì ta sẽ xử lý làm sao để render ra được

- 5 sao thì full vàng
- 4 sao vàng 1 sao rỗng
- 3 sao vàng 2 sao rỗng
- 2 sao vàng 3 sao rỗng
- 1 sao vàng 4 rỗng

indexDiv = 0 => indexStar0 -> indexStar 4 yellow `Ở hàng đầu tiên thì sao full màu vàng`
indexDiv = 1 => indexStar0 -> indexStar 3 yellow ` Ở hàng thứ 2 thì 4 sao vàng 1 sao rỗng`
indexDiv = 2 => indexStar0 -> indexStar 2 yellow
indexDiv = 3 => indexStar0 -> indexStar 1 yellow `2 sao vàng`
indexDiv = 4 => `0 sao vàng`

Vậy làm thuật toán nào thì render được tiêu chí ở trên ?

- Ở đây ta có maximum là 5

Vậy điều kiện nào để render ra sao vàng ?

> Điều kiện render ra sao vàng là indexStar < 5 - indexDiv

# Xử lý handleRemoveAll

=> Khi user bấm vào Xóa tất cả, ta sẽ xóa các filter ( ngoại trừ filter sort và page ) trên thanh url

> > Vậy ta vấn sẽ dùng combo navigate và createSearchParams, nhưng lần này không cần clone lại queryConfig, mà sửa ngay chính queryConfig gốc kết hợp với hàm omit của lodash để loại bỏ những hàm mình muốn remove như price_min price_max rating_filter ...

```js
const handleRemoveAll = () => {
  navigate({
    pathname: path.home,
    search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
  })
}
```
