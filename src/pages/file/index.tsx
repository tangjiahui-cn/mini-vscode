import { Button, Space } from "antd";
import { useState } from "react";

export default function File() {
  const [fileList, setFileList] = useState<any[]>([]);
  function handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".mp4,.jpg,.jpeg,.png";
    input.click();
    input.onchange = function () {
      const file = this.files?.[0];
      file &&
        setFileList((fileList = []) => {
          return [file, ...fileList];
        });
    };
  }

  return (
    <Space direction="vertical" size={16}>
      <b>1、上传文件</b>
      <Space direction="vertical" style={{ width: "100%" }} size={2}>
        <Button onClick={handleUpload}>上传文件</Button>
        {fileList?.map((x) => {
          return <a key={x.name}>{x.name}</a>;
        }) || []}
      </Space>
      <b>2、按住拖拽到桌面</b>
      <div>
        客户端文件:
        <a
          draggable
          onDrag={console.log}
          onDragStart={(e) => {
            e.preventDefault();
            window.electron.startDrag("README.md");
          }}
        >
          README.md
        </a>
      </div>
    </Space>
  );
}
