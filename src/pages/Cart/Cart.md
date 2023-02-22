## Thư viện immerJS cho javascript

Thư viện này thay vì ta phải để ý đến tham chiếu - cloning object để dữ liệu không bị thay đổi -> Thì giúp cho dữ liệu của chúng ta BẤT BIẾN

> Syntax : Immer cung cấp 1 API duy nhất nhưng đảm bảo mọi công việc `produce(currentState, producer: (draftState) => void): nextState`

```js - setSTate thông thường
onBirthDayClick1 = () => {
  this.setState((prevState) => ({
    user: {
      ...prevState.user,
      age: prevState.user.age + 1
    }
  }))
}
```

```js - immerJS
onBirthDayClick2 = () => {
  this.setState(
    produce((draft) => {
      draft.user.age += 1
    })
  )
}
```

## Chức năng 1 checkall

> Vấn đề : ta có những ô input check để thanh toán sản phẩm 1 là ta chọn manual, 2 là chọn tất cả.

> > Ta cần biết index của sản phẩm để sản phẩm nào check vào thì `checked : true `

> > Ta cũng cần clone lại `purChaseData` tạo thêm 2 thuộc tính mới ` checked : Boolean` và `disabled : Boolean`.

1. Tạo ra 1 local state mới là extendedPurchase và useEffect để mỗi khi purchaseData thay đổi thì purchaseData sẽ gán vào extendedPurchase cùng với 2 thuộc tính mới

```js
useEffect(() => {
  setExtendedPurchases(
    purchasesInCart?.map((purchase) => ({
      ...purchase,
      disabled: false,
      checked: false
    })) || []
  )
}, [purchasesInCart])
// mặc định là false
```

2. Bây giờ ta đã có data mới, thì tiến hành viết hàm để checked, đầu tiên là handleCheck

```js
const isAllChecked = extendedPurchases.every((purchase) => purchase.checked === true)
```

```js
const handleCheck = (productIndex) => {
  return (event) => {
    setExtendedPurchase(
      product((draft) => {
        draft[productIndex].checked = event.target.checked
      })
    )
  }
}
```

```js
const handleCheckAll = () => {
  setExtendedPurchases((prev) =>
    prev.map((purchase) => ({
      ...purchase,
      checked: !isAllChecked
    }))
  )
}
```

> Giải thích `checked: !isAllChecked`

- `!isAllChecked` là false, nghĩa là các product sẽ có cái không check,

- `isAllChecked` true, tất cả product sẽ phải check

A. Nếu như trong trường hợp đang có sãn phẩm `chưa check`, thì hiện tại `isAllChecked` đang ở trạng thái `false`

=> Click vào chọn tất cả, hàm handleCheckAll được kích hoạt, isAllChecked false => true, thì muốn hàm này true, tất cả sản phẩm phải triggered on lên

B. Nếu sản phẩm tất cả đều được check, thì hiện tại `isAllChecked` đang ở trạng thái `true`

=> Click vào chọn tất cả, hàm handleCheckAll được kích hoạt, isAllChecked `true => false`, hàm này đã false, tất cả sản phẩm thành `false`

# Xử lý chức năng gọi API updateCart khi click vào QuantityControl đồng thời checked vẫn giữ nguyên không biến mất bằng keyBy.

- Gọi API updateCart khi click vào QuantityController

  Viết 1 hàm `handleQuantity` để handle việc này

  - Yếu tố cần đảm nhận

        1. Khi nhấn vào increase hoặc decrease thì API được gọi đồng thời disable input

        2. Khi số sản phẩm < 1 thì không được gọi, > max thì không được gọi

        ```js
         const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([])
         const handleQuantity = (purchaseIndex: number, value: number, enabled: boolean) => {
        if (enabled) {
          const purchase = extendedPurchases[purchaseIndex]
          setExtendedPurchases(
            produce((draft) => {
              draft[purchaseIndex].disabled = true
              // Chuyển trạng thái disabled của sản phẩm trong giỏ hàng thành true
            })
          )
          updatePurchaseMutation.mutate({
            product_id: purchase.product._id,
            buy_count: value
          })
         // GỌI API UPDATE
        }
        }

          <QuantityController
                                  max={purchase.product.quantity}
                                  value={purchase.buy_count}
                                  classNameWrapper='flex items-center'
                                  onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                  onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                  disabled={purchase.disabled}
                                />

        // Ở tham số thứ 3 truyền điều kiện enabled vào
        ```

        # Problem : Tuy nhiên khi ta set `  draft[purchaseIndex].disabled = true` thì lúc này ta không thao tác ở trên quantityController được nữa

        > Nếu làm đơn giản thì ta có thể copy lại và set `disaled` thành false

        ```js
        const handleQuantity = (purchaseIndex: number, value: number, enabled: boolean) => {
          if (enabled) {
            const purchase = extendedPurchases[purchaseIndex]
            setExtendedPurchases(
              produce((draft) => {
                draft[purchaseIndex].disabled = true
                // Chuyển trạng thái disabled của sản phẩm trong giỏ hàng thành true
              })
            )
            updatePurchaseMutation.mutate({
              product_id: purchase.product._id,
              buy_count: value
            })
            // GỌI API UPDATE
          }

          setExtendedPurchases(
            produce((draft) => {
              draft[purchaseIndex].disabled = false
              // Chuyển trạng thái disabled của sản phẩm trong giỏ hàng thành true
            })
          )
        }
        ```

        > Ngoài ra, ta có thể gọi hàm `refetch()` ở react - query để render lại sau khi gọi api, khi render lại thì hàm sẽ chạy vào useEffect, và sẽ set `disabled` lại thành false

    ```js
    const updatePurchaseMutation = useMutation({
      mutationFn: purchaseApi.updatePurchase,
      onSuccess: () => {
        refetch()
        // hàm này sẽ tự động chạy lại khi gọi api thành công
      }
    })
    ```

# Xử lý khi thao tác trên QuantityController thì `checked` cũng bị set lại thành false với `keyBy` từ `lodash`

> Checked của sản phẩm nếu checked phải giữ nguyên giá trị đó

### Tìm hiểu về hàm `keyBy` từ `lodash`

> Hàm keyBy này sẽ tạo ra những object, có `key` là value của tham số thứ 2 mình truyền vào, ( truyền vào id, thì 1 ,2 là key của object )

> Còn giá trị của key ở trên, chính là 1 object ban đầu ( xem kỹ ví dụ )

```js
const demoArr = [
  { id: 1, name: 'Steven' },
  { id: 2, name: 'Steven2' }
]

const keyByObj = keyBy(demoArr, 'id')
console.log(keyByObj)

// => { 1 : { id: 1, name: 'Steven' } , 2 :  { id: 2, name: 'Steven2' }}
```

### Xử lý logic checked với keyBy như thế nào

Vậy với kỹ thuật keyBy từ lodash, ta có thể dễ dàng tìm được các `id` của các sản phẩm `purchase`

```js
const extendedPurchasesObject = keyBy(prev, '_id')
// kết quả
 {
 45789327489237 : {
   _id :   45789327489237 ,
   buy_count : 1
   ...
 }
}

...
```

sau khi đã có object như thế này, việc tìm status `checked` đơn giản hơn, ví dụ ta muốn tìm trạng thái của id đuôi 37, thì ta lấy `45789327489237` chấm tới `checked`

```js
useEffect(() => {
  setExtendedPurchases((prev) => {
    const extendedPurchasesObject = keyBy(prev, '_id')
    return (
      purchasesInCart?.map((purchase) => ({
        ...purchase,
        disabled: false,
        checked: Boolean(extendedPurchasesObject[purchase._id]?.checked)
      })) || []
    )
  })
}, [purchasesInCart])
```

> Recap lại flow :

1. User nhấn vào số lượng tăng hoặc giảm

2. Lúc này cần truyền hàm vào quantityController `handleQuantity`

3. Hàm này sẽ nhận vào **(value, purchaseIndex, enabled )** , value để cập nhật Api, index để biết đang ở sản phẩm nào,` enabled` để loại trừ sản phẩm < 1 hoặc > max

4. Viết hàm updateMutation, để update giá trị lên server, gửi lên id sản phẩm và buy count ( chính là value )

5. gọi hàm updateMutation ở trong `handleQuantity`, set `purchaseList[purchaseIndex].checked = true`

6. Lúc này thì input sẽ bị disabled, phải tắt nó bằng `false` khi rerender

7. Viết thêm 1 useEffect, để khi purchaseInCart thay đổi, thì chạy lại `disabled = false`

8. Xử lý xong disabled thì `checked` cũng sẽ bị `false` khi thao tác trên input dù nó đã đc check trước đó

9. Trong useEffect, xử lý tìm id đang ở sản phẩm nào của `prev` thì lấy checked của sản phẩm đó - Dùng keyBy ở trên

## Xử lý onType và onBlur khi user không tăng giảm mà viết vào

> onType

Khi `onType` thì ở trong hàm `Quantity Controller` sẽ chạy hàm `handleChange` và trả ra `value` cho hàm `onType` khi gọi ở ngoài

```js
const handleTypeQuantity = (index) => (value) => {
  setExtendedPurchase(
    produce((draft) => {
      draft[index].buy_count = value
    })
  )
}
// khi onType được gọi, thì ở dưới onType sẽ được trả ra giá trị, trả giá trị xong nó sẽ gọi hàm handleType, và từ đó set lại buy count
```

> onFocusOUt

Sau khi user nhập xong, user sẽ outFocus, lúc này ta sẽ thực hiện gọi API, tái sử dụng lại hàm handleQuantity, nhưng lúc này chỉ nên gọi khi value >= 1, < max, và so với giá trị cũ thì khác nhau mới gọi, giống nhau không gọi.

```js

 const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value))
  }
// Hàm này ở QuantityController
// * onFocusOut
 (value) => handleQuantity(   index,
                                  value,
                                  value <= purchase.product.quantity &&
                                    value >= 1 &&
                                    value !== (purchasesInCart as Purchase[])[index].buy_count)

// Gọi hàm khi onFocusOut

```

> ? Vì sao không so sánh với giá trị mới luôn ?

Vì hàm `handleTypeQuantity` đã set lại `value buy_count` trong `data mới`, nên so sánh với `data mới` sẽ luôn luôn `bằng nhau`, ta **phải** so sánh với `data cũ`

## handleDelete

> Có 2 trường hợp, 1 là delete từng item, ( nút xóa bên hông)

1. Viết hàm deleteMutation, nhận vào tham số productId khi dùng `deleteMutation.mutate`

2. Viết biến lọc checkedPurchase để chỉ delete những product đang checked thôi

```js
const checkedPurchase = extendedInCart.filter((purchase) => purchase.checked === true)
```

3. viết hàm handleDelete, lấy ra id của product có index tương ứng

```js
const handleDelete = (purchaseIndex: number) => () => {
  const purchaseId = extendedPurchases[purchaseIndex]._id
  deletePurchaseMutation.mutate([purchaseId])
}
```

4. Gọi hàm, truyền index vào

```js
<button onClick={handleDelete(index)} className='bg-none text-black transition-colors hover:text-orange'>
  Xóa
</button>
```

> TH2 : delete nhiều checked products

Viết hàm `handleDeletePurchases` truyền 1 mảng [purchaseIds] vào thay vì chỉ có `1 id`, nhưng muốn tìm được `purchaseIds` thì phải `map` lại `checkedPurchases` để lấy `tất cả` phần tử, rồi truyền hết vào `mutate`

## Chức năng mua ngay

> Tình huống, ví dụ user đang ở trang productDetail thì user click vào mua ngay phải redirect qua trang `Cart` , nhưng khi redirect qua trang cart thì phải chuyển id của sản phẩm đó qua trang cart đồng thời auto checked cái sản phẩm mà mình chọn mua ngay

    Option 1 : Chọn state global là context API

    Option 2 : Chọn state di chuyển giữa các trang bằng useNavigate và useLocation được cung cấp bởi react-router-dom v6  `chọn cái này`

1. Viết hàm buyCount ở component productDetail

```js
const buyNow = async () => {
  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    // Gửi purchaseId để bên trang cart map ra
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }
}
```

2. Ở bên trang `cart` muốn nhận được state từ state của navigate `productDetail` qua thì phải dùng useLocation

Đồng thời khi chuyển qua trang Cart thì phải

```js
const location = useLocation

const purchaseId = location.state.purchaseId
```

3. Lúc này đã lấy được purchaseId, ở bên Cart đã render ra sản phẩm này rồi vì khi ta gọi buyNow thì đã add vô giỏ hàng. việc ta cần làm là xử lý checked

```js
useEffect(() => {
  setExtendedPurchases((prev) => {
    const extendedPurchasesObject = keyBy(prev, '_id')
    return (
      purchasesInCart?.map((purchase) => {
        const hasPurchaseIdFromLocation = purchaseId === purchase._id
        return {
          ...purchase,
          disabled: false,
          checked: hasPurchaseIdFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
        }
      }) || []
    )
  })
}, [purchasesInCart, purchaseId])
```

4. Tuy nhiên. lúc này vấn đề xảy ra, state này được lưu vào history của webAPI, khi ta chuyển qua trang khác thì sẽ bị reset checked, còn f5 lại thì checked vẫn còn.

> Điều ta muốn là ngược lại, khi di chuyển qua các trang thì trạng thái checked vẫn còn lưu ở đó, còn khi ta F5 refresh thì mất check

    >> Di chuyển qua trang vẫn lưu thì ta lưu extendedPurchases vào global state => context APIs để không bị mất khi chuyển trang

    >> F5 Refresh mất thì ra dùng replaceState trong history của trình duyệt - kết hợp với useEffect cleanup - nghĩa là khi component unmounted, thì xóa state trong history -> không còn lưu trạng state purchaseId nữa -> ko có `hasPurchaseIdFromLocation`  sẽ ko checked

    ```js
      useEffect(() => {
    return () => {
      window.history.replaceState(null, '')
    }

}, [])
```
