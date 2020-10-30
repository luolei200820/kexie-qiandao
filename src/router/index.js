import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/rank',
    name: 'Rank',
    //meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "rank" */ '../views/Rank.vue'),
  },
  {
    path: '/record',
    name: 'Record',
    component: () => import(/* webpackChunkName: "rank" */ '../views/Record.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
