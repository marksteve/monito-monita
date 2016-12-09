import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Index from './components/index'

const routes = [
  { path: '/', component: Index }
]
const router = new VueRouter({ routes })

const app = new Vue({
  router,
  data: { user: null },
  render (h) {
    return <main>
      <h1>Monito Monita</h1>
      <router-view user={this.user} />
    </main>
  }
})

window.firebase.auth().onAuthStateChanged(function (user) {
  app.user = user
})

app.$mount('#app')
