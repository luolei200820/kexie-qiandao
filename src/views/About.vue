<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>This is an about page</h1>
        <p v-if="student.isLogin">Welcome {{student.name}}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store/store.js";
export default {
  data() {
    return {
      student: store.state.student
    };
  }
};
</script>
