import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Posts from "./pages/Posts.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

// type Props = {
//   children: React.ReactNode;
// };

const token = localStorage.getItem("token");

// const ProtectedRoute = (props: any) => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//   return props.children;
// };

// const ProtectedRouteOut = ({ children }: Props) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     return <Navigate to="/posts" replace />;
//   }
//   return children;
// };

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} errorElement={<ErrorPage />} />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to={"/posts"} replace />}
          // element={
          //   <ProtectedRouteOut>
          //     <Login />
          //   </ProtectedRouteOut>
          // }
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to={"/posts"} replace />}
          // element={
          //   <ProtectedRouteOut>
          //     <Register />
          //   </ProtectedRouteOut>
          // }
        />
        <Route
          path="/posts"
          element={token ? <Posts /> : <Navigate to={"/login"} replace />}
          // element={
          //   <ProtectedRoute>
          //     <Posts />
          //   </ProtectedRoute>
          // }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
