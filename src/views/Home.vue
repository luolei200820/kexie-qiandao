<template>
  <v-card max-width="1024" class="mx-auto">
    <v-container fluid>
      <v-alert v-if="!timeValid" type="warning">现在不是打工时间</v-alert>
      <v-form>
        <v-text-field v-model="userId" label="输入学号"></v-text-field>
        <v-btn class="mr-4" @click.stop="signIn">签到</v-btn>
        <v-btn class="mr-4">签退</v-btn>
        <v-dialog v-model="dialog" max-width="300">
          <v-card>
            <v-card-text>请稍等</v-card-text>
            <v-progress-linear indeterminate color="white"></v-progress-linear>
          </v-card>
        </v-dialog>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      timeValid: true,
      userId: "",
      dialog: false,
    };
  },
  methods: {
    signIn() {
      this.$http.post("/api/user/signIn", { userId:this.userId }).then((res) => {
        if (res.data.code === 0) {
          console.log("failure")
        }
      });
    },
  },
  mounted() {
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

<style>
</style>