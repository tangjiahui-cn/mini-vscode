import { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import classnames from "classnames";

const nameList = [
  "README.md",
  "tsconfig.json",
  "package.json",
  "vite.config.ts",
  "index.html",
  ".npmrc",
];

export default function Node() {
  const requestIdRef = useRef(0);
  const [current, setCurrent] = useState<string>("");
  const [content, setContent] = useState<string>("");

  function handleUpdate(name: string) {
    const id = ++requestIdRef.current;
    setCurrent(name);
    window.node.getFileContent(name).then((content) => {
      console.log(id, requestIdRef.current);
      if (id !== requestIdRef.current) return;
      setContent(content);
    });
  }

  useEffect(() => {
    handleUpdate(nameList[0]);
  }, []);

  return (
    <>
      <div style={{ marginBottom: 4 }}>读取开发文件夹根目录下文件的内容：</div>
      <div className={styles["page"]}>
        <div className={styles["page-left"]}>
          {nameList.map((name) => {
            return (
              <div
                key={name}
                onClick={() => handleUpdate(name)}
                className={classnames(
                  styles["item"],
                  current === name && styles["item-choose"]
                )}
              >
                {name}
              </div>
            );
          })}
        </div>

        <div className={styles["page-right"]}>{content}</div>
      </div>
    </>
  );
}
