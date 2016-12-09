const { firebase } = window

export default {

  props: ['user'],

  data () {
    return {
      groupName: ''
    }
  },

  firebase: {
    groups: window.db.ref('groups')
  },

  methods: {
    login () {
      const provider = new firebase.auth.FacebookAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },
    createGroup () {
      this.$firebaseRefs.groups.push({
        name: this.groupName
      })
    }
  },

  render (h) {
    return this.user
    ? <div>
      <input v-model='groupName' placeholder='Group name' />
      <button onClick={this.createGroup}>
        Create group
      </button>
    </div>
    : <div>
      <button onClick={this.login}>
        Login
      </button>
    </div>
  }

}

