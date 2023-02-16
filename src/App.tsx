import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { keyBy } from 'lodash'

function App() {
  const routeElements = useRouteElements()

  // const demoArr = [
  //   { id: 1, name: 'Steven' },
  //   { id: 2, name: 'Steven2' }
  // ]

  // const keyByObj = keyBy(demoArr, 'id')
  // console.log(keyByObj)

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
