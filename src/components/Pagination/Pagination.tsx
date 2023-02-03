import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

interface Props {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  totalPage: number
}
const RANGE = 2

export default function Pagination({ page: currentPage, setPage, totalPage }: Props) {
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

        // if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
        //   return renderDotAfter(index)
        //   //* logic từ 1 -> 5
        // }

        if (currentPage > RANGE * 2 + 1 && currentPage < totalPage - RANGE * 2) {
          //* logic từ 6 -> 15
          if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
            // * logic hiện dấu 3 chấm của trang hiện tại -2 và sau số 2
            return renderDotBefore(index)
          }

          if (pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
            // * logic hiện dấu 3 chấm của trang hiện tại + 2  và trước 19 20
            return renderDotAfter(index)
          }
        }

        // if (currentPage >= totalPage - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
        //   return renderDotBefore(index)
        //   //* logic từ 16 -> 20
        // }
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
  return (
    <div className='flex flex-wrap mt-6 justify-center'>
      <button className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border'>Prev</button>
      {renderPagination()}
      <button className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border'>Next</button>
    </div>
  )
}

// const renderPagination = () => {
//   let dotAfter = false
//   let dotBefore = false

//   const renderDotBefore = (index: number) => {
//     if (!dotBefore) {
//       dotBefore = true
//       return (
//         <button key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer'>
//           ...
//         </button>
//       )
//     }
//     return null
//   }

//   const renderDotAfter = (index: number) => {
//     if (!dotAfter) {
//       dotAfter = true
//       return (
//         <button key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer'>
//           ...
//         </button>
//       )
//     }
//     return null
//   }
//   return Array(totalPage)
//     .fill(0)
//     .map((_, index) => {
//       const pageNumber = index + 1
//       if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
//         return renderDotAfter(index)
//       } else if (currentPage > RANGE * 2 + 1 && currentPage < totalPage - RANGE * 2) {
//         if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
//           return renderDotBefore(index)
//         } else if (pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
//           return renderDotAfter(index)
//         }
//       } else if (currentPage >= totalPage - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
//         return renderDotBefore(index)
//       }
//       return (
//         <button
//           className={classNames('bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer border', {
//             'border-cyan-500': pageNumber === currentPage,
//             'border-transparent': pageNumber !== currentPage
//           })}
//           onClick={() => {
//             setPage(pageNumber)
//           }}
//         >
//           {pageNumber}
//         </button>
//       )
//     })
// }
