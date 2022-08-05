import { Card, Typography } from "antd";
import React from "react";
import styles from "./index.module.less";

const HomeBlank: React.FC = () => {
  return (
    <Card bordered={false} className={styles.blank_card}>
      <Typography.Title>欢迎来到管理后台</Typography.Title>
    </Card>
  );
};

export default HomeBlank;
