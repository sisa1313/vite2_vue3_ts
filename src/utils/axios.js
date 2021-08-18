import axios from 'axios';
import { Toast } from 'vant';
import router from '@/router/index';
import cache from './cache';
import store from '@/store/index';

function localGet(item) {
  return JSON.parse(localStorage.getItem(item));
}
function localRemove(item) {
  localStorage.removeItem(item);
}

const urlWhiteList = ['/app/version/get'];
const responseMsgWhiteList = ['初始密码登录'];
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    if (!urlWhiteList.includes(config.url) && !config.headers.hideLoading) {
      // request开始loading
      store.commit('showLoading');
    }
    return config;
  },
  (error) => {
    store.commit('hideLoading');
    return Promise.reject(error);
  }
);

// 异常处理
axios.interceptors.response.use(
  (response) => {
    // response后结束loading
    store.commit('hideLoading');
    let result = response.data;
    return new Promise((resolved, reject) => {
      resolved(result);
    });
  },
  async (err) => {
    // response后结束loading
    store.commit('hideLoading');
    if (!urlWhiteList.includes(err.config.url)) {
      if (err.message == 'timeout of 20000ms exceeded') {
        await Toast('请求超时！请检查网络配置是否正确！');
      }
    }
    if (err && err.response) {
      if (!responseMsgWhiteList.includes(err.response.data.errorMsg)) {
        await Toast(err.response.data.errorMsg);
      }
      switch (err.response.status) {
        case 400:
          err.message = '错误请求';
          break;
        case 401:
          localRemove('accessToken');
          err.message = '未授权，请重新登录';
          router.push('/');
          break;
        case 403:
          err.message = '拒绝访问';
          break;
        case 404:
          err.message = '请求错误,未找到该资源';
          break;
        case 405:
          err.message = '请求方法未允许';
          break;
        case 408:
          err.message = '请求超时';
          break;
        case 500:
          err.message = '服务器端出错';
          break;
        case 501:
          err.message = '网络未实现';
          break;
        case 502:
          err.message = '网络错误';
          break;
        case 503:
          err.message = '服务不可用';
          break;
        case 504:
          err.message = '网络超时';
          break;
        case 505:
          err.message = 'http版本不支持该请求';
          break;
        default:
          err.message = `连接错误${err.response.status}`;
      }
      let errData = {
        code: err.response.status,
        message: err.response.data.errorMsg,
      };
      // 统一错误处理可以放这，例如页面提示错误...
      console.log('统一错误处理: ', errData);
      console.log(err.config.url);
    }
    return Promise.reject(err);
  }
);

const http = (options) => {
  return new Promise((resolve, reject) => {
    // const IPAddress = localGet('IPAddress');
    // const ROOT = process.env.NODE_ENV === 'prod' && IPAddress ? IPAddress : process.env.BASE_URL;
    const accessToken = localGet('accessToken');
    const defaultOptions = {};
    const newOptions = {
      ...defaultOptions,
      ...options,
    };
    const Authorization = accessToken && 'Bearer ' + accessToken;
    // 请求头配置
    newOptions.headers = {
      // 'Content-Type': 'application/x-www-form-urlencoded', // form表单提交
      Authorization: Authorization,
      ...newOptions.headers,
    };
    !Authorization && delete newOptions.headers.Authorization;
    axios({
      method: newOptions.method,
      // baseURL: ROOT,
      url: newOptions.url,
      data: newOptions.data,
      headers: {
        ...newOptions.headers,
      },
      responseType: newOptions.responseType,
      timeout: urlWhiteList.includes(newOptions.url) ? 3000 : 20000,
      adapter: cache({
        time: 2000,
      }),
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export default http;
