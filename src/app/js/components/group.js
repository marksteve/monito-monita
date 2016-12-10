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
    'user': 'checkMembership'
  },

  computed: {
    membersList: function () {
      return Object.keys(this.members)
        .map(uid => this.members[uid])
    }
  },

  methods: {
    fetchData () {
      const { groupId } = this.$route.params
      window.db.ref('groups').child(groupId)
        .on('value', snapshot => {
          if (snapshot.exists()) {
            this.group = snapshot.val()
            this.userIsOwner = this.group.owner === this.user.uid
          }
        })
      window.db.ref('members').child(groupId)
        .on('value', snapshot => {
          this.members = snapshot.val()
        })
    },
    checkMembership () {
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
      : <div class='spinner' />}

      {this.membersList
      ? <ul class='group-members'>
        {this.membersList.map(member => <li>
          <img src={member.photoURL} />
          {member.displayName}
        </li>)}
      </ul>
      : null}

      <div class='form-box'>
        {this.userIsMember
        ? (this.userIsOwner
          ? <button onClick={this.drawMatches}>Draw matches</button>
          : <div>Wait for it...</div>)
        : <button onClick={this.join}>Join</button>}
      </div>

    </main>
  }

}

