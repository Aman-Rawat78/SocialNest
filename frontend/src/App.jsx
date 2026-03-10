
import Signup from './components/Signup'
import { createBrowserRouter , RouterProvider} from 'react-router-dom'

import Mainlayout from './components/Mainlayout'
import Home from './components/Home'
import Login from './components/login'
import Profile from './components/Profile'

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children:[
      {
        path: "/",
        element: <Home/>
      },
      {
        path:"/profile",
        element:<Profile/>
      }
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/Signup",
    element:<Signup/>
  }

])

function App() {

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
