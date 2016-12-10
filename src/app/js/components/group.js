const { firebase } = window

export default {

  props: ['user'],

  data () {
    return {
      group: null,
      members: {},
      membersList: [],
      userIsMember: false,
      userIsOwner: false
    }
  },

  created () {
    this.fetchData()
  },

  watch: {
    '$route': 'fetchData',
    'user': 'checkMembership',
    'members': 'checkMembership'
  },

  computed: {
    membersList: function () {
      return this.members
        ? Object.keys(this.members).map(uid => this.members[uid])
        : []
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
    fetchData () {
      const { groupId } = this.$route.params
      window.db.ref('groups').child(groupId)
        .on('value', snapshot => {
          if (snapshot.exists()) {
            this.group = snapshot.val()
            this.userIsOwner = this.user && this.group.owner === this.user.uid
          }
        })
      window.db.ref('members').child(groupId)
        .on('value', snapshot => {
          this.members = snapshot.val()
        })
    },
    checkMembership () {
      if (!this.user) return
      const { groupId } = this.$route.params
      window.db.ref('members').child(groupId).child(this.user.uid)
        .once('value', snapshot => {
          this.userIsMember = snapshot.exists()
        })
    },
    join () {
      const { groupId } = this.$route.params
      window.db.ref('members').child(groupId).child(this.user.uid)
        .set({
          displayName: this.user.displayName,
          photoURL: this.user.photoURL
        })
    },
    drawMatches () {
    }
  },

  render (h) {
    return <main>

      {this.group
      ? <div class='group-info'>
        <h1>
          <router-link to='/'>Monito Monita</router-link>
        </h1>
        <div class='name'>{this.group.name}</div>
      </div>
      : <div class='group-info'>
        <div class='spinner' />
      </div>}

      {this.membersList.length > 0
      ? <div class='group-members'>
        <ul>
          {this.membersList.map(member => <li>
            <img src={member.photoURL} />
            {member.displayName}
          </li>)}
        </ul>
      </div>
      : <div class='group-members'>
        <div class='spinner' />
      </div>}

      {this.group && this.membersList.length > 0
      ? this.user
        ? <div class='form-box'>
          {this.userIsMember
            ? (this.userIsOwner
              ? <button onClick={this.drawMatches}>Draw matches</button>
              : <div>Wait for it...</div>)
            : <button onClick={this.join}>Join</button>}
          <small>Logged in as {this.user.displayName} &mdash; <a href='#' onClick={this.logout}>Logout</a></small>
        </div>
        : <div class='form-box'>
          <button onClick={this.login}>
            Login with Facebook
          </button>
        </div>
      : null}

    </main>
  }

}

