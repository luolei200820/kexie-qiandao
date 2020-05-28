<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" v-if="allDisabled">
        <v-alert type="warning">现在不是上班时间</v-alert>
      </v-col>
      <v-col cols="12" v-if="student.isLogin">
        <v-alert type="success" prominent :icon="mdiCheckCircle">
          <h3>已签到</h3>
          <p class="mb-0">学号：{{student.id}}</p>
          <p class="mb-0">姓名：{{student.name}}</p>
        </v-alert>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="输入学号"
          :rules="[rules.required]"
          ref="id"
          hide-details="auto"
          v-model="inputId"
          :disabled="inputDisabled"
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
        <v-btn rounded outlined color="gray" @click.stop="signOut">签退</v-btn>

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
              <p class="mt-5">学号：{{signUpDialog.msg.id}}</p>
              <p>姓名：{{signUpDialog.msg.name}}</p>
              <p class="mb-0">签到开始时间：{{signUpDialog.msg.time}}</p>
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
              <p class="mb-0 mt-5">已经签到或者学号写错了</p>
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
              <p class="mt-5">学号：{{signOutDialog.msg.id}}</p>
              <p>姓名：{{signOutDialog.msg.name}}</p>
              <p class="mb-0">本次签到时长：{{signOutDialog.msg.time}}</p>
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
              <p class="mt-5 mb-0">没有签到或者学号写错了</p>
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
import { mdiCheckCircle, mdiMagnify } from "@mdi/js";
import store from "@/store/store.js";
export default {
  data: function() {
    return {
      mdiCheckCircle,
      mdiMagnify,
      student: store.state.student,
      inputId: "",
      allDisabled: true,
      rules: {
        required: value => !!value || "不能留空."
      },
      signUpDialog: {
        loading: false,
        show: false,
        success: false,
        msg: {
          id: "",
          name: "",
          time: ""
        }
      },
      signOutDialog: {
        loading: false,
        show: false,
        success: false,
        msg: {
          id: "",
          name: "",
          time: ""
        }
      },
      reportDialog: {
        show: false,
        msg: {
          id: "",
          name: ""
        }
      },
      inRomList: {
        search: "",
        headers: [
          {
            text: "学号",
            align: "left",
            sortable: false,
            value: "id"
          },
          {
            text: "姓名",
            align: "center",
            sortable: false,
            value: "name"
          },
          {
            text: "操作",
            align: "center",
            sortable: false,
            value: "actions"
          }
        ],
        items: [
          {
            id: "1800301223",
            name: "罗磊",
            state: 1
          },
          {
            id: "1800301224",
            name: "罗小猪1",
            state: 1
          },
          {
            id: "18003012241",
            name: "罗小猪2",
            state: 1
          },
          {
            id: "18003012242",
            name: "罗小猪3",
            state: 1
          },
          {
            id: "18003012243",
            name: "罗小猪4",
            state: 1
          },
          {
            id: "18003012244",
            name: "罗小猪5",
            state: 1
          },
          {
            id: "18003012245",
            name: "罗小猪6",
            state: 1
          },
          {
            id: "18003012246",
            name: "罗小猪7",
            state: 1
          }
        ]
      }
    };
  },
  methods: {
    checkTimeVaild() {
      var currentTime = new Date();
      var hours = currentTime.getHours();
      var minutes = currentTime.getMinutes();
      //console.log("当前时间 " + hours + ":" + minutes);
      if (hours < 6 || (hours >= 23 && minutes >= 30)) {
        return false;
      } else {
        return true;
      }
    },
    signUp() {
      if (!this.$refs.id.validate(true)) return;
      this.signUpDialog.show = true;
      this.signUpDialog.loading = true;
      setTimeout(() => {
        //send inputId
        var res = {
          name: "罗磊",
          time: "", //签到开始时间
          state: Math.round(Math.random()) //just for test
        };
        if (res.state) {
          this.signUpDialog.loading = false;
          this.signUpDialog.success = true;
          this.signUpDialog.msg.id = this.inputId;
          this.signUpDialog.msg.name = res.name;
          this.signUpDialog.msg.time = new Date().toString();
          //refresh inRomList

          //set global state
          store.setLogin({
            id: this.inputId,
            name: res.name
          });

          //set localStorage
          localStorage.setItem("id", this.inputId);
        } else {
          this.signUpDialog.loading = false;
          this.signUpDialog.success = false;
        }
      }, 2000);
    },
    signOut() {
      if (!this.$refs.id.validate(true)) return;
      this.signOutDialog.show = true;
      this.signOutDialog.loading = true;

      setTimeout(() => {
        //send local student id
        var res = {
          name: "罗磊",
          time: "3小时",
          state: Math.round(Math.random())
        };
        if (res.state === 1) {
          this.signOutDialog.loading = false;
          this.signOutDialog.success = true;
          this.signOutDialog.msg.id = this.inputId;
          this.signOutDialog.msg.name = res.name;
          this.signOutDialog.msg.time = res.time;
          store.setLogOut();
        } else {
          this.signOutDialog.loading = false;
          this.signOutDialog.success = false;
        }
      }, 2000);
    },
    handleReport(item) {
      //console.log(item);
      this.reportDialog.msg.id = item.id;
      this.reportDialog.msg.name = item.name;
      this.reportDialog.show = true;
    },
    confirmReport() {
      //console.log("submit");
      //console.log("学号：" + this.reportDialog.msg.id);
      this.reportDialog.show = false;
      //just for test
      this.inRomList.items.find(this.test).state = 0;
      //refresh inRomList...
    },
    test(item) {
      return item.id === this.reportDialog.msg.id;
    },
    cancelReport() {
      this.reportDialog.show = false;
    },
    getColor(state) {
      if (state === 0) return "red";
      else return "green";
    }
  },
  watch: {
    "signUpDialog.loading"(val) {
      if (!val) return;
      if (this.signUpDialog.loading)
        setTimeout(() => (this.signUpDialog.loading = false), 10000);
    },
    "signOutDialog.loading"(val) {
      if (!val) return;
      if (this.signUpDialog.loading)
        setTimeout(() => (this.signOutDialog.loading = false), 10000);
    }
  },
  computed: {
    inputDisabled() {
      return this.student.isLogin;
    },
    signUpDisabled() {
      return this.student.isLogin;
    }
  },
  beforeMount() {
    //get id from localStorage
    this.inputId = localStorage.getItem("id");

    if (this.checkTimeVaild()) {
      this.allDisabled = false;

      //console.log(`check ${this.inputId} login?`);
      var res = {
        name: "罗磊",
        state: Math.round(Math.random())
      };
      if (res.state === 1) {
        store.setLogin({
          id: this.inputId,
          name: res.name
        });
      }
      //get inRomList
    } else {
      console.log("All disabled");
    }
  }
};
</script>
