## Thuật toán xử lý rating

`Chuẩn bị : Css cho 2 ngôi sao ( 1 cái màu vàng - 1 cái màu xám ) đè lên nhau và ngôi sao màu vàng có width 50% để hiện ngôi sao 1 nửa vàng 1 nửa xám `

`Vậy suy ra => width : 100% là full màu vàng, 0% là full xám `

> rating = 3.4

// 1 <= 3.4 => width 100%
-> sao thứ 1 < 3.4 nên độ dài 100%

// 2 <= 3.4 => width 100%

// 3 <= 3.4 => width 100%

// 4 > 3.4 => width 40% ( 4 - 3.4 < 1)
4 lớn hơn 3.4 và 4 - 3.4 < 1 thì ngôi sao width = 40%
`vì sao là 40%, vì lấy phần thập phân 0.4 -> 40%, dùng (rating - Math.floor(rating)) * 100` ( 3.4 - 3 ) \* 100

// 5 > 3.4 => width 0% ( 5 - 3.4 > 1)
Nếu ngôi sao lớn hơn 3.4 và ngôi sao -3.4 > 1 thì ngôi sao này width 0%

> Tóm tắt thuật toán :

`Nếu như sao < rating thì sao full vàng `
`Nếu như sao > rating và sao - rating < 1 ( là ra số thập phân ) thì lấy cái phần thập phân đó làm phần trăm cho màu vàng`
`Nếu như sao > rating và sao - rating > 1 thì trả width về 0% - full xám `
