import { Spin } from "antd";
import React from "react";

interface Props {
  containerStyle?: React.CSSProperties;
  className?: string;
}

const PageLoading: React.FC<Props> = ({ containerStyle, className }) => {
  return (
    <Spin size="large">
      <div
        style={{ width: "100%", height: "700px", ...containerStyle }}
        className={className}
      />
    </Spin>
  );
};

export default PageLoading;
