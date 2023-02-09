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
