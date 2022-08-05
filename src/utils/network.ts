import { notification } from "antd";
import { extend } from "umi-request";

const codeMessage: Record<number, string> = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

/** 异常处理程序 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    if (import.meta.env.DEV) {
      console.log(`请求错误 ${status}: ${url}`);
      console.log(errorText);

      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    } else {
      notification.error({ message: "网络异常" });
    }
  } else if (!response) {
    notification.error({ message: "网络异常" });
  }
  return response;
};

/** 配置request请求时的默认参数 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: "include", // 默认请求是否带上cookie
});

export interface NetworkResp<T = null> {
  cnmsg: string;
  enmsg: string;
  code: number;
  data: T;
}

class NetworkError extends Error {
  public readonly code: number;
  constructor(cnmsg: string, code: number) {
    super(cnmsg);
    Object.setPrototypeOf(this, NetworkError.prototype);
    this.code = code;
  }
}

export async function post<T = null>(api: string, params: any = {}) {
  let data = params;
  if (!(params instanceof FormData)) {
    data = { data: { ...params } };
  }

  const resp = await request.post<NetworkResp<T>>(api, {
    data,
    requestType: params instanceof FormData ? "form" : "json",
  });
  if (resp) {
    if (resp.code === 200 && resp.enmsg === "ok") {
      return resp.data;
    }

    if (import.meta.env.DEV) {
      console.log(`服务器报错 ${resp.code}: ${api}`);
      console.log(resp.cnmsg);

      notification.error({
        message: `服务器报错 ${resp.code}: ${api}`,
        description: resp.cnmsg,
      });
    } else {
      notification.error({
        message: resp.cnmsg,
        description: "请联系管理员",
      });
    }

    throw new NetworkError(resp.cnmsg, resp.code);
  }
  return Promise.reject(resp);
}

export default request;
