//引入vue
import Vue from 'vue'
//引入vue-router
import Router from 'vue-router'
import store from '@/store'
//使用路由插件
Vue.use(Router)

/* 引入最外层的骨架的一级路由组件 */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

//路由的配置：为什么不同用户登录我们的项目，菜单（路由）都是一样的？
//因为咱们的路由‘死的’，不管你是谁，你能看见的，操作的菜单都是一样的
//需要把项目中的路由进行拆分

//常量路由:就是不关用户是什么角色，都可以看见的路由
//什么角色（超级管理员，普通员工）：登录、404、首页
// 常量路由就是谁都能看见的路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
]
//异步理由:不同的用户（角色），需要过滤筛选出的路由，称之为异步路由
//有的用户可以看见测试管理、有的看不见
export const asyncRoutes = [
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/Attr/index'),
        meta: { title: '平台属性管理' }
      },
      {
        path: 'tradeMark',
        name: 'Trademark',
        component: () => import('@/views/product/tradeMark'),
        meta: { title: '品牌管理' }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/Sku'),
        meta: { title: 'Sku管理' }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/Spu'),
        meta: { title: 'Spu管理' }
      },
    ]
  },
  {
    path: '/acl',
    component: Layout,
    name: 'Acl',
    redirect: '/acl/user/list',
    meta: { title: '权限管理', icon: 'el-icon-lock' },
    children: [
      {
        path: 'user/list',
        name: 'User',
        component: () => import('@/views/acl/user/list'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role/list',
        name: 'Role',
        component: () => import('@/views/acl/role/list'),
        meta: { title: '角色管理' }
      },
      {
        path: 'role/tree/:id',
        name: 'RoleAuth',
        component: () => import('@/views/acl/role/tree'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        path: 'permission/list',
        name: 'Permission',
        component: () => import('@/views/acl/permission/list'),
        meta: { title: '菜单管理' }
      },
    ]
  },
  {
    path: '/test',
    component: Layout,
    name: 'Test',
    meta: { title: '测试管理', icon: 'el-icon-suitcase-1' },
    children: [
      {
        path: 'test1',
        name: 'Test1',
        component: () => import('@/views/test/Test1'),
        meta: { title: '测试管理1' }
      },
      {
        path: 'test2',
        name: 'Test2',
        component: () => import('@/views/test/Test2'),
        meta: { title: '测试管理2' }
      }
    ]
  }
]
//任意路由：当路径出现错误的时候重定向404
export const anyRoutes = { path: '*', redirect: '/404', hidden: true }



const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  //因为注册的路由是‘死的’，‘活的’路由如果根据不同用户（角色）可以展示不同菜单
  routes: constantRoutes
})

const router = createRouter()

// 记录路由
let hasRoles = true
// 白名单(不需要登录就可以访问的名单)
const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  //获取token
  let token = store.state.user.token
  //判断是否登录
  if (token) {
    //如果等录还去登录页，直接返回首页
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      //调用获取信息的action，重新获取动态路由
      await store.dispatch('user/getInfo')
      //拿到动态添加的路由
      let routes = store.state.user.resultAllRputes
      if (hasRoles) {
        //重新添加动态路由
        router.addRoutes(routes)
        hasRoles = false
        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    //如果没有登录，如果要去登录页，直接放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login`)
    }
  }

})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
