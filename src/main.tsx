import React from "react";
import ReactDOM from "react-dom";
import "./index.less";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";
import "moment/dist/locale/zh-cn";

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
