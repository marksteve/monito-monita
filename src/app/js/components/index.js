const { firebase } = window

export default {

  props: ['user'],

  data () {
    return {
      groupName: ''
    }
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
      const newGroup = window.db.ref('groups').push({
        name: this.groupName,
        owner: this.user.uid
      })
      window.db.ref('members').child(newGroup.key).child(this.user.uid)
        .set({
          displayName: this.user.displayName,
          photoURL: this.user.photoURL
        })
    }
  },

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
      {this.user
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
      </div>}
    </main>
  }

}

