import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueAxios, axios.create({
  baseURL: process.env.VUE_APP_SERVER
}))

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App)
}).$mount('#app')
