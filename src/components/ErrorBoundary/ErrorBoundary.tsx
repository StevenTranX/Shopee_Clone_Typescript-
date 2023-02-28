/* eslint-disable react/no-unescaped-entities */
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
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
                    <a href='/'>Take me there!</a>
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

    return this.props.children
  }
}
