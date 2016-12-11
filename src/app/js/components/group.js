const { firebase } = window

// https://www.frankmitchell.org/2015/01/fisher-yates/
function shuffle (array) {
  let i = 0
  let j = 0
  let temp = null
  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

export default {

  props: ['user'],

  data () {
    return {
      group: null,
      members: {},
      membersList: [],
      userIsMember: false,
      userIsOwner: false,
      userMatch: null
    }
  },

  created () {
    this.fetchGroup()
    this.fetchMatch()
  },

  watch: {
    user () {
      this.fetchMembership()
      this.fetchMatch()
    },
    members () {
      this.fetchMembership()
    }
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
    fetchGroup () {
      const { groupId } = this.$route.params

      // Fetch group info
      window.db.ref('groups').child(groupId)
        .on('value', snapshot => {
          if (snapshot.exists()) {
            this.group = snapshot.val()
            this.userIsOwner = this.user && this.group.owner === this.user.uid
          }
        })

      // Fetch group
      window.db.ref('members').child(groupId)
        .on('value', snapshot => {
          this.members = snapshot.val()
        })
    },
    fetchMembership () {
      if (!this.user) return
      const { groupId } = this.$route.params
      window.db.ref('members').child(groupId).child(this.user.uid)
        .on('value', snapshot => {
          this.userIsMember = snapshot.exists()
        })
    },
    fetchMatch () {
      if (!this.user) return
      const { groupId } = this.$route.params
      window.db.ref('matches').child(groupId).child(this.user.uid)
        .on('value', snapshot => {
          this.userMatch = snapshot.val()
        })
    },
    join () {
      const { groupId } = this.$route.params
      window.db.ref('members').child(groupId).child(this.user.uid)
        .set({
          uid: this.user.uid,
          displayName: this.user.displayName,
          photoURL: this.user.photoURL
        })
    },
    drawMatches () {
      const { groupId } = this.$route.params
      let membersList = this.membersList.slice()
      shuffle(membersList)
      let i = 0
      while (i < membersList.length) {
        window.db.ref('matches').child(groupId).child(membersList[i++].uid)
          .set(membersList[i % membersList.length])
      }
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
            <div class='photo'>
              <img src={member.photoURL} />
            </div>
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
          {this.userMatch
          ? this.userIsMember
            ? <div class='user-match'>
              <p>You've been matched with:</p>
              <p>
                <div class='photo'>
                  <img src={this.userMatch.photoURL} />
                </div>
                <span class='name'>
                  {this.userMatch.displayName}
                </span>
              </p>
            </div>
            : <p>Matches have been drawn! You can't join this group anymore :(</p>
          : this.userIsMember
            ? this.userIsOwner
              ? this.membersList > 2
                ? <button onClick={this.drawMatches}>Draw matches</button>
                : <div>Waiting for other participants&hellip;</div>
              : <div>Waiting for your match&hellip;</div>
            : <button onClick={this.join}>Join</button>}
          <small>Logged in as {this.user.displayName} &mdash; <a href='#' onClick={this.logout}>Logout</a></small>
        </div>
        : <div class='form-box'>
          <button onClick={this.login}>
            Login with Facebook
          </button>
        </div>
      : null}

      <div class='invite-link'>
        <p><small>Invite your friends by sharing this url:</small></p>
        <pre><code><a href={window.location.href}>{window.location.href}</a></code></pre>
      </div>

    </main>
  }

}

