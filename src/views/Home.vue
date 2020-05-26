<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" v-if="disable">
        <v-alert type="warning">现在不是上班时间</v-alert>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="输入学号"
          :rules="[rules.required]"
          ref="id"
          hide-details="auto"
          v-model="inputId"
          :disabled="disable"
        ></v-text-field>
        <div class="mt-3">
          <v-btn
            class="mr-3"
            color="primary"
            rounded
            :disabled="disable"
            @click.stop="signUp"
          >签到</v-btn>
          <v-btn :disabled="disable" rounded outlined color="gray" @click="signOut">签退</v-btn>

          <v-dialog v-model="dialog.show" width="500">
            <v-card color="primary" v-if="dialog.loading">
              <v-card-text>
                Please stand by
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
              </v-card-text>
            </v-card>

            <v-card v-else>
              <v-card-title
                :class="{'headline':true,'light-green':dialog.success,'red':!dialog.success}"
              >{{dialog.header}}</v-card-title>
              <v-card-text v-html="dialog.content"></v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog.show = false">确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          caption="当前在教室的人"
          :headers="inRomList.headers"
          :items="inRomList.items"
          hide-default-footer
        >
          <template v-slot:item.actions="{item}">
            <v-btn small @click="handleReport(item)">举报</v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12">
        <v-data-table
          caption="排名"
          :headers="rankList.headers"
          :items="rankList.items"
          hide-default-footer
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: function() {
    return {
      inputId: "",
      disable: false,
      rules: {
        required: value => !!value || "不能留空."
      },
      dialog: {
        loading: false,
        show: false,
        success: false,
        header: "",
        content: ""
      },
      signUpMessage: {
        id: "1800301223",
        name: "罗磊",
        time: "11h"
      },
      signOutMessage: {
        id: "1800301223",
        name: "姓名",
        time: "10h"
      },
      inRomList: {
        headers: [
          {
            text: "学号",
            align: "center",
            width: "150px",
            sortable: false,
            value: "id"
          },
          {
            text: "姓名",
            width: "150px",
            align: "center",
            sortable: false,
            value: "name"
          },
          {
            text: "操作",
            align: "start",
            sortable: false,
            value: "actions"
          }
        ],
        items: [
          {
            id: "1800301223",
            name: "罗磊"
          }
        ]
      },
      rankList: {
        headers: [
          {
            text: "学号",
            width: "150px",
            align: "center",
            sortable: false,
            value: "id"
          },
          {
            text: "姓名",
            width: "150px",
            align: "center",
            sortable: false,
            value: "name"
          },
          {
            text: "当前时长",
            width: "150px",
            align: "center",
            sortable: false,
            value: "time"
          },
          {
            text: "排名",
            align: "center",
            sortable: false,
            value: "rank"
          }
        ],
        items: [
          {
            id: "1800301223",
            name: "罗磊",
            time: "11h",
            rank: 1
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
      console.log("当前时间 " + hours + ":" + minutes);
      if (hours < 6 || (hours >= 23 && minutes >= 30)) {
        return false;
      } else {
        return true;
      }
    },
    handleReport(item) {
      console.log(item);
    },
    signUp() {
      if (!this.$refs.id.validate(true)) return;
      this.dialog.show = true;
      this.dialog.loading = true;
      var state = false;
      if (state) {
        this.dialog.success = true;
        this.dialog.header = "签到成功";
        this.dialog.content = `
          <p class="mb-0 mt-5">
          学号：${this.signUpMessage.id}<br>
          姓名：${this.signUpMessage.name}<br>
          签到时间： ${new Date()}
          </p>
        `;
      } else {
        this.dialog.success = false;
        this.dialog.header = "签到失败";
        this.dialog.content = `
          <p class="mb-0 mt-5">
            你可能已经签过了
          </p>
        `;
      }
    },
    signOut() {
      if (!this.$refs.id.validate(true)) return;
      this.dialog.show = true;
      this.dialog.loading = true;
      var state = false;
      if (state) {
        this.dialog.success = true;
        this.dialog.header = "签退成功";
        this.dialog.content = `
          <p class="mb-0 mt-5">
          学号：${this.signUpMessage.id}<br>
          姓名：${this.signUpMessage.name}<br>
          本次签到时长： 11h
          </p>
        `;
      } else {
        this.dialog.success = false;
        this.dialog.header = "签退失败";
        this.dialog.content = `
          <p class="mb-0 mt-5">
            可能学号输错了
          </p>
        `;
      }
    }
  },
  watch: {
    "dialog.loading"(val) {
      if (!val) return;
      setTimeout(() => (this.dialog.loading = false), 4000);
    }
  },
  beforeMount() {
    this.disable = !this.checkTimeVaild();
  }
};
</script>
