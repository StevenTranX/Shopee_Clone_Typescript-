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
