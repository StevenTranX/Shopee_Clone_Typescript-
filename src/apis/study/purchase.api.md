## Phân tích api

Cũng như thường lệ, ta sẽ import http từ class Http để port cái instance ra method

lần này api sẽ có đường dẫn /purchases/....

nhớ là ta phải khai báo kiểu dữ liệu trả về của api,

```js
export interface SuccessResponse<Data> {
  message: string
  data: Data
}
```

Ở đây là có 1 generic type được tạo ra là `Data` gán cho property `data`

Nên khi khai báo kiểu dữ liệu trả về, ta phải khai báo kiểu Data đó sao cho cụ thể ( ở đây là purchase )

Quay về postman, test api khi success thì trả về có những loại data nào, sau đó khai báo interface

> Lưu ý : api loại add to cart này yêu cầu user phải login

```js
export interface Purchase {
  _id: string
  buy_count: number
  price: number
  price_before_discount: number
  status: number
  user: string
  product: Product
  createdAt: string
  updatedAt: string
}
```

```js
const URL = 'purchases'

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchaseList(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}`, {
      params
    })
  }
}

export default purchaseApi
```

> Ở /purchase có những trạng thái như sau

-1 : sản phẩm đang ở trong giỏ hàng
0 : tất cả sản phẩm, `mặc định`
1 : sản phẩm đang đợi xác nhận từ chủ shop
2 : Sản phẩm đang được lấy hàng
3 : Sản phẩm đang vận chuyển
4 : Sản phẩm đã được giao
5 : Sản phẩm đã bị hủy

-> Ta nên khai báo các status này ở constants

```js
export const purchaseStatus = {
  inCart: -1,
  all: 0,
  waitForConfirmmation: 1,
  waitForGetting: 2,
  inProgress: 3,
  delivered: 4,
  cancelled: 5
} as const

```

-> Rồi quay về purchase.type.ts khai báo statusList

```js
export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5

export type PurchaseListStatus = PurchaseStatus | 0

export interface Purchase {
  _id: string
  buy_count: number
  price: number
  price_before_discount: number
  status: number
  user: string
  product: Product
  createdAt: string
  updatedAt: string
}
```
