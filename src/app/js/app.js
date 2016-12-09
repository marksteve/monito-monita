import Vue from 'vue'
import VueRouter from 'vue-router'
import VueFire from 'vuefire'

Vue.use(VueRouter)
Vue.use(VueFire)

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
      <div class='intro-text'>
        <h1>Monito Monita</h1>
        <p>Monito Monita is what we call <a href='https://en.wikipedia.org/wiki/Secret_Santa'>Secret Santa</a> in the Philippines</p>
        <ol class='steps-list'>
          <li>Create a group</li>
          <li>Invite your friends</li>
          <li>Match!</li>
        </ol>
        <p><small>Made by <a href='https://marksteve.com'>marksteve</a></small></p>
      </div>
      <router-view user={this.user} />
    </main>
  }
})

window.firebase.auth().onAuthStateChanged(function (user) {
  app.user = user
})

app.$mount('#app')
