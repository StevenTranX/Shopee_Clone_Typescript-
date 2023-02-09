# Ở trên shopee ta thấy số tiền hiển thị phần ngàn, ví dụ 65000 -> 65.000

# Và ở phần đã bán ta thấy con số hiện lên là 65k đã bán, làm sao hiện lên được 2 kiểu số này

> 1. 65.000 có nhiều cách nhưng dùng new _Intl.Numberformat_ sẽ rất đa dạng

```js
new Intl.NumberFormat(locales, options)
```

```js
export const formatCurrency = (currency: number) => {
  const formattedCurrency = new Intl.FormatNumber('de-DE').format(currency)
  return formattedCurrency
}
```

> 2 Hiện 65k

```js
export const formatToSocialNumberStyle = (value: number) => {
  return new Intl.FormatNumber('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}
```

`notation : 'compact'` để chuyển thành 000 -> k, 000.000 -> m

> Lưu ý, trong es2021, js đã cho phép ta dùng dấu underscore \_ để làm cho con số chúng ta dễ đọc hơn 6_000_000
