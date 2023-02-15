## Xử lý chức năng search trên thanh header

> Situation : Khi user nhập và search thì gọi api và cập nhật lại component

Thường thì ta sẽ sử dụng useEffect và axios, nhưng giờ có thư viện react-query, ta chỉ cần xử lý navigate và update lại searchParams, thì api sẽ tự động gọi, và component sẽ cập nhật

> Lưu ý : component Header và ProductDetail cùng cấp với nhau nên không thể truyền queryConfig được

Ta nên dùng `customHook` để khi gọi đến thì queryConfig được chia sẻ nhanh chóng

```ts
  export type QueryConfig = {
  [key in keyof ProductListConfig]: string

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()
  // useQueryParams để lấy toàn bộ ?page=...?limit=...
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      sort_by: queryParams.sort_by,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  )
  return queryConfig
}
// queryConfig lấy ra những hàm nào KHÔNG BỊ UNDEFINED, vì omit ra isUndefined.
}
```

Sau khi có queryConfig, tiến hành gọi handleSubmit của useForm, kết hợp với useNavigate rồi update params trên URL, rồi submit

Không cần handle lại API vì react-query thấy URL thay đổi thì sẽ tự động cập nhật, cơ chế giống như useEffect

> Situation : Nếu muốn giữ lại những searchConfig như giữ lại order thì sao ?

Vẫn là hàm omit từ lodash, tùy theo nhu cầu của business mà giữ lại hoặc omit ra.

## Lưu ý về mounting của Header và useQuery

- Khi chúng ta chuyển trang thì HEader chỉ bị re-render vì header nằm trong phần mainLayout, mà mainLayout được port vào bởi react-router-dom, nó thông minh để không unmount cái mainLAyout, chỉ render lại thôi

- ( Vẫn trừ trường hợp logout, register vì ko dùng mainLAyout )

- Nên các query này sẽ không có bị inactive => không bị gọi lại => không cần set stale : infinity
