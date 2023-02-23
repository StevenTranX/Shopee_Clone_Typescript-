# Flow của trang update profile

## UI - Làm sao để render ra các option từ 1990 - 2023 bằng cách map thay vì tự ghi tay hết từ 1990

- Trong lodash có hỗ trợ 1 hàm là hàm range (), nhận vào 2 tham số start và end

ví dụ : range( 1 - 200) -> [1, 2, ... 199]
lưu ý : array không bao gồm end

```ts
{
  range(1990, 2024).map((item) => (
    <option value={item} key={item}>
      {item}
    </option>
  ))
}
```

## Flow làm form profile :

1. Ở profile, khao báo useForm, lấy các properties cần thiết để sử dụng như register, formState : {errors}, handleSubmit....

2. Khai báo validation userSchema và export

```js
export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Ngày không hợp lệ, vui lòng chọn ngày chính xác'),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_password: schema.fields['confirm_password']
})

export type UserSchema = yup.InferType<typeof userSchema>
```

3. Sau khi có userSchema , khai báo resolver và tiến hành làm ở component profile

### Vậy làm sao để fill thông tin user lên trên form profile ?

> Gọi API get profile = useQuery

> Sau đó dùng useEffect để setValue thay vì dùng default Values như ngày trước, ( vì default Values chỉ cập nhật vào lần đầu tiên khi re-render )

```js
useEffect(() => {
  if (profile) {
    setValue('name', profile.name)
    setValue('phone', profile.phone)
    setValue('address', profile.address)
    setValue('avatar', profile.avatar)
    setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
  }
}, [profile, setValue])
```

###

4. Với những input đơn giản như tên hay địa chỉ, chỉ cần truyền register và name

5. Với component phức tạp số điện thoại thì dùng input Number và controller

6. component Date là 1 component phức tạp nên ta tạo ra 1 cpn riêng < DateSelect > và dùng chúng với <Controller >

## Xử lý DateSelect

### Lưu ý về phần date select :

Api từ sever chỉ trả ra có 1 cái date_of_birth là 1 string thôi, nhưng trên giao diện thì lại chia ra 3 ô select riêng, ngày , tháng , năm, nên ta sẽ phải xử lý trong 1 localState là [date , getDate()] để khi `onChange` thì gửi date lên.

> Vậy suy ra ta sẽ có `1 object state` { date. date, date.month, date.year} , khi component lấy data từng loại thì truyền từng thằng xuống, còn khi `onChange` từ component cha để gọi api thì ta sẽ convert như thế này

```js
onChange && onChange(new Date(date.date, date.month, date.year))
```

> onChange để update lên UI thì đơn giản chỉ cần dùng setDate()

### DateSelect

DateSelect nhận vào value, onChange và errorMessage là props

- value nhận từ component cha chính là `field.value` ( để lấy ngày tháng hiện tại trên UI )

- `onChange` để khi `DateSelect` cập nhật thì `handleChange` gọi setState() và onChange( date ) , để cập nhật lên UI

Khởi tạo localState =>

```js
const [date, setDate] = useState({
  date: value?.getDate() || 1,
  month: value?.getMonth() || 0,
  year: value?.getFullYear() || 1990
})
```

vì sao value?.getDate() || 1 =>

- vì value truyền từ component cha, chính là ngày hiện tại để cập nhật UI
- || 1 vì nếu không có value thì lấy 1, ngoại trừ component bị undefined và render trang trắng
- .getDate() là 1 hàm từ prototype `Date()` , cho phép ta lấy ngày từ chuỗi string value ISO 8601

> Set prop cho components
> Bộ 3 combo : handleChange, name , value

```js - DateSelect
<select
  onChange={handleChange}
  name='date'
  className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
  value={value?.getDate() || date.date}
>
  <option disabled>Ngày</option>
  {range(1, 32).map((item) => (
    <option value={item} key={item}>
      {item}
    </option>
  ))}
</select>
```

```js - DateSelect
useEffect(() => {
  if (value) {
    setDate({
      date: value?.getDate(),
      month: value?.getMonth(),
      year: value?.getFullYear()
    })
  }
}, [value])
```

```js - DateSelect
const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const { value, name } = event.target
  const newDate = {
    date: value?.getDate() || date.date,
    month: value?.getMonth() || date.month,
    year: value?.getFullYear() || date.year,
    [name]: Number(valueFromSelect)
  }
  setDate(newDate)
  onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
}
```

> Sau khi DateSelect hoạt động tốt rồi thì xử lý onSubmit, nhớ setPRofile lại trong context để các cpn các xài chung, và set lại localStorage
