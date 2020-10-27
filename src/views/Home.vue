<template>
  <v-card max-width="1024" class="mx-auto">
    <v-container fluid>
      <!-- 时间警告 -->
      <v-alert v-if="!timeValid" type="warning">现在不是打工时间</v-alert>

      <!-- 显示签到信息 -->
      <v-alert v-if="isLogin" type="success">
        <div>{{ loginResponse.userId }} {{ loginResponse.userName }}</div>
        <div>
          第{{ loginResponse.week }}周 总时长：{{ loginResponse.totalTime }}小时
        </div>
      </v-alert>

      <v-form>
        <v-text-field
          v-model="userId"
          :disabled="!timeValid"
          label="输入学号"
        ></v-text-field>
        <v-btn class="mr-4" :disabled="!timeValid" @click.stop="signIn"
          >签到</v-btn
        >
        <v-btn class="mr-4" :disabled="!timeValid" @click.stop="signOut"
          >签退</v-btn
        >

        <!-- loading对话框 -->
        <v-dialog v-model="isLoding" max-width="300">
          <v-card color="primary" dark>
            <v-card-text>
              请稍等
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- 签退对话框 -->
        <v-dialog v-model="isLogout">
          <v-card>
            <v-container fluid>
              <v-card-text>
                <div>
                  {{ logoutResponse.userId }} {{ logoutResponse.userName }}
                </div>
                <div>本次签到时长：{{ logoutResponse.accumulatedTime }}</div>
                <div>
                  第{{ logoutResponse.week }}周 总时长：{{
                    logoutResponse.totalTime
                  }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn @click.stop="isLogout = !isLogout">确认</v-btn>
              </v-card-actions>
            </v-container>
          </v-card>
        </v-dialog>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      timeValid: true,
      userId: "",
      isLoding: false,
      isLogin: false,
      isLogout: false,
      loginResponse: {
        userId: 1900310227,
        userName: "韦俊宇",
        totalTime: "44.99",
        week: 1,
      },
      logoutResponse: {
        userId: 1900310227,
        userName: "韦俊宇",
        totalTime: "45.02",
        accumulatedTime: "0.03",
        week: 1,
      },
    };
  },
  methods: {
    signIn() {
      this.dialog = true;
      this.$http
        .post("/api/user/signIn", { userId: this.userId })
        .then((res) => {
          if (res.data.code === 0) {
            this.loginResponse = res.data.data;
            this.isLogin = true;
            this.isLoding = false;
            alert(res.data.msg);
          } else {
            this.isLoding = false;
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          alert(err);
          this.isLoding = false;
        });
    },
    signOut() {
      this.isLoding = true;
      this.$http
        .post("/api/user/signOut", { userId: this.userId })
        .then((res) => {
          if (res.data.code === 0) {
            this.signOutResponse = res.data.data;
            this.isLogin = false;
            this.isLoding = false;
          } else {
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          alert(err);
          this.isLoding = false;
        });
    },
  },
  mounted() {
    //使用setInterval来周期性地计算当前的时间
    /* setInterval(() => {
      var time = new Date();
      var hours = time.getHours();
      var minutes = time.getHours();
      if (hours < 6 || (hours >= 23 && minutes >= 30)) {
        //如果早于早上六点，晚于晚上23:30则不在打工时间
        this.timeValid = false;
      }
    }, 1000); */
  },
};
</script>

<style>
</style>