import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./Components/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";
import App from "./App"; // Home - list of events
import States from "./pages/States"; // Event detail → list of states
import Photos from "./pages/Photos"; // State detail → list of photos
import Admin from "./pages/Admin"; // Admin panel
import Login from "./pages/Login"; // Login page

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/events/:eventId", element: <States /> },
      { path: "/events/:eventId/states/:stateId", element: <Photos /> },
      { 
        path: "/admin", 
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ) 
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
