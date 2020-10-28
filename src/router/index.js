import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/rank',
    name: 'Rank',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "rank" */ '../views/Rank.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

//Navigation Guards
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.student.isLogin) {
      next({
        path: '/',
      })
      alert('请先签到')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
