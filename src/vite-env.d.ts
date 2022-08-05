/// <reference types="vite/client" />

declare type ResultOf<R extends () => any> = ReturnType<R> extends Promise<
  infer T
>
  ? T
  : ReturnType<R>;

interface UserInfo {
  phone: string;
}

interface NVPair<T = any> {
  name: string;
  value: T;
}

interface KVPair<T = any> {
  key: string;
  value: T;
}

type IIdentity = string | number;

interface Entity {
  id: IIdentity;
}

interface NameEntity extends Entity {
  name: string;
}

interface NavigationRouteProps {
  /**
   * 页面唯一标识，写法和页面路径一致，也是对应菜单的key
   */
  path: string;
  /**
   * 菜单名称
   */
  name: string;
  /**
   * 页面组件路径，如 './device'
   */
  component?:
    | React.LazyExoticComponent<React.ComponentType>
    | React.ComponentType;
  children?: NavigationRouteProps[];
  icon?: React.ReactNode;
  hideInMenu?: boolean;
}
