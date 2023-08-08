import { Button, Radio, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const url = "http://127.0.0.1:22222";
const request = axios.create();

type Method = "GET" | "POST" | "DELETE" | "PUT";
const methods: Method[] = ["GET", "POST", "DELETE", "PUT"];
export default function Request() {
  const [current, setCurrent] = useState<Method>("GET");
  const [content, setContent] = useState<string>("");

  function handleRequest(method: Method) {
    setCurrent(method);
    request({
      method,
      url,
    }).then((res: unknown) => {
      setContent((res as { data: string }).data);
    });
  }

  useEffect(() => handleRequest("GET"), []);

  return (
    <Space direction="vertical">
      <div>
        <Radio.Group
          value={current}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => handleRequest(e.target.value)}
          options={methods.map((method) => {
            return {
              label: method,
              value: method,
            };
          })}
        />
      </div>
      <div>{content}</div>
    </Space>
  );
}
