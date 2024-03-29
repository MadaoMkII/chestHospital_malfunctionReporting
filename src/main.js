import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins';
import './components';

Vue.config.productionTip = false;

async function main() {
  store.dispatch('sync');
  await store.dispatch('fetchConfig');
  Vue.prototype.$axios.defaults.headers.common['Wechat-Agent-Id'] = store.state.config.agentId;
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
}

main();
