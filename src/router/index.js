import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '../components/login.vue'
// import home from '../components/home.vue'
// import welcome from '../components/welcome.vue'
const login = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/login.vue')
const home = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/home.vue')
const welcome = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/welcome.vue')

// import users from '../components/user/users.vue'
// import rights from '../components/power/rights.vue'
// import roles from '../components/power/roles.vue'
const users = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/user/users.vue')
const rights = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/power/rights.vue')
const roles = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/power/roles.vue')

// import categories from '../components/goods/categories.vue'
// import params from '../components/goods/params.vue'
const categories = () => import(/* webpackChunkName: "cate=params" */ '../components/goods/categories.vue')
const params = () => import(/* webpackChunkName: "cate=params" */ '../components/goods/params.vue')

// import list from '../components/goods/list.vue'
// import add from '../components/goods/add.vue'
const list = () => import(/* webpackChunkName: "list-add" */ '../components/goods/list.vue')
const add = () => import(/* webpackChunkName: "list-add" */ '../components/goods/add.vue')

// import order from '../components/order/order.vue'
// import report from '../components/report/report.vue'
const order = () => import(/* webpackChunkName: "order-report" */ '../components/order/order.vue')
const report = () => import(/* webpackChunkName: "order-report" */ '../components/report/report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles },
      { path: '/categories', component: categories },
      { path: '/params', component: params },
      { path: '/goods', component: list },
      { path: '/goods/add', component: add },
      { path: '/orders', component: order },
      { path: '/reports', component: report }
    ] }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的地址
  // from 从哪个地址跳转而来
  // next 是一个函数，表示放行
  // next() 放行   next('/login')  强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
