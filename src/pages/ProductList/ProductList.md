## Cách xử lý filter thông qua url, không cần phải dùng state trong component

> Như đã học thì ta lấy object của string các config của url bằng hook useQueryParams
> Hook này

```js
import { useSearchParams } from 'react-router-dom'

export default function useQueryParams() {
  const [searchParams] = useSearchParams()
  return Object.fromEntries(searchParams)
}
```

> Những nếu lỡ user muốn tự ý thêm các config như value, hay sửa lại limit thì ta phải bảo vệ url ntn ?

1. Tạo 1 queryConfig từ object của queryParams
2. Dùng hàm omitBy và isUndefined từ lodash để lọc ra những thuộc tính nào bị undefined, vì khi url chưa có những config như sort_by hay order thì queryConfig sẽ có những giá trị undefined

```ts
const queryConfig: QueryConfig = omitBy(
  {
    page: queryParams.page || '1',
    limit: queryParams.limit || '20',
    sort_by: queryParams.sort_by,
    name: queryParams.name,
    order: queryParams.order,
    price_max: queryParams.price_max,
    price_min: queryParams.price_min,
    rating_filter: queryParams.rating_filter
  },
  isUndefined
)
```

3. Lúc này ta đã có config, thì chỉ cần lấy { page, limit ... } từ queryConfig ta có thể truyền xuống cho Component Pagination

## Vậy khi người dùng bấm vào số trang, ta sẽ làm như thế nào để update config lên url, ví dụ bấm vào trang 2, thì url sẽ cập nhật ?page=2 ?

> Trong thư viên react-router-dom có cung cấp hàm tên là createSearchParams , hàm này nhận vào 1 object, pathname để lấy baseUrl, và search để truyền các settings vào

```js
<Link
  to={{
    pathname: path.home,
    search: createSearchParams({
      ...queryConfig,
      page: pageNumber.toString()
    }).toString()
  }}
  className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
    'border-cyan-500': pageNumber === currentPage,
    'border-transparent': pageNumber !== currentPage
  })}
>
  {pageNumber}
</Link>
```

`Lưu ý : ta phải clone queryConfig để giữ các settings khác ngoài page của queryConfig ( kiến thức tham trị, tham chiếu ), rồi mới thay đổi page`

## Khi url cập nhật page , thì list các product bị giật vì đang có data -> undefined, làm sao để khắc phục ?

```js
useQuerry({
  keepPreviousData: true
})
```

## Thẻ <Link> vs <button navigate()> ?

> 2 thẻ này đều dẫn tới 1 url mới, nhưng sự khác nhau ở đây là thẻ Link khi user chuột phải vào thì có thể link ra 1 tab mới, copy address......

- Vậy nên khi ta xử lý phân trang, nên dùng thẻ <Link> để user có thể mở ra 1 lúc nhiều tab, hoặc là những thẻ home, about, contact...

- Nhưng khi button apply các filter, button áp dụng .... thì ta sẽ dùng thẻ button với navigate.
