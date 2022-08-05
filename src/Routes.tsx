import React, { lazy } from "react";

export interface NavigationRouteProps {
  /**
   * 页面唯一标识，写法和页面路径一致，对应菜单的key，tab页的key
   */
  path: string;
  /**
   * 菜单名称
   */
  name: string;
  /**
   * 页面组件路径，如 './home'
   */
  component?:
    | React.LazyExoticComponent<React.ComponentType>
    | React.ComponentType;
  children?: NavigationRouteProps[];
  icon?: React.ReactNode;
  // 是否隐藏于menu，默认不隐藏
  hideInMenu?: boolean;
}

const navigationRoutes: NavigationRouteProps[] = [
  {
    path: "/home",
    name: "首页",
    hideInMenu: true,
    component: React.lazy(() => import("@/pages/home/Blank")),
  },
  {
    path: "/a",
    name: "a管理",
    children: [
      {
        path: "/a/a",
        name: "a管理a子菜单",
        children: [
          {
            path: "/a/a/a",
            name: "a管理a子菜单a页面",
            component: React.lazy(() => import("@/pages/a/a/a")),
          },
          {
            path: "/a/a/b",
            name: "a管理a子菜单b页面",
            component: React.lazy(() => import("@/pages/a/a/b")),
          },
        ],
      },
    ],
  },
  {
    path: "/b",
    name: "b管理",
    children: [
      {
        path: "/b/a",
        name: "b管理a页面",
        component: React.lazy(() => import("@/pages/b/a")),
      },
      {
        path: "/b/b",
        name: "b管理b页面",
        component: React.lazy(() => import("@/pages/b/b")),
      },
    ],
  },
  {
    path: "/c",
    name: "c管理",
    children: [
      {
        path: "/c/a",
        name: "c管理a页面",
        component: React.lazy(() => import("@/pages/c/a")),
      },
      {
        path: "/c/b",
        name: "c管理b子菜单",
        children: [
          {
            path: "/c/b/a",
            name: "c管理b子菜单a页面",
            component: lazy(() => import("@/pages/c/b/a")),
          },
          {
            path: "/c/b/b",
            name: "c管理b子菜单b页面",
            component: lazy(() => import("@/pages/c/b/b")),
          },
          {
            path: "/c/b/c",
            name: "c管理b子菜单c页面",
            component: lazy(() => import("@/pages/c/b/c")),
          },
        ],
      },
    ],
  },
];

export default navigationRoutes;
