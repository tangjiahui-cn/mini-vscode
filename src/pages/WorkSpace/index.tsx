import styles from "./index.module.less";
import { Button, Input, Modal, Space, Tree } from "antd";
import {
  DownOutlined,
  RightOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  FolderOutlined,
  FileAddOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  appendChildren,
  deleteTreeNode,
  getTreeNode,
  insertNode,
} from "./treeUtils";
import { operateActions, useAppDispatch } from "../../store";
import TreeItem from "./components/TreeItem";
import EditItem from "./components/EditItem";
import TipDialog from "../../common/TipDialog";

// 按目录到文件排列（按英文文件名）
export function sortChildren(children: any[]) {
  return children.sort((x, y) => {
    if (x.isLeaf && y.isDirectory) return 1;
    if (x.isDirectory && y.isLeaf) return -1;
    return x._title.localeCompare(y._title);
  });
}

function getFileNameFormPath(filePath: string): string {
  const lastIndex = filePath.includes("/")
    ? filePath.lastIndexOf("/")
    : filePath.lastIndexOf("\\");
  return filePath.slice(lastIndex + 1);
}

function joinFilePath(dirPath: string, fileName: string): string {
  const isWin = dirPath.includes("\\");
  return `${dirPath}${isWin ? "\\" : "/"}${fileName}`;
}

function getDirectoryFromPath(filePath: string): string {
  const lastIndex = filePath.includes("/")
    ? filePath.lastIndexOf("/")
    : filePath.lastIndexOf("\\");
  return filePath.slice(0, lastIndex);
}

export default function WorkSpace() {
  const dispatch = useAppDispatch();
  const idRef = useRef(0);
  const [expand, setExpand] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [rootFile, setRootFile] = useState<any>(undefined);
  const [currentFile, setCurrentFile] = useState<any>(undefined);
  const treeDataRef = useRef(treeData);
  treeDataRef.current = treeData;

  const [fileInfo, setFileInfo] = useState<
    | {
        filePath: string;
        fileName: string;
      }
    | undefined
  >();

  const [isEmpty, setIsEmpty] = useState<boolean>(true);

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

  function loadDirectory(filePath: string) {
    window.file.getBaseInfo(filePath).then((fileInfo) => {
      setIsEmpty(false);
      const treeNode = createNode(fileInfo, true);
      setCurrentFile(treeNode);
      setRootFile(treeNode);
      getTreeData(filePath).then(setTreeData);
      setFileInfo(fileInfo);
    });
  }

  function handleOpenDirectory() {
    window.file.chooseLocalDirectory().then((filePath) => {
      filePath && loadDirectory(filePath);
    });
  }

  function handleCreateFile() {
    const node = currentFile;
    if (node?._root || (node.isFile && node?._dirPath === rootFile.filePath)) {
      // 根目录下添加
      window.file.createFile(rootFile.filePath).then((file) => {
        const targetTreeData = [...treeData];
        targetTreeData.push(createNode(file));
        setTreeData(sortChildren(targetTreeData));
      });
    } else {
      handleOpt(node, { label: "新增文件", value: "1" });
    }
  }

  function handleCreateDirectory() {
    const node = currentFile;
    if (node?._root || (node.isFile && node?._dirPath === rootFile.filePath)) {
      window.file
        .createDirectory(node.isDirectory ? node.filePath : node._dirPath)
        .then((file) => {
          const targetTreeData = [...treeData];
          targetTreeData.push(createNode(file));
          setTreeData(sortChildren(targetTreeData));
        });
    } else {
      handleOpt(node, { label: "新增文件夹", value: "2" });
    }
  }

  function handleLoadTreeData(treeNode) {
    return getTreeData(treeNode.filePath).then((children) => {
      appendChildren(treeDataRef.current, treeNode.key, children);
      const _treeData = [...treeDataRef.current];
      setTreeData(_treeData);
      return true;
    });
  }

  function createTitle(treeNode) {
    return (
      <TreeItem
        data={treeNode}
        onChoose={(_, option) => handleOpt(treeNode, option)}
      >
        {treeNode._title}
      </TreeItem>
    );
  }

  function createNode(x: any, root?: boolean) {
    const treeNode: any = {
      key: `${idRef.current ++}`,
      isLeaf: x?.isFile,
      icon: x.isFile ? (
        <FileTextOutlined />
      ) : (
        ({ expanded }) => {
          return expanded ? <FolderOpenOutlined /> : <FolderOutlined />;
        }
      ),
      filePath: x?.filePath,
      fileName: x?.fileName,
      isDirectory: x?.isDirectory,
      isFile: x?.isFile,
    };
    treeNode._root = root; // 根目录
    treeNode._data = x;
    treeNode._dirPath = getDirectoryFromPath(x?.filePath);
    treeNode._query = false;
    treeNode._isFile = x?.isFile;
    treeNode._title = x?.fileName;
    treeNode.title = createTitle(treeNode);
    treeNode.changeFileName = function (fileName: string) {
      const newFilePath = joinFilePath(treeNode._dirPath, fileName);
      treeNode.fileName = fileName;
      treeNode.key = newFilePath;
      treeNode.filePath = newFilePath;
      treeNode._title = fileName;
      return treeNode;
    };
    return treeNode;
  }

  function getTreeData(filePath: string) {
    return window.file.getFiles(filePath).then((files) => {
      return sortChildren(files.map((x) => createNode(x)));
    });
  }

  function renameFile(srcPath, targetPath) {
    window.file.rename(srcPath, targetPath);
  }

  function handleOpt(node, option) {
    switch (option.value) {
      case "1": // 新增文件
        window.file
          .createFile(node.isDirectory ? node.filePath : node._dirPath)
          .then((file) => {
            const newNode = createNode(file);
            insertNode(treeDataRef.current, node.key, newNode);
            setTreeData([...treeDataRef.current]);
          });
        break;
      case "2": // 新增文件夹
        window.file
          .createDirectory(node.isDirectory ? node.filePath : node._dirPath)
          .then((file) => {
            const newNode = createNode(file);
            insertNode(treeDataRef.current, node.key, newNode);
            setTreeData([...treeDataRef.current]);
          });
        break;
      case "3": // 删除
        TipDialog.open({
          content: `确认永久删除"${node.fileName}"${
            node.isDirectory ? "文件夹" : "文件"
          }?`,
          onOk(close) {
            setTreeData(deleteTreeNode(treeDataRef.current, node.key));
            window.file.deleteFilePath(node.filePath);
            close();
          },
        });
        break;
      case "4": // 重命名
        const target = getTreeNode(treeDataRef.current, node.key);
        if (!target) return;
        target.title = (
          <EditItem
            defaultName={node.fileName}
            onOk={(fileName) => {
              const dirName = getDirectoryFromPath(target.filePath);
              const lastFilePath = joinFilePath(dirName, target.fileName);
              const targetFilepath = joinFilePath(dirName, fileName);
              target.title = createTitle(target.changeFileName(fileName));
              setTreeData([...treeDataRef.current]);
              renameFile(lastFilePath, targetFilepath);
            }}
          />
        );
        setTreeData([...treeDataRef.current]);
        break;
    }
  }

  // useEffect(() => {
  //   loadDirectory("/Users/tangjiahui/Desktop/test-electron")
  // }, []);

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
        {!isEmpty && <Space style={{ fontSize: 15 }}>
          <FileAddOutlined
            title={"新增文件"}
            style={{ fontSize: 13 }}
            onClick={handleCreateFile}
          />
          <FolderAddOutlined
            title={"新增文件夹"}
            onClick={handleCreateDirectory}
          />
          <FolderOpenOutlined
            title={"打开文件夹"}
            onClick={handleOpenDirectory}
          />
        </Space>}
      </div>

      <div
        style={{ display: expand ? "block" : "none" }}
        className={styles.body}
      >
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
          onSelect={([filePath = ""]: string[] = [], { node }) => {
            if (filePath) {
              setCurrentFile(node);

              if (filePath && node?._isFile) {
                handleSelectFile(filePath);
              }
            }
          }}
        />
      </div>
    </div>
  );
}
