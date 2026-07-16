 
 import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
 import Header from "./components/Header";
 import "./App.css";
 const App = () => {
  return (
    <div className="App">
      <Header></Header>
      <Outlet></Outlet>
    </div>
  )
}
const router = createBrowserRouter([ 
  {
    path:"/",
    element : <App></App>,
    children:[
      {
        
      }
    ]
  }
])
 const Root = ()=>{
  return(<RouterProvider router={router}></RouterProvider>)
} 
export default Root