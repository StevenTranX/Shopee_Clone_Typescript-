## Viết 1 function tính được số % đã giảm giá dựa vào giá tiền trước và sau giảm giá

```ts
function rateStale(orginal, sale) {
  return Math.round(((original - sale) / original) * 100)
}
// Đầu tiên lấy gốc - sale để biết được phần đã giảm

// Sau đó chia cho số tiền gốc rồi nhân 100 để từ số thập phân sale -> phần trăm sale
```

## Ngăn chặn việc tấn công của xss

> Chức năng render description, data từ server trả về là 1 đoạn mã html, vậy nên nếu lỡ trong đoạn mã html ấy có nhúng các đoạn mã javascript thì nguy cơ chúng ta bị xâm nhập, bị lấy accessToken rất là nguy hiểm.

> Nếu chúng ta chỉ đơn thuần là render `{product.description}` vào thẻ div, thì jsx sẽ ngăn chặn việc này bằng cách render ra chuỗi string chứ không ra cấu trúc HTML

> > Để render được cấu trúc html, ra phải dùng property dangerousSetInnerHTML, đồng nghĩa với việc chúng ta đang bị nguy hiểm, và có thể bị hacker tấn công

> > Để báo hiệu được nguy cơ này, reactJs có cung cấp cho chúng ta 1 property tên là dangerousSetInnerHTML

`Vậy nên, ta nên dùng thư viện DOMpurify để loại bỏ những phần xử lý javascript khi data từ server trả về - Thư viện này giúp chúng ta dù có đoạn mã js nhưng chỉ thực thi đoạn mã html thôi `

```js

                  <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              />
            </div>

```

## Làm sao để xử lý render 5 tấm ảnh slider từ data trả về

1. Đầu tiên ta tạo 1 cái useState currentIndexImages và set default value là [0,5] -> tại sao ?

Để khi user hover vào hình thì ta sẽ setState lại để cập nhật index

2. Dùng useMemo để tránh render nhiều, kết hợp hàm slice để lấy được start và end để cắt array

```js
const currentImages = useMemo(() => {
  product ? product.images.slice(...currentIndexImage) : []
}, [product])
```

3. Map currentImage ra giao diện, vì `slice( 0, 5)` nên chỉ lấy 5 hình từ data trả ra

## Làm sao để khi user hover vào ảnh nhỏ, thì ảnh lớn sẽ thay đổi

1. Tạo state `activeImage` và `setActiveImage` mặc định string rỗng

2. Tạo function chooseActive để set lại activeImage mỗi lần hover vào

```js
function chooseActive(img) {
  setActiveImage(img)
}
```

3. Khi user hover ( `onMouseEnter` ) thì gọi function `chooseActive` (img) - img này từ render

4. Trong phần render ảnh lớn, set lại src của ảnh là activeImage

5. Tuy nhiên khi component khởi tạo, giá khị khởi tạo của activeImage là string rỗng nên ta phải set activeImage mỗi khi khởi tạo để hình không bị trống bằng useEffect

```js
useEffect(() => {
  if (product && product.images.length > 0) {
    // Kiểm tra product và product images api có tồn tại dữ liệu hay không
    setActiveImage(product.images[0])
  }
}, [product])
```

## Flow xử lý chức năng next hình và previous hình thì chuyển qua hình mới

> Tình huống : Chúng ta có array 8 phần tử từ API trả về, vậy làm sao khi bấm next thì component chứa array cũ [0 , 1 ,2 , 3 , 4 ,] render lên lại thành [ 1 ,2 ,3 ,4 5]

1. Đầu tiên ta sẽ viết function next và previous

```js
const next = () => {
  if (currentIndexImages[1] < product.images.length)
  setCurrentIndexImages(prev => [prev[0] + 1, prev[1] + 1])
}

Hàm ở trên có ý nghĩa gì ? -> Hàm ở trên khi được invoke, thì sẽ trả ra 1 array mới dựa trên index cũ + 1, ví dụ array cũ [0,5] -> array mới [1,6]
Nhưng phải thỏa điều kiện là vị trí thứ 2 của array phải < số lượng ảnh mà data trả về

```

2. Ta bỏ 2 function next và previous vào 2 button

3. Để render được currentImages thì phải bỏ dependency của currentIndexImages để khi array cập nhật lại [1,6] hay [2,7] thì component sẽ cập nhật lại hình mới lại

```js
const currentImages = useMemo(
  () => (product ? product?.images.slice(...currentIndexImages) : []),
  [product, currentIndexImages]
)
```

## Flow và Xử lý chức năng zoom hover

> Tình huống : Khi user hover vào hình, ta sẽ xử lý handleZoom để bức tranh phóng to lên, vậy ta sẽ làm như thế nào

1. Đầu tiên khi ta inspect vào ảnh thì ta thấy được bức hảnh có 2 size :

rendered size : `397 x 397x`

Intrinsic size : `720 x 720` ( intrinsic : bản chất bên trong )

Vậy nên, ý tưởng là khi ta hover vào, thì thẻ div chứa hình ảnh, sẽ render ra hình ảnh gốc cho nó to lên, dùng thêm overflow-hidden che phần bị lòi ra ngoài

> Vậy chúng ta cần những yếu tố nào để làm chức năng này ?

> > 1.  Khi user hover vào gọi handleZoom - `onMouseMove` - ngược lại là `onMouseLeave`

> > 2.  Trong hàm handleZoom, cần lấy ra tọa độ của thẻ div như x, y , width, height, top .... ( hàm `event.currentTarget.getBoundingClientRect()`)

![Alt text](./Imgs/zoom2.png 'Title')

> > 3. Sau khi có tọa độ thẻ div, ta cũng cần phải lấy được tọa độ - thông tin của thẻ img -> useRef vào img

> > 4. Cần hiểu về khái niệm offsetX và offsetY, offsetX là tọa độ của chuột so với chiều ngang, offsetY là tọa độ của chuột so với chiều dọc của thẻ div gọi hàm handleZoom

> > 5.  Tính được thuật toán của top và left khi hover để gán lại cho imageRef

![Alt text](./Imgs/zoom6.png 'Title')

```js
const handleZoom = (event) => {
  const image = imageRef.current
  const rect = event.currentTarget.(getBoundingClientReact())
  const {naturalWidth, naturalHeight} = image
  const {offsetX , offsetY} = event.nativeEvent()
  // Gọi những thứ ta cần


  const top = offsetX * (1 - (naturalHeight / rect.height))
  const left = offsetY * (1 -(naturalWidth / rect.width))

  image.style.top = top + 'px'
  image.style.left = left + 'px'
}

```

> > 6.  Vì sao `const top = offsetX * (1 - (naturalHeight / rect.height))`

Vì zoom này khi user hover vào, bức ảnh sẽ chạy theo chiều ngược của con trỏ chuột, ví dụ hover xuống thì bức ảnh chạy lên

nên ta sẽ lấy 0 hoặc 1 - ( `định vị chuột * ảnh khi zoom` ) để có hiệu ứng như trên

Cuối cùng ta tính định vị chuột KHI ĐANG ZOOM bằng cách

`const top = vị trí chuột hiện tại \* tọa độ số âm của hình đang zoom

> > 7. Hiện tượng bubble event

![Alt text](./Imgs/zoom3.png 'Title')

Khi ta làm handleZoom cho thẻ div, ta sẽ có hiện tượng rất giật khi hover là vì handleZoom cũng đang tính toán cho thẻ con img ở trong, nên lúc nó lấy tọa độ cha, lúc tọa độ con dẫn đến rất giật

=> Solution : thêm sự kiện pointer-events-none cho thẻ img để không tính toán thẻ img nữa

> > 8.  Thuật toán không quan tâm đến bubble event

```js
const offsetX = event.pageX - (rect.x + window.scrollX)
const offsetY = event.pageY - (rect.y + window.scrollY)
```

Tự tính toán offsetX offsetY không thông qua `event.nativeEvent()`

## Xử lý URL thân thiện SEO ?

> Vấn đề : khi ta vào trang chính của shopee.vn thì ta thấy khi vào trang productDetail, tên của sản phẩm xuất hiện ở trên thanh URL, dù ta có xóa thì trang shopee vẫn hoạt động bình thường vì nó chỉ gọi theo ID mà thôi. Vậy ta sẽ generate ra tên của sản phẩm trên thanh URL như thế nào

1. Tạo hàm remove ký tự đặc biệt

```js
const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')
```

2. Tạo hàm generate ra từ dãy string của hàm `removeSpecialCharacater`

```js
const generateNameId = (name, id) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}
```

3. Nếu muốn lấy lại id từ nameID đã generate dùng hàm

```js
export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}
```

4. Bỏ hàm mới ( generateNameId ) vào thẻ link của Product để gọi trang detail , rồi từ trang detail, gọi Id từ nameId để call APi như bình thường

## Render thêm sản phẩm ở mục "CÓ THỂ BẠN CŨNG THÍCH " ?

Vẫn kết hợp dùng react-query, tái sử dụng lại code render từ componnent productList

> Khi đã có productDetail trả về từ API, trong api sẽ có category, lấy ra category.\_id để gọi ra tiếp các sản phẩm có config category bằng react-query( dùng hàm `getProducts(queryConfig)`)

Nhưng lần này, `queryConfig` sẽ khác, không dùng từ hook mà là tự config với `category._id` đã trả về

```js
const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }
const { data: productsData } = useQuery({
  queryKey: ['products', queryConfig],
  queryFn: () => {
    return productApi.getProducts(queryConfig)
  },
  enabled: Boolean(product),
  staleTime: 3 * 60 * 1000
})
// Sau khi có productsData render  ra giao diện
```

> Situation1 : Trong productDetail có hàm useEffect, hàm này sẽ tính toán lại product và bị gọi lại nên ở useQuery ta sẽ thêm

```js
useEffect(() => {
  if (product && product.images.length > 0) {
    setActiveImage(product.images[0])
  }
}, [product])
```

```js
enabled: Boolean(product),
```

> Situation2 : Trong productDetail cũng có API render ra giống như productList, để cải thiện performance và tránh gọi Api 2 lần

-> Dùng staleTime ở cả 2 component

## Click "Thêm vào giỏ hàng" thì sẽ add items vào trong Popover giỏ hàng, cùng với đó là hiện tổng số lượng items add vào ở badge

> Chuẩn bị : khai báo type và api cho chức năng purchase này

```js

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
```

> 1 . Khi bấm vào thêm vào giỏ hàng -> gọi đến add-to-cart -> truyền vào `product._id` và localState `buy_count`

```js
  const addToCart = () => {
    addToCartMutation.mutate(
      {
        buy_count: buyCount,
        product_id: product?._id as string
      },)
  }
```

> 2 . Khi đã add to cart thành công, cập nhật lại list ở popOver với api getPurchaseList

```js
const { data: purchasesInCartData } = useQuery({
  queryKey: ['purchases', { status: purchasesStatus.inCart }],
  queryFn: () => purchaseApi.getPurchaseList({ status: purchasesStatus.inCart })
})

const purchasesInCart = purchasesInCartData?.data.data
// ( từ purchasesInCart này render ra)
```

> 3 . Problem : khi ta add to cart thì trong purchaseList ta lại không cập nhật

-> Dùng invalidateQueries trong queryClient

```js
 const addToCart = () => {
    addToCartMutation.mutate(
      {
        buy_count: buyCount,
        product_id: product?._id as string
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['purchases', { status: purchasesStatus.inCart }]
          })
          toast.success(data.data.message, { autoClose: 1000 })
        }
      }
    )
  }
// Nhớ khai báo status bằng chữ để khi mình review hay người khác đọc code thì sẽ dễ hiểu hơn thay vì đọc dòng này
//  queryKey: ['purchases', { status: -1}]
// không hiểu -1 hay 0 là gì cả, magical number :)))
  export const purchasesStatus = {
  inCart: -1,
  all: 0,
  waitForConfirmmation: 1,
  waitForGetting: 2,
  inProgress: 3,
  delivered: 4,
  cancelled: 5
} as const

```

> 4 UI : Trong popover này chỉ có khoảng 5 items thôi, còn lại sẽ hiện ở góc dưới là những sản phẩm còn lại

-> Thì trước khi ta map ra ta phải slice( 0, MaxInCart = 5).map (...).

-> Ngoài ra thì ta sẽ conditional rendering nếu không có sản phẩm nào thì hiện ra hình ảnh không có sản phẩm


