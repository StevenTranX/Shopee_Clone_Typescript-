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

2 luồng upload ảnh

### Cụ thể như sau

1. Choose file của input file rất xấu, bây giờ ta muốn làm 1 nút button, khi button thì trigger upload ảnh, ta sẽ làm ntn ?

> Dùng useRef

tạo biến ref, đặt biến ref này vào file input, rồi onChange input = handleUpload, trong hàm handleUpload ta gọi .click() để trigger input đó lên

```js
const [file, setFile] = useState()
const fileInputRef = useRef()
const handleUpload = () => {
  fileInputRef.current.click()
}

<input type = 'file' ref = {fileInputRef} onChange = {onFileChange}  >
<button onClick = {handleUpload}>Upload ảnh<button/>

```

2. Lúc này thì input đã được triggered lên = hàm `onFileChange`, người dùng chọn ảnh, vậy làm sao hiện ảnh lên trên UI

> Lesson : Khi ta cần 1 giá trị phụ thuộc vào giá trị khác, không cần gọi useState chỉ cần đặt biến

Ta cần 1 biến previewImage phụ thuộc vào biến file. và hàm ta cần dùng ở đây là hàm URL.createObjectURL()

> `URL.createObjectURL(object)` sẽ tạo ra 1 string URL dựa vào object đã đưa vào ở trong param
> Lưu ý : object ở đây phải là dạng file, blob, mediasource thì mới tạo được

```js
const onFileChange = (event) => {
  const fileFromLocal = event.target.files[0]
  setFile(fileFromLocal)
  // set lại file của user upload lên
}

const previewImage = useMemo(() => {
  return file ? URL.createObjectURL(file) : ''
}, [file])
// biến previewImage dùng để biến đổi cái file thành 1 object URL
```

3. Sau khi có object URL rồi ta có thể bỏ previewImage vào thẻ img để hiện hình ảnh lên

> previewImage sau khi createObjectURL từ file

'blob:http://127.0.0.1:3000/45ddd962-5239-46c2-a859-ca9d86adc7d4' ( biến file hình ảnh local thành 1 url )

4. Sau khi đã có được url ở local để hiển thị, Tuy nhiên ta cùng cần phải cập nhật url này lên trên server, để update ảnh thì chúng ta có 2 luồng flow như sau

> Flow 1. Khi chọn ảnh từ local -> upload lên server ngay lập tức, server trả về url ảnh
> Nhấn submit thì gửi url ảnh + data form
> Ưu : nhanh, thực hiện riêng lẻ 2 chức năng
> Nhược : người dùng dễ spam chọn ảnh, mỗi lần chọn ảnh lại lưu trên server

> Flow 2 Nhấn upload : không upload lên server ( recommended )
> Nhấn submit thì tiến hành upload server, nếu upload thành công thì tiến hành gọi API update profile.
> Ưu : không lưu ảnh rác lên server
> Nhược : chậm vì thực hiện 2 API, upload rồi mới submit

5. onSubmit -> upload ảnh rồi submit data lên

đầu tiên, ta sẽ cần gọi uploadAvatarMutation để sử dụng, sau đó vào hàm onSubmit gọi mutate

> Lưu ý : onSubmit update profile là dạng form data nên ta phải `new FormData ()` rồi `append` dữ liệu vào

```js

try {
      let avatarName = watchAvatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
}
```

> Lưu ý : data trả về từ server là tên của hình ảnh được generate `abced.png` , sau khi có avatarName, ta có thể gắn vào baseURL để hiển thị

`https://...../images/${avatarName}`

6. sau khi upload và setValue được avatar thì làm gì tiếp theo ?

=> xử lý submit, add thêm avatar vào form khi gửi lên server \

```js
const res = await updateProfileMutation.mutateAsync({
  ...data,
  date_of_birth: data.date_of_birth?.toISOString(),
  avatar: avatarName
})
setProfile(res.data.data)
setProfileToLS(res.data.data)
refetch()
toast.success(res.data.message)
```

7. Sau khi có profile có data, dùng context API để lấy ảnh xuống giao diện

> Lưu ý : data chỉ trả về name, làm sao để thành URL

> Viết 1 hàm getAvatarURL , trả về đầy đủ 'http....'

rồi khi muốn render ra giao diện, bỏ hàm vào src của img

```js
<img src={previewImage || getAvatarURL(profile?.avatar)} alt='' className='h-full w-full rounded-full object-cover' />
```

8. API chỉ xử lý ảnh dưới 1MB, vậy khi data trả ra error ta phải xử lý như thế nào ?

```js
catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }

    export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
```

## Validate upload ảnh

> API không hỗ trợ file hình ảnh quá 1MB và nó phải là định dạng đúng, thì làm sao ta có thể validate

khi ta console event.target.files[0] thì trong file sẽ có 2 yếu tố đó là

lastModifie:1677335376357
lastModifiedDate:Sat Feb 25 2023 21:29:36 GMT+0700 (Indochina Time) {}
name:"210-2104700_front-end-web-development.jpg"
size:222181
type:"image/jpeg"
webkitRelativePath:""

size và type

nên khi onFileChange -> làm if else rồi toast lỗi lên.

nếu như file.size > maxSize hoặc !file.type.inclues('image') -> toast
