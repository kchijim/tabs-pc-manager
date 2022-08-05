import { Spin } from "antd";
import React from "react";
import styles from "./index.module.less";

export default function FullScreenLoading() {
  return (
    <div className={styles.bg}>
      <Spin size="large" />
    </div>
  );
}
