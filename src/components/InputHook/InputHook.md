## //\* CASE 1 - Làm sao bên typescript để gợi ý ra VALUE của prop A sang prop B

```ts
function Hexa<T extends string>(props: { name: T; lastName: T }) {
  // Khi ta dùng extends string thì với generics type lastName cũng sẽ gợi ý Steven
  return null
}

function App() {
  return <Hexa name='Steven' lastName='' />
}
```

## //\* CASE 2 - Làm sao bên typescript để gợi ý ra kết quả của HÀM prop A sang prop B

```ts
type Gen<TFunc> = {
  getName: TFunc
}
function Hexa2<TFunc extends () => string>(props: { person: Gen<TFunc>; lastName: ReturnType<TFunc> }) {
  // * Thay vì ta dùng Generic Type và extends đơn giản, ta có thể dùng Utility ReturnType để gợi ý trả về kiểu dữ liệu của TFunc
  // * Nhưng lúc này TFunc ta khai báo cho Hexa2 chưa chặt chẽ, nó có thể là string nên ta sẽ extends từ function trả ra string ( ép nó )
  // * Sau khi định nghĩa return Type của lastName rồi ( lúc này là kết quả trả về của prop Person ) thì nó sẽ gợi ý
  return null
}

const handleName: () => 'Steven' = () => 'Steven'

function App2() {
  // lúc này đã gợi ý Steven
  return <Hexa2 person={{ getName: handleName }} lastName='Steven' />
}
```

## //\* CASE 3 - Làm sao bên typescript để gợi ý ra kết quả của HÀM prop A sang prop B - Optimized

```ts
type Gen2<TFunc2> = {
  getName: TFunc2
}
function Hexa3<TFunc2 extends () => string, TLastName extends ReturnType<TFunc2>>(props: {
  person: Gen2<TFunc2>
  lastName: TLastName
}) {
  // * Thay vì viết dài thì ta có thể tạo ra 1 Kiểu dữ liệu TLastName, và khai báo nó chính là kế thừa của ReturnType<TFunc2> cho ngắn gọn
  return null
}

const handleName2: () => 'Steven' = () => 'Steven'

function App3() {
  // lúc này đã gợi ý Steven
  return <Hexa3 person={{ getName: handleName2 }} lastName='Steven' />
}
```

## Lỗi :'onChange' is specified more than once, so this usage will be overwritten.ts(2783) - InputHook.tsx(34, 103): This spread always overwrites this property.

Như ta có thể thấy ở dưới, nếu để {...rest} {...field} thì khi bung ra, các giá trị có thể bị overwrite handleChange

```js
<div className={className}>
  <input className={classNameInput} onChange={handleChange} value={value || localValue} {...rest} {...field} />
  <div className={classNameError}>{fieldState.error?.message}</div>
</div>
```

=> Nên ta phải để ở trước hàm onChange để hàm onChange overide lại

```js
<div className={className}>
  <input className={classNameInput} onChange={handleChange} {...rest} {...field} value={value || localValue} />
  <div className={classNameError}>{fieldState.error?.message}</div>
</div>
```
