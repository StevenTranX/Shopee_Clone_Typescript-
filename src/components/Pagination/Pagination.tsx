import React from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'
import { QueryConfig } from 'src/pages/ProductList/ProductList'
import path from 'src/constants/path'

interface Props {
  queryConfig: QueryConfig
  totalPage: number
}
const RANGE = 2

export default function Pagination({ queryConfig, totalPage }: Props) {
  const currentPage = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='mx-2 cursor-pointer rounded bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='mx-2 cursor-pointer rounded bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
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
          //* logic từ 1 -> 5
        }

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

        if (currentPage >= totalPage - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
          return renderDotBefore(index)
          //* logic từ 16 -> 20
        }
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
              'border-cyan-500': pageNumber === currentPage,
              'border-transparent': pageNumber !== currentPage
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      {currentPage === 1 ? (
        <span className='mx-2 cursor-not-allowed rounded bg-white px-3 py-2 text-gray-400 shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (currentPage - 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
        >
          Prev
        </Link>
      )}
      {renderPagination()}
      {currentPage === totalPage ? (
        <span className='mx-2 cursor-not-allowed rounded bg-white px-3 py-2 text-gray-400 shadow-sm'>Next</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (currentPage + 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
        >
          Next
        </Link>
      )}
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
