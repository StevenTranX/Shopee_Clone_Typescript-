/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='flex flex-col-reverse items-center justify-center gap-16 px-4 py-24 md:gap-28 md:py-20 md:px-44 lg:flex-row lg:px-24 lg:py-24'>
      <div className='relative w-full pb-12 lg:pb-0 xl:w-1/2 xl:pt-24'>
        <div className='relative'>
          <div className='absolute'>
            <div>
              <h1 className='my-2 text-2xl font-bold text-gray-800'>
                Oops! Looks like you've found the doorway to the great nothing
              </h1>
              <p className='my-2 text-gray-800'>
                Sorry about that! Please visit our hompage to get where you need to go.
              </p>
              <button className='my-2 w-10  cursor-pointer rounded-md border bg-orange py-4 px-8 text-center text-white hover:bg-orange  focus:bg-orange focus:outline-none focus:ring-2  focus:ring-opacity-50 sm:w-full lg:w-auto'>
                <Link to='/'>Take me there!</Link>
              </button>
            </div>
          </div>
          <div>
            <img src='https://i.ibb.co/G9DC8S0/404-2.png' alt='not-found' />
          </div>
        </div>
      </div>
      <div>
        <img src='https://i.ibb.co/ck1SGFJ/Group.png' alt='not-found' />
      </div>
    </div>
  )
}
