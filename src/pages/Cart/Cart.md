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
