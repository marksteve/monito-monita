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
    logout (e) {
      e.preventDefault()
      firebase.auth().signOut()
    },
    createGroup () {
      this.$firebaseRefs.groups.push({
        name: this.groupName
      })
    }
  },

  render (h) {
    return this.user
    ? <div class='form-box'>
      <input
        placeholder='Group name'
        onInput={e => {
          this.groupName = e.target.value
        }}
        value={this.groupName} />
      <button onClick={this.createGroup} disabled={!this.groupName}>
        Create group
      </button>
      <small>Logged in as {this.user.displayName} &mdash; <a href='#' onClick={this.logout}>Logout</a></small>
    </div>
    : <div>
      <button onClick={this.login}>
        Login with Facebook
      </button>
    </div>
  }

}

