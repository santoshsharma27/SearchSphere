import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/pages/Home";
import Article from "./components/pages/Article";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CreatePost from "./admin/CreatePost";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/article/:slug", element: <Article /> },
  { path: "/admin-login", element: <AdminLogin /> },
  {
    path: "/admin",
    element: <Dashboard />,
  },
  {
    path: "/admin/create",
    element: <CreatePost />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
