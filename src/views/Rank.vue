<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table
          caption="排名"
          :headers="rankList.headers"
          :items="rankList.items"
          item-key="userid"
          hide-default-footer
          mobile-breakpoint="0"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      rankList: {
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
            value: 'username'
          },
          {
            text: '部门',
            align: 'left',
            sortable: true,
            value: 'dept',
            width: '100px'
          },
          {
            text: '地点',
            align: 'left',
            sortable: false,
            value: 'location'
          },
          {
            text: '总时长',
            align: 'center',
            sortable: false,
            value: 'allTime'
          },
          {
            text: '排名',
            align: 'center',
            sortable: false,
            value: 'index'
          }
        ],
        items: []
      }
    }
  },
  beforeMount() {
    //get rankList
    this.$http
      .get('/TopFive')
      .then(res => {
        this.rankList.items = res.data.list
        this.rankList.items.forEach((item, index) => {
          item.index = index + 1
        })
      })
      .catch(err => {
        throw err
      })
  }
}
</script>

<style>
</style>