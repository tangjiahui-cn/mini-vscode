import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import routes from "./routes";
import "antd/dist/antd.min.css";
import AppProvider from './store';

const router = createHashRouter(routes, {
  basename: '/'
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
);
