# Những cách để tối ưu performance cho app ReactJs

> 1. lazy load () + lighthouse

Vì sao ta phải sử dụng lazy load () , nó có thể làm được gì

Vì khi ta build lên production thì những file build của chúng ta nằm ở thư mục / dist/ , trong thư mục này chỉ có html , css , và file javascript chính, nên khi build lên, file javascript này ( tổng hợp các file js nhỏ ) được chạy. Nếu như app của chúng ta lớn, có hàng trăm hàng nghìn component thì dần dần website performance sẽ bị ảnh hưởng ít nhiều khi trình duyệt phải down 1 file js nặng

Vậy nên, lazy load sẽ chia nhỏ file javascript đó ra, user qua trang nào thì mới bắt đầu chạy js trang đso

syntax

```js
const Login = lazy(() => import ('/.../'))

<Suspense> <Login></Suspense>

```

> 2.  Tree shaking

Tree shaking là 1 kỹ thuật làm cho thư viện chúng ta dùng thay vì phải gọi hết tất cả các hàm trong thư viện đó như `lodash`

ví dụ `import {omit} from 'lodash'`

thì việc này ngoài lấy hàm omit, sẽ phải lấy toàn bộ hàm của lodash và chỉ chọn omit

thay vì `import omit from 'lodash/omit'` thì chỉ lấy mỗi omit thôi

=> Để tối ưu tốt nên lấy 1 hàm thôi thay vì lấy cả thư viện và chọn ra 1 hàm

# Tránh crash trang trắng

1 > Thêm trang not found

2 > Thêm error boundary

# Cải thiện SEO khi title trang thay đổi khi user đổi trang

Dùng `react-helmet-async` để thay đổi title, meta

```js
<Helmet>
  <title>{product.name} | Shopee Clone</title>
  <meta
    name='description'
    content={convert(product.description, {
      limits: {
        maxInputLength: 150
      }
    })}
  />
</Helmet>
```
