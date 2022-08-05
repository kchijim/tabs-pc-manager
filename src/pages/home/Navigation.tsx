import PageLoading from "@/components/PageLoading";
import React, { Suspense, useMemo } from "react";
import { flatNavigationRoutes, getNavigationRouteInfo } from "./util";

export interface NavigationTabPaneProps {
  tab: string;
  tabKey: string;
  params?: any;
}

interface Props extends NavigationTabPaneProps {
  navigateTo: (info: { key: string }, params?: any) => void;
  refreshing?: boolean;
}

const NavigationTabPane: React.FC<Props> = ({
  tabKey: initPath,
  refreshing,
  ...props
}) => {
  const initPageInfo = useMemo(
    () => getNavigationRouteInfo(initPath, flatNavigationRoutes)!,
    [initPath]
  );

  const PageComp = initPageInfo.component;

  return (
    <Suspense fallback={<PageLoading />}>
      {refreshing ? <PageLoading /> : !!PageComp && <PageComp {...props} />}
    </Suspense>
  );
};

export default NavigationTabPane;
