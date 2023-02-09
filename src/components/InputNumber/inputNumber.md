## Flow data

1. Trong react-hook-form thì đôi khi chúng ta sẽ sử dụng các thư viện UI nên không thể truyền name hay control được nên ta sẽ dùng <Controller> để bọc lại những <Input> của mình mà vẫn có các tính năng của react-hook-form

```js
export default function InputNumber({
  errorMessage,
  className,
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
  classNameError = 'mt-1 text-red-600 min-h-[1rem] text-sm',
  onChange,
  ...rest
}: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}

export default function AsideFilter() {
  <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='đ TỪ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    onChange={(event) => field.onChange(event)}
                    value={field.value}
                  />
                )
              }}
            />
}
```

2. Dùng regex.test() để kiểm tra xem input nhập vào có phải là số không, chỉ nhận số không nhận chữ.

```js
if ((/^\d+$/.test(value) || value === '') && onChange) {
  onChange(event)
}
//* Kiểm tra nếu value nhập vào là số hoặc value rỗng và có hàm onChange thì mới chạy hàm onChange
```
