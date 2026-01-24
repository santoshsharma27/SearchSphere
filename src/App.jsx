import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/pages/Home";
import Article from "./components/pages/Article";
import AdminLogin from "./components/admin/AdminLogin";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import CreatePost from "./components/pages/CreatePost";
import { Toaster } from "react-hot-toast";
import AdminPendingPosts from "./components/admin/AdminPendingPosts";
import AdminDashboard from "./components/admin/AdminDashboard";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/article/:slug", element: <Article /> },
  { path: "/admin-login", element: <AdminLogin /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-post",
    element: <CreatePost />,
  },
  {
    path: "/admin/pending-posts",
    element: (
      <ProtectedRoute>
        <AdminPendingPosts />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
