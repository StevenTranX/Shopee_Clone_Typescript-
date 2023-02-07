import path from 'src/constants/path'
import React from 'react'
import { createSearchParams, Link } from 'react-router-dom'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { QueryConfig } from '../ProductList'
import { Category } from 'src/types/category.type'
import classNames from 'classnames'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { category } = queryConfig

  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id
          return (
            <li className='py-2 pl-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-2', {
                  'font-semibold text-orange': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className={classNames('absolute top-1 left-[-10px] h-2 w-2 fill-orange')}>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='my-5'>
        <div>Khoản giá</div>
        <form action='' className='mt-2'>
          <div className='flex items-start'>
            <Input
              type='text'
              className='grow'
              name='from'
              placeholder='đ TỪ'
              classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
            />
            <div className=' mx-2 mt-2 shrink-0 '>-</div>
            <Input
              type='text'
              className='grow'
              name='to'
              placeholder='đ ĐẾN'
              classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
            />
          </div>
          <Button className='flex w-full items-center justify-center bg-orange py-2 px-2 text-sm uppercase text-white hover:bg-orange/80'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='text-sm'>Đánh giá</div>
      <ul className='my-3'>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <li className='py-1 pl-2' key={index}>
              <div className='flex cursor-pointer items-center text-sm' tabIndex={0} role='button' aria-hidden='true'>
                {Array(5)
                  .fill(0)
                  .map((_, indexStar) => {
                    if (indexStar < 5 - index) {
                      return (
                        <svg viewBox='0 0 9.5 8' className='mr-1 h-4 w-4' key={indexStar}>
                          <defs>
                            <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                              <stop offset={0} stopColor='#ffca11' />
                              <stop offset={1} stopColor='#ffad27' />
                            </linearGradient>
                            <polygon
                              id='ratingStar'
                              points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                            />
                          </defs>
                          <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth={1}>
                            <g transform='translate(-876 -1270)'>
                              <g transform='translate(155 992)'>
                                <g transform='translate(600 29)'>
                                  <g transform='translate(10 239)'>
                                    <g transform='translate(101 10)'>
                                      <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      )
                    }
                    return (
                      <svg viewBox='0 0 30 30' className='mr-1 h-4 w-4' key={indexStar}>
                        <defs>
                          <linearGradient id='star__hollow' x1='50%' x2='50%' y1='0%' y2='99.0177926%'>
                            <stop offset='0%' stopColor='#FFD211' />
                            <stop offset='100%' stopColor='#FFAD27' />
                          </linearGradient>
                        </defs>
                        <path
                          fill='none'
                          fillRule='evenodd'
                          stroke='url(#star__hollow)'
                          strokeWidth={2}
                          d='M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z'
                        />
                      </svg>
                    )
                  })}
                {index !== 0 && <span>Trở lên</span>}
              </div>
            </li>
          ))}
      </ul>
      <div className='bg-gray-30 my-4 h-[1px]'></div>
      <Button className='flex w-full items-center justify-center bg-orange py-2 px-2 text-sm uppercase text-white hover:bg-orange/80'>
        Xóa tất cả
      </Button>
    </div>
  )
}
