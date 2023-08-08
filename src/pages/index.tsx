import { Button, Space } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./index.module.less";

const list = [
  { id: 1, title: "文件读取、保存", path: "/file" },
  { id: 2, title: "接口请求", path: "/request" },
  { id: 3, title: "调用node环境方法", path: "/node" },
];

export default function App() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("/");

  function handleChange(x) {
    const path = x?.path || "/";
    setCurrent(path);
    navigate(path);
  }

  useEffect(() => {
    handleChange(list?.[0]);
  }, []);

  return (
    <div className={styles["page"]}>
      <div className={styles["page-url"]}>{location.href}</div>
      <div className={styles["page-body"]}>
        <h1>Vite + Electron ({window.versions.chrome})</h1>
        <h3>一、已实现</h3>
        <ul>
          <Space direction="vertical">
            {list.map((x) => {
              return (
                <li key={x.id}>
                  <Space>
                    <Button
                      size="small"
                      onClick={() => handleChange(x)}
                      type={x?.path === current ? "primary" : "default"}
                    >
                      演示
                    </Button>
                    <span>{x.title}</span>
                  </Space>
                </li>
              );
            })}
          </Space>
        </ul>
        <h3>二、展示区域</h3>
        <div className={styles["page-display"]}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
