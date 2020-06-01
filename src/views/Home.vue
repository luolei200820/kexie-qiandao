<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="allDisabled">
        <v-alert type="warning">现在不是上班时间</v-alert>
      </v-col>
      <v-col cols="12" v-if="isLogin">
        <v-alert type="success" dense :icon="mdiCheckCircle">
          <h3>已签到</h3>
          <p class="mb-0">学号：{{shareState.student.id}}</p>
          <p class="mb-0">姓名：{{shareState.student.name}}</p>
        </v-alert>
      </v-col>
      <v-col cols="12">
        <v-text-field
          :rules="idError"
          label="输入学号"
          ref="inputId"
          hide-details="auto"
          :disabled="inputIdDisabled"
          v-model="inputId"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn
          class="mr-3"
          color="primary"
          rounded
          :disabled="signUpDisabled"
          @click.stop="signUp"
        >签到</v-btn>
        <v-btn rounded outlined color="gray" :disabled="signOutDisabled" @click.stop="signOut">签退</v-btn>

        <v-dialog v-model="signUpDialog.show" width="500">
          <v-card color="primary" v-if="signUpDialog.loading">
            <v-card-text>
              Please stand by
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>

          <v-card v-else-if="signUpDialog.success">
            <v-card-title class="headline light-green">签到成功</v-card-title>
            <v-card-text>
              <p class="mt-5 mb-0">学号：{{signUpDialog.msg.id}}</p>
              <p class="mb-0">姓名：{{signUpDialog.msg.name}}</p>
              <p class="mb-0">签到开始时间：{{signUpDialog.msg.currentTime}}</p>
              <p class="mb-0">本周签到总时长：{{signUpDialog.msg.allTime}}</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="signUpDialog.show = false">确认</v-btn>
            </v-card-actions>
          </v-card>

          <v-card v-else>
            <v-card-title class="headline red">签到失败</v-card-title>
            <v-card-text>
              <p class="mb-0 mt-5">{{signUpDialog.msg.err}}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="signUpDialog.show = false">确认</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="signOutDialog.show" width="500">
          <v-card color="primary" v-if="signOutDialog.loading">
            <v-card-text>
              Please stand by
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>

          <v-card v-else-if="signOutDialog.success">
            <v-card-title class="headline light-green">签退成功</v-card-title>
            <v-card-text>
              <p class="mt-5 mb-0">学号：{{signOutDialog.msg.id}}</p>
              <p class="mb-0">姓名：{{signOutDialog.msg.name}}</p>
              <p class="mb-0">本次签到时长：{{signOutDialog.msg.currentTime}}h</p>
              <p class="mb-0">签到总时长：{{signOutDialog.msg.allTime}}h</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="signOutDialog.show = false">确认</v-btn>
            </v-card-actions>
          </v-card>

          <v-card v-else>
            <v-card-title class="headline red">签退失败</v-card-title>
            <v-card-text>
              <p class="mt-5 mb-0">{{signOutDialog.msg.err}}</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="signOutDialog.show = false">确认</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            当前在教室的人数：{{inRomList.items.length}}
            <v-spacer></v-spacer>
            <v-text-field
              v-model="inRomList.search"
              :append-icon="mdiMagnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="inRomList.headers"
            :items="inRomList.items"
            :search="inRomList.search"
            mobile-breakpoint="0"
            item-key="userid"
            :items-per-page="5"
          >
            <template v-slot:item.name="{item}">
              <v-chip :color="getColor(item.state)" dark>{{ item.name }}</v-chip>
            </template>
            <template v-slot:item.actions="{item}">
              <v-btn small @click.stop="handleReport(item)">举报</v-btn>
            </template>
          </v-data-table>
        </v-card>
        <v-dialog v-model="reportDialog.show" width="500">
          <v-card>
            <v-card-title class="headline light-green">确认举报</v-card-title>
            <v-card-text>
              <p class="mb-0 mt-5">
                学号：{{reportDialog.msg.id}}
                <br />
                姓名：{{reportDialog.msg.name}}
              </p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="cancelReport">取消</v-btn>
              <v-btn color="primary" text @click="confirmReport">确认</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiCheckCircle, mdiMagnify } from '@mdi/js'
import store from '@/store/store.js'
export default {
  data: function() {
    return {
      mdiCheckCircle,
      mdiMagnify,
      inputId: '',
      shareState: store.state,
      allDisabled: true,
      signUpDialog: {
        loading: false,
        show: false,
        success: false,
        msg: {
          id: '',
          name: '',
          currentTime: '',
          allTime: '',
          err: ''
        }
      },
      signOutDialog: {
        loading: false,
        show: false,
        success: false,
        msg: {
          id: '',
          name: '',
          currentTime: 0,
          allTime: 0,
          err: ''
        }
      },
      reportDialog: {
        show: false,
        msg: {
          id: '',
          name: ''
        }
      },
      inRomList: {
        search: '',
        headers: [
          {
            text: '学号',
            align: 'left',
            sortable: false,
            value: 'userid'
          },
          {
            text: '姓名',
            align: 'left',
            sortable: false,
            width:'100px',
            value: 'username'
          },
          {
            text: '部门',
            align: 'left',
            sortable: true,
            width:'100px',
            value: 'dept'
          },
          {
            text: '地点',
            align: 'left',
            sortable: false,
            value: 'location'
          },
          {
            text: '操作',
            align: 'center',
            sortable: false,
            value: 'actions'
          }
        ],
        items: []
      }
    }
  },
  methods: {
    checkTimeVaild() {
      var currentTime = new Date()
      var hours = currentTime.getHours()
      var minutes = currentTime.getMinutes()
      if (hours < 6 || (hours >= 23 && minutes >= 30)) {
        return false
      } else {
        return true
      }
    },
    signUp() {
      //check valid
      if (!this.$refs.inputId.validate(true)) return
      //loading shows
      this.signUpDialog.show = true
      this.signUpDialog.loading = true
      //send inputid
      this.$http.post('signIn', { userId: this.inputId }).then(res => {
        if (res.data.code === 200) {
          this.signUpDialog.success = true
          this.signUpDialog.loading = false

          //set success msg
          this.signUpDialog.msg.id = this.inputId
          this.signUpDialog.msg.name = res.data.data.username
          this.signUpDialog.msg.currentTime = new Date().toString()
          this.signUpDialog.msg.allTime = res.data.allTime

          //set localStorage
          localStorage.setItem('id', this.inputId)
          localStorage.setItem('name', res.data.data.username)

          //refresh list
          this.getList()
        } else {
          this.signUpDialog.success = false
          this.signUpDialog.loading = false
          this.signUpDialog.msg.err = res.data.message
        }
      })
    },
    signOut() {
      if (!this.$refs.inputId.validate(true)) return
      this.signOutDialog.show = true
      this.signOutDialog.loading = true

      this.$http.post('/signOut', { userId: this.inputId }).then(res => {
        if (res.data.code === 200) {
          this.signOutDialog.loading = false
          this.signOutDialog.success = true
          this.signOutDialog.msg.id = this.inputId
          this.signOutDialog.msg.name = res.data.data.username
          this.signOutDialog.msg.allTime = res.data.allTime
          this.signOutDialog.msg.currentTime = res.data.currentTime

          //refresh list
          this.getList()

          store.setLogOut()
        } else {
          this.signOutDialog.loading = false
          this.signOutDialog.msg.err = res.data.message
        }
      })
    },
    handleReport(item) {
      //console.log(item);
      this.reportDialog.msg.id = item.userid
      this.reportDialog.msg.name = item.username
      this.reportDialog.show = true
    },
    confirmReport() {
      //console.log("submit");
      //console.log("学号：" + this.reportDialog.msg.id);
      this.reportDialog.show = false
      this.$http
        .post('/Complaint', { userId: this.reportDialog.msg.id })
        .then(res => {
          if (res.data === 200) {
            alert('举报成功')
          }
          this.getList()
        })
      //just for test
      //this.inRomList.items.find(this.test).state = 0
      //refresh inRomList...
    },
    cancelReport() {
      this.reportDialog.show = false
    },
    getColor(state) {
      if (state === 0) return 'red'
      else return 'green'
    },
    getList() {
      this.$http.get('/').then(res => {
        this.inRomList.items = res.data
      })
    }
  },
  computed: {
    inputIdDisabled() {
      return this.allDisabled
    },
    signUpDisabled() {
      return this.allDisabled || this.isLogin
    },
    signOutDisabled() {
      return this.allDisabled
    },
    idError() {
      const rules = []

      const allowSpace = false
      const required = true

      if (!allowSpace) {
        const rule = val => (val || '').indexOf(' ') < 0 || '不允许输入空格'
        rules.push(rule)
      }

      if (required) {
        const rule = val => !!val || '不能留空'
        rules.push(rule)
      }

      return rules
    },
    isLogin() {
      //如果本实例的inRomList发生变化，则更新isLogin状态
      return this.inRomList.items.some(item => {
        return item.userid.toString() === localStorage.getItem('id')
      })
    }
  },
  watch: {
    'signUpDialog.loading'(val) {
      if (!val) return
      if (this.signUpDialog.loading) {
        setTimeout(() => (this.signUpDialog.loading = false), 5000)
        this.signUpDialog.success = false
        this.signUpDialog.msg.err = '超时错误'
      }
    },
    'signOutDialog.loading'(val) {
      if (!val) return
      if (this.signOutDialog.loading) {
        setTimeout(() => (this.signOutDialog.loading = false), 5000)
        this.signOutDialog.success = false
        this.signOutDialog.msg.err = '超时错误'
      }
    },
    isLogin(val) {
      //如果computed中的isLogin为true，则设置全局登录状态
      console.log(val)
      if (!val) {
        store.setLogOut()
      } else {
        store.setLogin({
          id: localStorage.getItem('id'),
          name: localStorage.getItem('name')
        })
      }
    }
  },
  mounted() {
    if (this.checkTimeVaild()) {
      this.allDisabled = false
      //get id from localStorage
      this.inputId = localStorage.getItem('id')

      //get list
      this.getList()
    } else {
      console.log('All disabled')
    }
  }
}
</script>
