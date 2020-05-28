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
          },
          {
            id: "18003012231",
            name: "罗磊",
            time: "11h",
            rank: 2
          },
          {
            id: "18003012232",
            name: "罗磊",
            time: "11h",
            rank: 3
          },
          {
            id: "18003012233",
            name: "罗磊",
            time: "11h",
            rank: 4
          },
          {
            id: "18003012234",
            name: "罗磊",
            time: "11h",
            rank: 5
          },
          {
            id: "18003012235",
            name: "罗磊",
            time: "11h",
            rank: 6
          },
          {
            id: "18003012236",
            name: "罗磊",
            time: "11h",
            rank: 7
          },
          {
            id: "18003012237",
            name: "罗磊",
            time: "11h",
            rank: 8
          }
        ]
      }
    };
  },
  beforeMount() {
    //get rankList
  }
};
</script>

<style>
</style>