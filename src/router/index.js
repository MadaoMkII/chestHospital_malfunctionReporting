import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import axios from '@/plugins/axios';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('../views/index.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('../views/index/index.vue'),
      },
      {
        path: 'my',
        name: 'index-my',
        component: () => import('../views/index/my.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { data } = await axios.get('/api/user/isLogin');
  const isLogin = data.data;
  if (isLogin) {
    if (!store.state.user) {
      await store.dispatch('fetchUser');
    }
    if (to.name === 'login') {
      next({ name: 'index' });
    } else {
      next();
    }
  } else if (to.name === 'login' || to.name === 'test') {
    next();
  } else {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
  }
});

export default router;