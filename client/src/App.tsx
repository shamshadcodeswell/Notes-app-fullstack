 
 import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
 import Header from "./components/Header";
 import "./App.css";
import NoteList from "./components/NoteList";
import CreateNote from "./components/CreateNote";
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
       path:"/",
       element:<NoteList></NoteList> 
      },
      {
        path:"/create",
        element:<CreateNote></CreateNote>
      }
    ]
  }
])
 const Root = ()=>{
  return(<RouterProvider router={router}></RouterProvider>)
} 
export default Root