import styles from "./index.module.less";
import {Button, Input, Space, Tree} from "antd";
import {
  DownOutlined,
  RightOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {appendChildren, getTreeNode} from "./treeUtils";
import { operateActions, useAppDispatch } from "../../store";
import TreeItem from "./components/TreeItem";
import EditItem from "./components/EditItem";

function getFileNameFormPath(filePath: string): string {
  const lastIndex = filePath.includes("/")
    ? filePath.lastIndexOf("/")
    : filePath.lastIndexOf("\\");
  return filePath.slice(lastIndex);
}

function joinFilePath (dirPath: string, fileName: string) : string {
  const isWin = dirPath.includes('\\')
  return `${dirPath}${isWin ? '\\' : '/'}${fileName}`
}

function getDirectoryFromPath (filePath: string): string {
  const lastIndex = filePath.includes("/")
    ? filePath.lastIndexOf("/")
    : filePath.lastIndexOf("\\");
  return filePath.slice(0, lastIndex + 1);
}

export default function WorkSpace() {
  const dispatch = useAppDispatch();
  const [expand, setExpand] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<any[]>([]);
  const treeDataRef = useRef(treeData);
  treeDataRef.current = treeData;

  const [fileInfo, setFileInfo] = useState<
    | {
        filePath: string;
        fileName: string;
      }
    | undefined
  >();

  const isEmpty = useMemo(() => !treeData?.length, [treeData]);

  function handleSelectFile(filePath: string) {
    window.file.getFileContent(filePath).then((content) => {
      dispatch(
        operateActions.setBody({
          fileName: getFileNameFormPath(filePath),
          filePath,
          content,
        })
      );
    });
  }

  function loadDirectory (filePath: string) {
    const fileName = getFileNameFormPath(filePath);
    getTreeData(filePath).then(setTreeData);
    setFileInfo({
      filePath,
      fileName,
    });
  }

  function handleOpenDirectory() {
    window.file.chooseLocalDirectory().then(loadDirectory);
  }

  function handleLoadTreeData(treeNode) {
    return getTreeData(treeNode.filePath).then((children) => {
      appendChildren(treeDataRef.current, treeNode.key, children);
      const _treeData = [...treeDataRef.current];
      setTreeData(_treeData);
      return true;
    });
  }

  function createTitle (treeNode) {
    return (
      <TreeItem
        data={treeNode}
        onChoose={(_, option) => handleOpt(treeNode, option)}
      >
        {treeNode._title}
      </TreeItem>
    )
  }

  function getTreeData(filePath: string) {
    return window.file.getFiles(filePath).then((files) => {
      return files
        .map((x) => {
          const treeNode: any = {
            key: x?.filePath,
            isLeaf: x?.isFile,
            icon: x.isFile ? <FileTextOutlined /> : (({expanded}) => {
              return expanded ? <FolderOpenOutlined /> : <FolderOutlined />
            }),
            filePath: x?.filePath,
            fileName: x?.fileName,
            isDirectory: x?.isDirectory,
            isFile: x?.isFile
          }
          treeNode._data = x;
          treeNode._query = false;
          treeNode._isFile = x?.isFile;
          treeNode._title = x?.fileName;
          treeNode.title = createTitle(treeNode);
          treeNode.changeFileName = function (fileName: string) {
            treeNode.fileName = fileName;
            treeNode._title = fileName;
            return treeNode;
          }
          return treeNode;
        })
        .sort((x) => (x.isLeaf ? 1 : -1));
    });
  }

  function renameFile (srcPath, targetPath) {
    window.file.rename(srcPath, targetPath).then(console.log);
  }

  function handleOpt (node, option) {
    switch (option.value) {
      case '4': // 重命名
        const target = getTreeNode(treeDataRef.current, node.key)
        target.title = (
          <EditItem
            defaultName={node.fileName}
            onOk={fileName => {
              const dirName = getDirectoryFromPath(target.filePath);
              const lastFilePath = joinFilePath(dirName, target.fileName);
              const targetFilepath = joinFilePath(dirName, fileName);
              target.title = createTitle(target.changeFileName(fileName));
              setTreeData([...treeDataRef.current])
              renameFile(lastFilePath, targetFilepath)
            }}
          />
        )
        setTreeData([...treeDataRef.current])
        break;
    }
  }

  useEffect(() => {
    loadDirectory("/Users/tangjiahui/Desktop/test-electron")
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <Space
          className={styles.focus}
          style={{ cursor: "pointer", width: "100%", padding: "2px 8px" }}
          onClick={() => setExpand(!expand)}
          tabIndex={0}
        >
          {expand ? <DownOutlined /> : <RightOutlined />}
          {isEmpty ? "无打开的文件夹" : fileInfo?.fileName}
        </Space>
        <Space style={{ fontSize: 15 }}>
          <FolderOpenOutlined
            title={'打开文件夹'}
            onClick={handleOpenDirectory}
          />
        </Space>
      </div>

      <div style={{ display: expand ? "block" : "none" }} className={styles.body}>
        {isEmpty && (
          <div style={{ padding: "16px 32px" }}>
            <Button type="primary" block onClick={handleOpenDirectory}>
              打开文件夹
            </Button>
          </div>
        )}
        <Tree
          showIcon
          style={{ paddingLeft: 16 }}
          treeData={treeData}
          loadData={handleLoadTreeData}
          onSelect={([filePath = ""]: string[] = [], {node}) => {
            if (filePath && node?._isFile) {
              handleSelectFile(filePath);
            }
          }}
        />
      </div>
    </div>
  );
}
