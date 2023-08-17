import { useAppSelector } from "../../store";
import styles from "./index.module.less";
import {useEffect, useRef, useState} from "react";
import {Input, message, Space} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import {useDownKeys} from "../../hooks/useDownKeys";
import {useStateWithRef} from "../../hooks/useStateWithRef";
import Empty from "./components/Empty";

export default function Body() {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent, contentRef] = useStateWithRef<string>("");
  const state = useAppSelector((x) => x.operate);
  const stateRef = useRef(state);
  stateRef.current = state;

  function handleSave () {
    const currentFile = stateRef.current.body.currentFile
    if (!currentFile.fileName) return;
    setIsEditing(false)
    window.file.saveFileToLocal({
      filePath: currentFile.filePath,
      content: contentRef.current
    }).then(isSuccess => {
      if (isSuccess) {
        setIsEditing(false);
      } else {
        message.warn('保存失败')
      }
    })
  }

  useDownKeys([
    {
      keys: ['meta', 's'],
      callback: handleSave
    },
    {
      keys: ['control', 's'],
      callback: handleSave
    }
  ]);

  useEffect(() => {
    setIsEditing(false);
    setContent(state.body.currentFile.content || "");
  }, [state.body.currentFile.content]);

  return state.body.currentFile.fileName ? (
    <div className={styles["page"]}>
      <div className={styles['head']}>
        <Space>
          {state.body.currentFile.fileName}
          {isEditing && <div className={styles['dot']}/>}
        </Space>
      </div>
      <Input.TextArea
        className={styles['body']}
        value={content}
        style={{
          height: "100%",
          background: "transparent",
          color: "rgba(197, 197, 197)",
        }}
        onChange={(e) => {
          !isEditing && setIsEditing(true)
          setContent(e.target.value)
        }}
      />
    </div>
  ) : <Empty />;
}
