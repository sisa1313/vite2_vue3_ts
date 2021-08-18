import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from 'vue-router';

// 首字母转换小写
function letterToLowerCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
// 首字母转换大写
function letterToUpperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 路由自动化注册
const routerList: any = [];
function autoRouterRegister(modulesFiles: any) {
  const modulesName = Object.keys(modulesFiles).filter((item: any) => true);
  modulesName.forEach((item: string) => {
    const assignPath = item.match(/views\/(\S*)\./)![1]; // 获取指定字符串之间的内容（正则匹配后添加 ! <断言> 防止ts报红）
    let index = assignPath.lastIndexOf('/');
    const folder = assignPath.substring(0, index); // 获取目录views到文件的路径
    const name = assignPath.substring(index + 1, assignPath.length); // 获取文件名
    // 首字母转小写
    const routerPath = letterToLowerCase(name);
    // 首字母转大写
    const routerName = letterToUpperCase(name);
    routerList.push({
      path: `/${routerPath}`,
      name: `${routerName}`,
      component: () => import(`../views/${folder}/${name}.vue`),
      children: [],
    });
  });
}
// 通过 import.meta.globEager 查找 views/ 下所有以.vue结尾的子文件
const modulesFiles: any = import.meta.globEager('../views/*/**/*.vue');
// 调用路由自动化注册
autoRouterRegister(modulesFiles);
console.log(modulesFiles);

// 第一层的都是特殊用途的组件，例如login.vue、404.vue等，手动输入到router里面了
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
  ...routerList,
];

console.log(routes, '路由表');

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes,
});
// 在VUE中路由遇到Error: Avoided redundant navigation to current location:报错显示是路由重复
const originalPush = router.push;
router.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default router;
