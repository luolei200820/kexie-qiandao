<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p v-if="student.isLogin">Welcome {{student.name}}</p>
  </div>
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
