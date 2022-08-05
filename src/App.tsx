import React, { Fragment, PropsWithChildren, Suspense } from "react";
import "./App.less";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
// 这是一个全屏loading组件，可以自主实现
import FullScreenLoading from "./components/FullscreenLoading";
import { Helmet } from "react-helmet-async";
import { RouteProps } from "react-router";
// 扁平化路由数组导入
import { globalFlatNavigationRoutes } from "./pages/home/util";
// 获取存储在localStorage的user的全局函数
import { getAppUserInfo } from "./utils";

const Login = React.lazy(() => import("@/pages/auth/login"));
const Home = React.lazy(() => import("@/pages/home"));

const SimpleHelmet: React.FC<PropsWithChildren<{ name: string }>> = ({
  name,
  children,
}) => {
  return (
    <Fragment>
      <Helmet>
        <title>{`${import.meta.env.VITE_APP_NAME}-${name}`}</title>
      </Helmet>
      {children}
    </Fragment>
  );
};

// 路由守卫，有user才会渲染页面路由，否则渲染重定向到登录页
// 同时记录是从什么页面重定向到登录页，方便登录后回到之前想进入的页面
const BeforeEnterRoute: React.FC<
  RouteProps & {
    path: string;
    name: string;
  }
> = ({ ...props }) => {
  const user = getAppUserInfo();
  if (user) {
    return (
      <Route
        exact
        path={props.path}
        render={() => {
          const Comp = props.component as React.ComponentType;
          // 通过设置相同的key防止跳转路由后重渲染
          return (
            <SimpleHelmet name={props.name} key="SAME_HOME_COMPONENT">
              <Comp />
            </SimpleHelmet>
          );
        }}
      />
    );
  }
  const from: string = props.path;
  return <Redirect from={from} to={`/login?from=${from}`} />;
};

function App() {
  return (
    <Router basename={import.meta.env.PROD ? "/manager" : "/"}>
      <Suspense fallback={<FullScreenLoading />}>
        <Switch>
          <Route
            exact
            path="/login"
            render={() => (
              <SimpleHelmet name="登录">
                <Login />
              </SimpleHelmet>
            )}
          />
          {globalFlatNavigationRoutes.map((item) => (
            <BeforeEnterRoute
              exact
              path={item.path}
              name={item.name}
              component={Home}
            />
          ))}
          <Redirect exact from="/" to="/home" />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
