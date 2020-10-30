<template>
  <div>
    <v-card max-width="1024" class="mx-auto">
      <v-container fluid>
        <v-card-title>有效排行榜前五</v-card-title>
        <v-card-subtitle>指如果前五有不是20级的成员，在多加一位直到是20级为止（最多展示10个人）</v-card-subtitle>
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
                <th>总时长</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in tableData"
                :key="item.userId"
              >
                <td>{{item.userId}}</td>
                <td>{{item.userName}}</td>
                <td>{{item.userDept}}</td>
                <td>{{item.userLocation}}</td>
                <td>{{item.totalTime}}</td>
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
    this.$http
      .get("/api/record/topFive")
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
  },
};
</script>

<style scoped>
th,
td {
  white-space: nowrap;
}
</style>