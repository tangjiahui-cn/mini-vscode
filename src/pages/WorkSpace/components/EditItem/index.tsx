import {Input} from "antd";
import React, {useEffect, useRef, useState} from "react";

interface EditItemProp {
  defaultName?: string;
  onOk?: (fileName: string) => void;
}

export default function EditItem (props: EditItemProp) {
  const [value, setValue] = useState(props?.defaultName);
  const ref = useRef<any>();

  function handleOk () {
    props?.onOk?.(value || props?.defaultName)
  }

  useEffect(() => {
    ref?.current?.focus();
  }, [])

  return (
    <Input
      ref={ref}
      size={'small'}
      defaultValue={props?.defaultName ?? ''}
      style={{
        background: 'transparent',
        border: '1px solid rgb(0, 116, 202)',
        color: 'rgba(197, 197, 197)',
        fontSize: 12
      }}
      onChange={e => setValue(e.target.value)}
      onPressEnter={handleOk}
      onBlur={handleOk}
    />
  )
}