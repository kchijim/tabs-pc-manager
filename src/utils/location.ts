import { parse } from "querystring";

export const queryParse = (str?: string) => {
  const queryString = (str || window.location.search).replace(/^\?/, "");
  return parse(queryString);
};

export const getQueryValueByKey = (key: string, str?: string) => {
  const queryObj = queryParse(str);
  return queryObj[key];
};
