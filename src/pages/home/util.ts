import { ItemType } from "antd/lib/menu/hooks/useItems";
import navigationRoutes from "../../Routes";
import { NavigationTabPaneProps } from "./Navigation";

/**
 * 过滤出当前账号的路由
 */
export function filterAccountRoutes(
  routes: NavigationRouteProps[] = [],
  flatRoutes: NavigationRouteProps[]
) {
  const temp: NavigationRouteProps[] = [];

  routes.forEach((item) => {
    const flatItem = flatRoutes.find((r) => r.path === item.path);
    if (flatItem) {
      if (item.children) {
        const tempItem = {
          ...flatItem,
          children: filterAccountRoutes(item.children, flatRoutes),
        };
        if (tempItem.children.length) temp.push(tempItem);
      } else {
        /** 页面路由 */
        temp.push({ ...flatItem });
      }
    }
  });

  return temp;
}

/**
 * 路由转化成菜单列表
 */
export function navigationRoutesToMenuItems(
  routes?: NavigationRouteProps[]
): ItemType[] | undefined {
  return (
    routes
      /** 过滤掉需要隐藏不显示在菜单列表中的路由 */
      ?.filter((item) => !item.hideInMenu)
      .map((item) => {
        const { name, path, children, component, ...rest } = item;

        return {
          label: name,
          key: path,
          children: navigationRoutesToMenuItems(children),
          ...rest,
        };
      })
  );
}

/**
 * 获取扁平化路由 如果第二个参数传入true，则返回的路由数组仅包含提供了component的路由
 */
export function getFlatNavigationRoutes(
  trees: NavigationRouteProps[],
  hasComponent: boolean = false
) {
  const routes: NavigationRouteProps[] = [];

  trees.forEach((item) => {
    const { children, ...rest } = item;

    if (!hasComponent || !!rest.component) routes.push(rest);

    if (children) {
      routes.push(...getFlatNavigationRoutes(children));
    }
  });

  return routes;
}

/**
 * 扁平化路由数组（全部）
 */
export const globalFlatNavigationRoutes =
  getFlatNavigationRoutes(navigationRoutes);

/**
 * 路由白名单
 */
const whiteRoutesPath = ["/home"];

/**
 * 扁平化路由数组
 */
export let flatNavigationRoutes: NavigationRouteProps[] = whiteRoutesPath.map(
  (path) => navigationRoutes.find((r) => r.path === path)!
);

/**
 * 修改扁平化路由数组
 */
export function updateFlatNavigationRoutes(
  trees: NavigationRouteProps[],
  hasComponent: boolean = false
) {
  flatNavigationRoutes = getFlatNavigationRoutes(trees, hasComponent);
}

/**
 * 获取路由信息
 */
export function getNavigationRouteInfo(
  key: string,
  routes: NavigationRouteProps[]
) {
  return routes.find((item) => item.path === key);
}

/**
 * 如果存在子路由就返回子路由，否则就判断是否与目标路由路径相匹配
 */
function checkNavigationPath(path: string, route: NavigationRouteProps) {
  return route.children ?? route.path === path;
}

let found = false;

/**
 * 获取当前页面的父路由路径（包括它自己）
 */
export function getNavigationParentRoutes(
  targetPath: string,
  routes: NavigationRouteProps[],
  parentKeys: string[] = []
) {
  /**
   * 一开始重置
   */
  if (found) found = false;

  for (let i = 0; i < routes.length; i++) {
    /**
     * 找到后退出
     */
    if (found) break;

    const item = routes[i];

    parentKeys.push(item.path);

    const result = checkNavigationPath(targetPath, item);

    if (Array.isArray(result)) {
      /**
       * 有孩子路由时优先查孩子路由
       */

      getNavigationParentRoutes(targetPath, result, parentKeys);
    } else if (result) {
      found = true;
    }

    /**
     * 该路由找不到就从数组移除
     */
    if (!found) parentKeys.pop();
  }

  return parentKeys;
}

export const HOME_PANE: NavigationTabPaneProps = {
  tab: "首页",
  tabKey: "/home",
};
