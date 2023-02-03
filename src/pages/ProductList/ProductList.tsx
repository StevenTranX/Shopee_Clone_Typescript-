import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination/Pagination'
import useQueryParams from 'src/hooks/useQueryParams'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'

export default function ProductList() {
  const queryParams = useQueryParams()
  const [page, setPage] = useState(5)
  const { data } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return productApi.getProducts(queryParams)
    }
  })
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter />
          </div>
          <div className='col-span-9'>
            <SortProductList />
            <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
              {data &&
                data.data.data.products.map((product) => (
                  <div key={product._id} className='col-span-1'>
                    <Product product={product} />
                  </div>
                ))}
            </div>
            <Pagination page={page} setPage={setPage} totalPage={20} />
          </div>
        </div>
      </div>
    </div>
  )
}
