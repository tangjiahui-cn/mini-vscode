import styles from "../../index.module.less";
import ItemMenu, {Option} from "../ItemMenu";

interface TreeItemProps {
  data: {
    isFile?: boolean;
    isDirectory?: boolean;
    filePath?: string;
    fileName?: string;
  };
  onChoose?: (value: string, option: Option) => void;
  children?: any;
}
export default function TreeItem (props: TreeItemProps) {
  const {data} = props;
  
  return (
    <ItemMenu
      onChoose={props?.onChoose}
      options={[
        data.isDirectory && {label: '新增文件', value: '1'},
        data.isDirectory && {label: '新增文件夹', value: '2'},
        {label: '删除', value: '3'},
        {label: '重命名', value: '4'}
      ].filter(Boolean)}
    >
      <div
        className={styles["tree-title"]}
        draggable={data.isFile && !data.fileName.startsWith(".")}
        onDragStart={(e) => {
          e.preventDefault();
          window.electron.startDrag(data?.filePath);
        }}
      >
        {props?.children}
      </div>
    </ItemMenu>
  );
}