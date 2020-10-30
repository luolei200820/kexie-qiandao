<template>
  <div>
    <v-card
      max-width="1024"
      class="mx-auto"
    >
      <v-container fluid>
        <v-card-title>获取某个人所有的签到记录</v-card-title>
        <v-card-subtitle>佛系功能，没有做分页</v-card-subtitle>
        <v-simple-table
          fixed-header
          height="320px"
        >
          <template #default>
            <thead>
              <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>部门</th>
                <th>地点</th>
                <th>开始时间</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item,index) in tableData"
                :key="index"
              >
                <td>{{item.userId}}</td>
                <td>{{item.userName}}</td>
                <td>{{item.userDept}}</td>
                <td>{{item.userLocation}}</td>
                <td>{{item.start}}</td>
                <td>{{item.status}}</td>
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
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    let userId = this.$store.state.userId;
    if (userId === "") {
      alert("还没有签到");
      this.$router.redirect("/");
    } else {
      this.$http
        .get(`/api/record/${userId}`)
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data;
          } else {
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  },
};
</script>

<style scoped>
th,td{
    white-space: nowrap;
}
</style>