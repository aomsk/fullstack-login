import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Posts from "./pages/Posts.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
// import App from "./App.tsx";

type Props = {
  children: React.ReactNode;
};

function ProtectedRoute(props: any) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return props.children;
}

function ProtectedRouteOut({ children }: Props) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/posts" replace />;
  }
  return children;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} errorElement={<ErrorPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRouteOut>
              <Login />
            </ProtectedRouteOut>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRouteOut>
              <Register />
            </ProtectedRouteOut>
          }
        />
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
