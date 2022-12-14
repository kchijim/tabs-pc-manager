import { Layout, Menu, Spin, Tabs } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NavigationTabPane, { NavigationTabPaneProps } from "./Navigation";
import {
  flatNavigationRoutes,
  getNavigationParentRoutes,
  getNavigationRouteInfo,
  HOME_PANE,
  navigationRoutesToMenuItems,
  updateFlatNavigationRoutes,
} from "./util";
import styles from "./index.module.less";
import { useHistory, useRouteMatch } from "react-router";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import TabsDropdown from "./TabsDropdown";
import HomeRightHeader from "./RightHeader";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import navigationRoutes from "@/Routes";

export default function Home() {
  const [panes, setPanes] = useState<NavigationTabPaneProps[]>([HOME_PANE]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const selectedKeys = useMemo(() => [routeMatch.path], [routeMatch.path]);

  const [collapsed, setCollapsed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const refreshTimeout = useRef<null | number>(null);

  const navigationHandler = useCallback(
    (routeInfo: NavigationRouteProps & { url: string }) => {
      // console.log(routeInfo);

      setPanes((p) => {
        if (!p.find((item) => item.tabKey === routeInfo.url)) {
          const pane: NavigationTabPaneProps = {
            tab: routeInfo.name,
            tabKey: routeInfo.url,
            path: routeInfo.path,
          };

          return p.concat(pane);
        }

        return p;
      });
    },
    []
  );

  /**
   * 点击menu时 生成新的tab页面或跳转到已存在的tab页面
   */
  const onNavigate = useCallback(
    (info) => {
      const routeInfo = getNavigationRouteInfo(info.key, flatNavigationRoutes);

      if (routeInfo) {
        navigationHandler({ ...routeInfo, url: routeInfo.path });

        history.push(routeInfo.path);
      }
    },
    [navigationHandler]
  );

  /**
   * 关闭tab页面
   */
  const onTabEdit = useCallback(
    (targetKey: any, action: "add" | "remove") => {
      if (action === "remove") {
        const newPanes = panes.filter((item) => item.tabKey !== targetKey);
        let newActiveKey = routeMatch.url;

        if (targetKey === routeMatch.url) {
          const removeIndex = panes.findIndex(
            (item) => item.tabKey === targetKey
          );

          const newIndex = removeIndex === 0 ? 0 : removeIndex - 1;
          newActiveKey = newPanes[newIndex].tabKey;
        }

        setPanes(newPanes);
        history.replace(newActiveKey);
      }
    },
    [routeMatch.url, panes]
  );

  /**
   * 点击tab栏切换tab页面
   */
  const onTabChange = useCallback((key) => {
    history.push(key);
  }, []);

  /**
   * 批量关闭tab页
   */
  const removeTabPanes = useCallback(
    (action: string) => {
      switch (action) {
        case "current":
          onTabEdit(routeMatch.url, "remove");
          break;
        case "other":
          setPanes((p) =>
            p.filter(
              (item) =>
                item.tabKey === routeMatch.url ||
                item.tabKey === HOME_PANE.tabKey
            )
          );
          break;
        case "all":
          setPanes((p) => p.slice(0, 1));
          history.replace(HOME_PANE.tabKey);
          break;
        default:
          break;
      }
    },
    [routeMatch.url, onTabEdit]
  );

  /**
   * 刷新当前页面
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    refreshTimeout.current = window.setTimeout(() => {
      setRefreshing(false);
      refreshTimeout.current = null;
    }, 500);
  }, []);

  /**
   * 请求菜单
   */
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [menuData, setMenuData] = useState<ItemType[]>([]);
  const loadMenuData = useCallback(async () => {
    try {
      /** 更新扁平化路由数组 */
      updateFlatNavigationRoutes(navigationRoutes);
      /** 用当前账号的路由转换出菜单 */
      setMenuData(navigationRoutesToMenuItems(navigationRoutes)!);
    } catch {
      history.replace("/home");
    }
  }, []);

  useEffect(() => {
    loadMenuData().finally(() => setMenuLoaded(true));
  }, []);

  /**
   * 针对跳转tab页面后，tab页面所在的submenu没打开
   */
  useEffect(() => {
    setOpenKeys(getNavigationParentRoutes(routeMatch.path, navigationRoutes));
  }, [routeMatch.url]);

  /**
   * 针对页面组件里使用history做路由跳转
   */
  useEffect(() => {
    if (!!menuData.length) {
      const routeInfo = getNavigationRouteInfo(
        routeMatch.path,
        flatNavigationRoutes
      );

      if (routeInfo) {
        navigationHandler({ ...routeInfo, url: routeMatch.url });
      } else {
        /** 如果没有找到当前路径对应的路由，会重定向到首页 */
        history.replace("/home");
      }
    }
  }, [menuData, routeMatch.url]);

  /**
   * 注销页面时，清除 刷新tab页 计时器
   */
  useEffect(() => {
    return () => {
      if (refreshTimeout.current) {
        window.clearTimeout(refreshTimeout.current);
      }
    };
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
        {!!menuData.length && (
          <Menu
            theme="dark"
            mode="inline"
            items={menuData}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onClick={onNavigate}
            onOpenChange={setOpenKeys}
          />
        )}
      </Layout.Sider>
      <Layout>
        <Layout.Header className={styles.layout_header}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: styles.sider_trigger,
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <HomeRightHeader />
        </Layout.Header>
        <Spin spinning={!menuLoaded} size="large">
          <Layout.Content className={styles.layout_content}>
            {!!panes.length && (
              <Tabs
                className={styles.navigation_tabs}
                hideAdd
                type="editable-card"
                activeKey={routeMatch.url}
                onChange={onTabChange}
                onEdit={onTabEdit}
                tabBarExtraContent={{
                  right: (
                    <TabsDropdown
                      activeKey={routeMatch.url}
                      panes={panes}
                      refreshing={refreshing}
                      removeTabPanes={removeTabPanes}
                      onRefresh={onRefresh}
                    />
                  ),
                }}
              >
                {panes.map((pane) => (
                  <Tabs.TabPane
                    {...pane}
                    key={pane.tabKey}
                    closable={pane.tabKey !== HOME_PANE.tabKey}
                  >
                    <NavigationTabPane
                      {...pane}
                      refreshing={refreshing && pane.tabKey === routeMatch.url}
                      navigateTo={onNavigate}
                    />
                  </Tabs.TabPane>
                ))}
              </Tabs>
            )}
          </Layout.Content>
        </Spin>
        <Layout.Footer></Layout.Footer>
      </Layout>
    </Layout>
  );
}
