## 1. Tổng quát Flow data của Aside Filter :

# I . Category

- Dùng data trả về từ url `/categories` để render ra các thư mục như điện thoại, quần áo ...

- Khi click vào các category thì <active> lên, và gọi lại api với `?category=` mới

> Cũng như flow cũ, setup `type` cho Category để biết loại data trả về ( name , \_id ), setup `categoryApi` để getData

> > gọi APi bằng react-query, không cần tham số

> > > Truyền `queryConfig và categoryData` từ `ProductList` để lấy configURL cũng như data để render

> > > > Dùng categoryData để map ra giao diện, classNames để css active khi isActive === categoryItem.\_id
