import { getAppUserInfo, removeAppUserInfo } from "@/utils";
import { Dropdown, Menu, Row, Space, Typography } from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import React, { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router";

const menuItems: ItemType[] = [
  {
    label: "退出登录",
    key: "logout",
  },
];

const HomeRightHeader: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const userInfo = useMemo(() => getAppUserInfo(), []);

  const onMenuClick = useCallback(
    ({ key }) => {
      switch (key) {
        case "logout":
          removeAppUserInfo();
          history.replace(`/login?from=${location.pathname}`);
          break;
        default:
          break;
      }
    },
    [location]
  );

  return (
    <Row justify="end" align="middle">
      <Space size="large">
        {!!userInfo && (
          <Dropdown overlay={<Menu items={menuItems} onClick={onMenuClick} />}>
            <Typography.Text style={{ cursor: "pointer" }}>
              {userInfo.phone}
            </Typography.Text>
          </Dropdown>
        )}
      </Space>
    </Row>
  );
};

export default HomeRightHeader;
