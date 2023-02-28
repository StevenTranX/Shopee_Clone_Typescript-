import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import keyBy from 'lodash/keyBy'
import { useContext, useEffect } from 'react'
import { AppContext } from './contexts/app.context'
import { localEventTarget } from './utils/auth'

function App() {
  const routeElements = useRouteElements()

  const { reset } = useContext(AppContext)

  useEffect(() => {
    localEventTarget.addEventListener('clearLS', reset)

    return () => {
      localEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    // Thư viện position : floating - ui
    // Thư viện animation : framer motion
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
