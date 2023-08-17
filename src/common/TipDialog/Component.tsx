import {Modal} from "antd";
import React, {useState} from "react";

export interface IProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  destroy?: () => void;
  onOk?: (closeFn) => void;
}
export default function Component (props: IProps) {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <Modal
      centered
      title={props?.title || '提醒'}
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      onOk={() => {
        props?.onOk?.(() => setVisible(false));
      }}
      afterClose={props?.destroy}
    >
      {props?.content}
    </Modal>
  )
}

