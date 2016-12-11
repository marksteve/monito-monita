import Vue from 'vue'
import VueRouter from 'vue-router'
import VueFire from 'vuefire'

Vue.use(VueRouter)
Vue.use(VueFire)

import Index from './components/index'
import Group from './components/group'

const routes = [
  { path: '/', component: Index },
  { path: '/:groupId', component: Group }
]
const router = new VueRouter({ routes })

const app = new Vue({
  router,
  data: { user: null },
  render (h) {
    return <router-view user={this.user} />
  }
})

window.firebase.auth().onAuthStateChanged(function (user) {
  app.user = user
})

app.$mount('#app')
