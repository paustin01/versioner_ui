import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router';
import { routes } from './routes.js';
import 'vuetify/dist/vuetify.min.css';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.use(Vuetify);



Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  //mode:'history',
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
