import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routeElements = useRouteElements()

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
