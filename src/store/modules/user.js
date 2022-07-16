//引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
//获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
//路由模块当中重置路由的方法
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from '@/router'
import router from '@/router'
//深拷贝
import cloneDeep from 'lodash/cloneDeep'
//箭头函数
const getDefaultState = () => {
  return {
    //获取token
    token: getToken(),
    //用户名
    name: '',
    //用户头像
    avatar: '',
    //服务器返回的菜单信息【根据不同的角色：返回的标记信息，数组里面的元素是字符串】
    routes: [],
    //角色信息
    roles: [],
    //按钮权限的信息
    buttons: [],
    //对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的理由】
    resultAsyncRoutes: [],
    //用户最终需要展示全部路由
    resultAllRputes: []
  }
}

const state = getDefaultState()
//唯一修改state的地方
const mutations = {
  //重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  //存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    //用户名
    state.name = userInfo.name;
    //用户头像
    state.avatar = userInfo.avatar;
    //菜单权限标记
    state.routes = userInfo.routes;
    //按钮权限标记
    state.buttons = userInfo.buttons;
    //角色
    state.roles = userInfo.roles;
  },
  //最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    //vuex保存当前用户的异步路由，注意，一个用户需要展示完成路由：常量、异步、任意路由
    state.resultAsyncRoutes = asyncRoutes
    //计算出当前用户需要展示所有路由
    // concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组
    state.resultAllRputes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
    //给路由器添加新的路由
    router.addRoutes(state.resultAllRputes)
    // console.log(state.resultAllRputes)
  }
}
//定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  //过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) != -1) {
      //递归:别忘记还有2、3、4、5、6级路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true;
    }
  })
}

const actions = {
  // 登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject('error')
    }
  },

  //获取用户信息
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token)
    // console.log(result)
    //获取用户信息:返回数据包含：用户名name、用户头像avatar、routes[返回的标志:不同的用户应该展示哪些菜单的标记]、roles（用户角色信息）、buttons【按钮的信息：按钮权限用的标记】
    if (result.code === 20000) {
      //存储全部信息
      commit('SET_USERINFO', result.data)
      //用定义的函数，过滤掉没有权限的路由，将需要访问的路由返回
      commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(cloneDeep(asyncRoutes), result.data.routes))
      return result.data
    } else {
      return Promise.reject('error')
    }
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response

    //     if (!data) {
    //       return reject('Verification failed, please Login again.')
    //     }

    //     const { name, avatar } = data

    //     commit('SET_NAME', name)
    //     commit('SET_AVATAR', avatar)
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 退出登录
  async logout({ commit, state }) {
    let result = await logout(state.token)
    // console.log(result)
    if (result.code === 20000) {
      removeToken() //首先删除token
      resetRouter() //重置路由
      commit('RESET_STATE') //重置state
      return 'ok'
    } else {
      return Promise.reject('error')
    }
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必选首先删除token
      commit('RESET_STATE') //重置路由
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

