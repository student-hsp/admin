import Vue from 'vue'

import VueRouter from 'vue-router'
// 导入浏览器显示进度条
import nprogress from 'nprogress'
import Login from '@/views/login'
import Layout from '@/views/layout'
import Home from '@/views/home'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Settings from '@/views/settings'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  { path: '/login', name: 'login', meta: { title: '后台登录' }, component: Login },
  {
    path: '/',
    // name: 'Layout',
    component: Layout,
    meta: { title: '后台管理' },
    children: [
      {
        path: '',
        name: 'home',
        meta: { title: '仪表盘' },
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        meta: { title: '文章管理' },
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        meta: { title: '文章发布' },
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        meta: { title: '素材管理' },
        component: Image
      },
      {
        path: '/settings',
        name: 'settings',
        meta: { title: '个人设置' },
        component: Settings }
    ]
  },
  {
    // 访问的页面不存在时跳转到首页
    path: '/*',
    hidden: true,
    redirect: { name: 'home' },
    name: 'error'

  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 浏览器进度条
  nprogress.start()
  //  to.meta 设置浏览器 title
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }

  // 获取本地存储 token 信息
  const token = JSON.parse(window.localStorage.getItem('token'))

  /*
    如果访问的页面不是 /login，校验登录状态
    如果没有登录，则跳转到登录状态
    如果登录了，则运行通过
  */
  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (token) {
      // 已登录，运行通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常运行通过
    next()
  }
})

// 在路由的全局后置钩子中，关闭进度条特效
router.afterEach(() => {
  // 结束顶部的导航进度条
  nprogress.done()
})
export default router
