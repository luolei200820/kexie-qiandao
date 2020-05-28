<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table
          caption="排名"
          :headers="rankList.headers"
          :items="rankList.items"
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
            text: "学号",
            align: "left",
            sortable: false,
            value: "id"
          },
          {
            text: "姓名",
            align: "left",
            sortable: false,
            value: "name"
          },
          {
            text: "当前时长",
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
  beforeMount(){
      //get rankList
  }
};
</script>

<style>
</style>