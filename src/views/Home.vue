<template>
  <div>
    <v-card
      max-width="1024"
      class="mx-auto"
    >
      <v-container fluid>
        <!-- 时间警告 -->
        <v-alert
          v-if="!timeValid"
          type="warning"
        >现在不是打工时间</v-alert>

        <!-- 显示签到信息 -->
        <v-alert
          v-if="$store.state.isLogin"
          type="success"
        >
          <div>{{ $store.state.userId }} {{ $store.state.userName }}</div>
          <div>第{{ $store.state.week }}周 总时长：{{$store.state.totalTime}}小时</div>
        </v-alert>

        <!-- 显示签退信息 -->
        <v-alert
          v-if="$store.state.isLogout"
          type="info"
        >
          <div>{{ $store.state.userId }} {{ $store.state.userName }}</div>
          <div>本次签到时长：{{ $store.state.accumulatedTime }}</div>
          <div>第{{ $store.state.week }}周 总时长：{{$store.state.totalTime}}小时</div>
        </v-alert>

        <v-form>
          <v-text-field
            v-model="userId"
            :disabled="!timeValid"
            label="输入学号"
          ></v-text-field>
          <v-btn
            class="mr-4"
            :disabled="!timeValid"
            @click.stop="signIn"
          >签到</v-btn>
          <v-btn
            class="mr-4"
            :disabled="!timeValid"
            @click.stop="signOut"
          >签退</v-btn>

          <!-- loading对话框 -->
          <v-dialog
            v-model="isLoding"
            max-width="300"
            persistent
          >
            <v-card
              color="primary"
              dark
            >
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
        </v-form>
      </v-container>
    </v-card>

    <!-- 当前在线的人列表 -->
    <v-card
      class="my-4 mx-auto"
      max-width="1024"
    >
      <v-container fluid>
        <v-text-field
          outlined
          dense
          v-model="keyword"
          :disabled="!timeValid"
          @keyup="filter"
          label="搜索"
        ></v-text-field>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>部门</th>
                <th>地点</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filtedTableDatd"
                :key="item.userId"
                :class="{ warning: item.status }"
              >
                <td>{{ item.userId }}</td>
                <td>{{ item.userName }}</td>
                <td>{{ item.userDept }}</td>
                <td>{{ item.userLocation }}</td>
                <td>
                  <v-btn @click.stop="report(item.userId.toString(),$store.state.userId.toString())">举报</v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-card>

  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      timeValid: true,
      userId: "",
      keyword: "",
      isLoding: false,
      tableData: [],
      filtedTableDatd: [],
    };
  },
  methods: {
    signIn() {
      localStorage.setItem("userId", this.userId); //本地保存学号
      this.isLoding = true; //显示loading
      this.$http
        .post("/api/user/signIn", { userId: this.userId })
        .then((res) => {
          if (res.data.code === 0) {
            this.getOnline(); //更新当前在线人的列表
            this.$store.commit("setLogin", res.data.data); //vuex设置登录
            //本地存储登录信息
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("userId", res.data.data.userId);
            localStorage.setItem("userName", res.data.data.userName);
            localStorage.setItem("totalTime", res.data.data.totalTime);
            localStorage.setItem("week", res.data.data.week);
          } else {
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          alert(err);
        })
        .finally(() => {
          this.isLoding = false; //关闭loading
        });
    },
    signOut() {
      this.isLoding = true; //显示loading
      this.$http
        .post("/api/user/signOut", { userId: this.userId })
        .then((res) => {
          if (res.data.code === 0) {
            //从列表中删除自己
            let that = this;
            let index = this.tableData.findIndex(function (person) {
              return person.userId === that.userId;
            });
            this.tableData.splice(index, 1);
            //vuex设置签退信息
            this.$store.commit("setLogout", res.data.data);
            //清楚本地的签到信息
            localStorage.setItem("isLogin", "false");
          } else {
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          alert(err);
        })
        .finally(() => {
          this.isLoding = false;
        });
    },
    getOnline() {
      this.$http
        .get("/api/record/online")
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data;
            this.filtedTableDatd = this.tableData;
          } else {
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    filter() {
      if (this.keyword === "") this.filtedTableDatd = this.tableData;
      else {
        this.filtedTableDatd = this.tableData.filter((item) => {
          for (var key in item) {
            let value = item[key].toString();
            if (value.indexOf(this.keyword) !== -1) {
              console.log(value);
              return true;
            }
          }
          return false;
        });
      }
    },
    report(targetUserId, operatorUserId) {
      if (operatorUserId === "") alert("请先输入自己的学号");
      else if (targetUserId === operatorUserId) alert("你想举报自己？");
      else {
        this.isLoding = true;
        this.$http
          .post("/api/user/complaint", {
            targetUserId,
            operatorUserId,
          })
          .then((res) => {
            if (res.data.code === 0) {
              alert(res.data.msg);
            } else {
              alert(res.data.msg);
            }
          })
          .catch((err) => {
            alert(err);
          })
          .finally(() => {
            this.isLoding = false;
          });
      }
    },
  },
  mounted() {
    //获取当前在线的人
    this.getOnline();

    //从localStorage获取学号
    this.userId = localStorage.getItem("userId") || "";

    //使用setInterval来周期性地计算当前的时间
    setInterval(() => {
      var time = new Date();
      var hours = time.getHours();
      var minutes = time.getHours();
      if (hours < 6 || (hours >= 23 && minutes >= 30)) {
        //如果早于早上六点，晚于晚上23:30则不在打工时间
        this.timeValid = false;
      }
    }, 1000);
  },
};
</script>

<style scoped>
th,
td {
  white-space: nowrap;
}
</style>