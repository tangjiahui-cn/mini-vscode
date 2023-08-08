import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import routes from "./routes";
import "antd/dist/antd.min.css";

const router = createHashRouter(routes, {
  basename: '/'
});

console.log(window.location.href, window.location)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
