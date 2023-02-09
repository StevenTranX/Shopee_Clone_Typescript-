## Flow của chức năng filter

Chúng ta có data truyền về từ api như sau
`/products`

Ví du: `products?page=1&limit=30`
Method: GET

Query Params:

- `page`: number. Số trang. Mặc định là 1
- `limit`: number. Số product trên 1 trang. Mặc định là 30
- `order`: 'desc' || 'asc'. Sắp xếp theo thứ tự. Mặc định là 'desc'
- `sort_by`: 'createdAt' || 'view' || 'sold' || 'price'. Sắp xếp theo trường. Mặc định là 'createdAt'.
- `category`: categoryId. Lọc sản phẩm theo category
- `exclude`: productId. Loại trừ sản phẩm nào đó
- `rating_filter`: number. Lọc sản phẩm có số sao lớn hơn hoặc bằng rating_filter
- `price_max`: number. Giá cao nhất
- `price_min`: number. Giá thấp nhất
- `name`: string. Tên sản phẩm (lưu ý Tên sản phẩm tiếng Việt phải gõ đầy đủ dấu)

Response

```json
{
  "message": "Lấy các sản phẩm thành công",
  "data": {
    "products": [],
    "pagination": {
      "page": 1,
      "limit": 30,
      "page_size": 2
    }
  }
}
```

Ở đây chúng ta có data trả về như trên ở Component ProductList, và data được truyền xuống Component `SortProductList` là

  <SortProductList queryConfig={queryConfig} totalPage={data?.data.data.pagination.page_size} />

queryConfig này chính là các config của URL, như '/products`?page=1&limit=10`'

> Nên khi ta cập nhật queryConfig ở component <SortProductList/>, thư viện react-query sẽ cập nhật gọi lại api cho chúng ta ( không cần sử dụng useEffect )

```js

const { data } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true
  })
// queryConfig đặt trong queryKey thì khi queryConfig thay đổi, queryFn sẽ tự gọi api
```

### Demo chức năng click vào Phổ biến thì API cập nhật.

# Phân tích chức năng <button> Phổ biến </button>

1. Đầu tiên, khi user bấm vào Phổ biến, ta phải làm chức năng active, để biết đang ở filter nào

2. Ta phải truyền hàm handleSort vào onClick để thay đổi URL

   2.1 Để thay đổi URL vào onClick, ta navigate và lại dùng <createSearchParams> từ react-router-dom

   2.2 Syntax để thay đổi :

```js
const { sort_by = sortBy.view } = queryConfig

const handleSort = (sortValue) => {
  navigate({
    pathname : /products,
    search : createSearchParams({
      ...queryConfig,
      sort_by : sortValue
    }).toString()
  })
}

<button onClick={() => handleSort('view')}>Phổ biến</button>

```

## Làm chức năng active khi người dùng nhấn vào button để đổi css ?

Tạo 1 function isActive rồi dùng thư viện className để làm custom class

```js
const isActiveSortBy = (soryByValue) => {
  return sortByvalue === queryConfig.sort_by
}
;<button
  className={
    (classNames('cursor-pointer text-center text-sm capitalize'),
    {
      'bg-orange text-white hover:bg-orange/80': isActiveSortBy,
      'bg-white text-black hover:bg-gray-300': !isActiveSortBy
    })
  }
  onClick={() => handleSort('view')}
>
  Phổ biến
</button>
```
