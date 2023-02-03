Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page

[1] 2 3 ... 19 20

1 [2] 3 4 ... 19 20

1 2 [3] 4 5 ... 19 20

1 2 3 [4] 5 6 ... 19 20

1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20

1 2 ... 13 14 [15] 16 17 ...19 20

1 2 ... 14 15 [16] 17 18 19 20

1 2 ... 15 16 [17] 18 19 20

1 2 ... 16 17 [18] 19 20

1 2 ... 17 18 [19] 20

1 2 ... 18 19 [20]

`Phân tích logic của pagination`

> Ví dụ như ta có 20 trang tổng cộng

> Thì range = 2 , range đầu nghĩa là 2 số 1 ,2 range cuối nghĩa là 2 số 19 20

> xung quanh current page luôn luôn có 2 trang kế bên ví dụ `1 2 ... 4 5 [6] 8 9 ... 19 20`

[1] 2 3 ... 19 20 , current_page ở đây là 1, vậy nên 2 3 vẫn còn trong range nên sẽ hiện ra

1 2 [3] 4 5 ... 19 20 , tương tự 1 2 trong range, 4 5 trong range

1 2 3 [4] 5 7 ... 19 20 , vậy tại sao số 1 hiện ra ? => `Vì range đầu ko bị mất đi, 1 ,2 ko bị mất, 19 20 ko bị mất `

> Vậy mấu chốt ở đây chính là dấu 3 chấm trước và sau, viết những câu điều kiện để xuất hiện những dấu 3 chấm hay là không
>
> > Các pagePills sẽ được render ngoại trừ những trường hợp sau đây để thành dấu 3 chấm

> > TRƯỜNG HỢP 1

> > > `currentPage >= RANGE * 2 + 1 , pagePills < currentPage + RANGE, currentPage < TotalPage - RANGE + 1`

? Tại sao lại là currentPage >= RANGE \* 2 + 1

> ? Tại sao pagePill < currentPage + RANGE
> Tại vì RANGE quy định là 2, thì những page nằm ngoài RANGE 2 không được render ví dụ 3 4 [5] 6 7
> ? Tại sao currentPage < TotalPage - RANGE + 1
> Để ngoại trừ trường hợp 2 số cuối , ví dụ 20 - 2 + 1 là thành 19, thì 19 được render ra

> > TRƯỜNG HỢP 2

`if currentPage > RANGE * 2 + 1 && currentPage < totalPage - RANGE * 2` 1 2 ... 14 15 [16] 17 18 19 20
`if pagePill < currentPage - RANGE && pagePill > RANGE`  
`return renderDotBefore`

? Tại sao currentPage > RANGE - 2 + 1 và currentPage < totalPage - RANGE x 2>
Để lấy trường hợp các số > 5 và < 17 >

? Tại sao pagePill < currentPage - RANGE và pagePill > RANGE
-> Để những số > RANGE( 2 ) và những số < Phạm vi range từ page hiện tại trở thành dấu ...

Nếu trang hiện tại > RANGE _ 2 + 1 và Trang hiện tại < Tổng trang - RANGE _ 2
`

> > TRƯỜNG HỢP 3

```js
if (pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
  return renderDotAfter(index)
}
```

Vì sao pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1

> Để tránh render ra RANGE gần kề currentPage, và không render 2 số 19 20

> > TRƯỜNG HỢP 4

```js
 if (currentPage >= totalPage - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
          return renderDotBefore(index)
```

Vì sao currentPage >= totalPage - RANGE \* 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE

> Đây là trường hợp cho số 19 20, currentPage có thể là 19 hoặc 20 ( currentPage >= totalPage - RANGE \* 2) và số trang lớn hơn RANGE và số trang < trang hiện tại - 2

```js
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <button key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer'>
            ...
          </button>
        )
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <button key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer'>
            ...
          </button>
        )
      }
      return null
    }
    return Array(totalPage)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
          return renderDotAfter(index)
        } else if (currentPage > RANGE * 2 + 1 && currentPage < totalPage - RANGE * 2) {
          if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (currentPage >= totalPage - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <button
            className={classNames('bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border', {
              'border-cyan-500': pageNumber === currentPage,
              'border-transparent': pageNumber !== currentPage
            })}
            onClick={() => {
              setPage(pageNumber)
            }}
          >
            {pageNumber}
          </button>
        )
      })
  }
}
```
