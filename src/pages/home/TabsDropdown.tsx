import { DownOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Space } from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import React, { useCallback, useMemo } from "react";
import { NavigationTabPaneProps } from "./Navigation";
import { HOME_PANE } from "./util";

interface Props {
  activeKey: string;
  panes: NavigationTabPaneProps[];
  refreshing: boolean;
  onRefresh: () => void;
  removeTabPanes: (action: string) => void;
}

const TabsDropdown: React.FC<Props> = ({
  activeKey,
  panes,
  refreshing,
  onRefresh,
  removeTabPanes,
}) => {
  const onMenuClick = useCallback(
    (e) => {
      if (!refreshing) removeTabPanes(e.key);
    },
    [refreshing, removeTabPanes]
  );

  const menuItems = useMemo<ItemType[]>(
    () => [
      {
        label: "关闭当前tab页",
        key: "current",
        disabled: activeKey === HOME_PANE.tabKey,
      },
      {
        label: "关闭其他tab页(除首页)",
        key: "other",
        disabled:
          panes.length < 2 ||
          (panes.length === 2 && activeKey !== HOME_PANE.tabKey),
      },
      {
        label: "关闭所有tab页(除首页)",
        key: "all",
        disabled: panes.length === 1,
      },
    ],
    [activeKey, panes]
  );

  return (
    <Space>
      <Button
        disabled={refreshing}
        size="large"
        type="link"
        onClick={onRefresh}
      >
        <Space>
          刷新
          <ReloadOutlined />
        </Space>
      </Button>
      <Dropdown overlay={<Menu items={menuItems} onClick={onMenuClick} />}>
        <Button size="large" type="link">
          <Space>
            所有操作
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );
};

export default TabsDropdown;
