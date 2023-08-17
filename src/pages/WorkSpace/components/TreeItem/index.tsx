import React, {useRef} from "react";
import styles from "../../index.module.less";
import ItemMenu from "../ItemMenu";

interface TreeItemProps {
  data: {
    isFile?: boolean;
    isDirectory?: boolean;
    filePath?: string;
    fileName?: string;
  };
}
export default function TreeItem (props: TreeItemProps) {
  const {data} = props;
  const ref = useRef();
  return (
    <ItemMenu
      options={[
        data.isDirectory && {label: '新增文件', value: '1'},
        data.isDirectory && {label: '新增文件夹', value: '2'},
        {label: '删除', value: '3'},
      ].filter(Boolean)}
    >
      <div
        ref={ref}
        className={styles["tree-title"]}
        draggable={data.isFile && !data.fileName.startsWith(".")}
        onDragStart={(e) => {
          e.preventDefault();
          window.electron.startDrag(data?.filePath);
        }}
      >
        {data.fileName}
      </div>
    </ItemMenu>
  );
}