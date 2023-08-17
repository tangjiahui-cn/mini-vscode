import styles from "./index.module.less";
import WorkSpace from "./WorkSpace";
import Body from "./Body";
import { Space } from "antd";
import {
  MinusOutlined,
  BorderOutlined,
  CloseOutlined,
  CompressOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function App() {
  const [isMaxWindow, setIsMaxWindow] = useState(false);

  function HeadBar() {
    return (
      <div className={styles["page-head"]}>
        <div className={styles["logo"]}>mini-vscode</div>
        <Space size={0} className={styles["no-drag"]}>
          <div
            className={styles["page-head-item"]}
            onClick={() => window.client.minWindow()}
          >
            <MinusOutlined />
          </div>
          <div
            className={styles["page-head-item"]}
            onClick={() =>
              setIsMaxWindow((isMaxWindow) => {
                isMaxWindow
                  ? window.client.resetWindow()
                  : window.client.maxWindow();
                return !isMaxWindow;
              })
            }
          >
            {isMaxWindow ? <CompressOutlined /> : <BorderOutlined />}
          </div>
          <div
            className={styles["page-head-item"]}
            onClick={() => window.client.closeWindow()}
          >
            <CloseOutlined />
          </div>
        </Space>
      </div>
    );
  }

  return (
    <div className={styles["page"]}>
      <HeadBar />
      <div className={styles["page-body"]}>
        <div className={styles["page-body-left"]}>
          <WorkSpace />
        </div>
        <div className={styles["page-body-right"]}>
          <Body />
        </div>
      </div>
    </div>
  );
}
