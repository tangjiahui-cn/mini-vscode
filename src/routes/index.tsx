import App from "../pages/index";
import File from "../pages/file";
import Request from "../pages/request";
import Node from "../pages/node";

export default [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/file',
        element: <File />
      },
      {
        path: '/request',
        element: <Request />
      },
      {
        path: '/node',
        element: <Node />
      }
    ]
  },
];
