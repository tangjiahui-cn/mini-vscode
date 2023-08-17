import React from "react";
import {createRoot} from "react-dom/client";
import Component, {IProps} from "./Component";

type Config = Omit<IProps, 'destroy'>

const TipDialog = {
  open (config: Config) {
    const div = document.createElement('div')

    createRoot(div).render(<Component
      title={config.title}
      content={config.content}
      onOk={config?.onOk}
      destroy={() => document.body.removeChild(div)}
    />)

    document.body.appendChild(div)
  }
}

export default TipDialog;