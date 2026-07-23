import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./components/Header";
import "./App.css";
import NoteList from "./components/NoteList";
import CreateNote from "./components/CreateNote";
import NotePage from "./components/NotePage";
import EditNote from "./components/EditNote";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

const App = () => {
  return (
    <div className="App">
      <Header></Header>
      <Outlet></Outlet>
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        index: true,
        element: <NoteList></NoteList>,
      },
      {
        path: "/create",
        element: <CreateNote></CreateNote>,
      },
      {
        path: "/note/:id",
        element: <NotePage></NotePage>,
      },
      {
        path: "note/edit/:id",
        element: <EditNote></EditNote>,
      },
    ],
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);
const Root = () => {
  return <RouterProvider router={router}></RouterProvider>;
};
export default Root;
