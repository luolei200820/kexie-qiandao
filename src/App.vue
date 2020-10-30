<template>
  <v-app>
    <v-app-bar
      app
      dark
      color="blue lighten-3"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-icon>{{ mdiMenu }}</v-icon>
      </v-app-bar-nav-icon>
      <v-avatar class="mr-4">
        <img
          :src="require('@/assets/logo.jpg')"
          alt="kexie-logo"
        />
      </v-avatar>
      <span class="text-h5">科协签到</span>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
    >
      <v-list>
        <v-list-item
          v-for="item in nav"
          :key="item.link"
          :to="item.link"
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mdiMenu } from "@mdi/js";
export default {
  data: () => ({
    mdiMenu,
    drawer: false,
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "排名",
        link: "/rank",
      },
      {
        text: "记录",
        link: "/record",
      },
      {
        text: "关于",
        link: "/about",
      },
    ],
  }),
  mounted() {
    //从localStorage读取登录状态
    if (localStorage.getItem("isLogin") === "true") {
      this.$store.commit("setLogin", {
        userId: localStorage.getItem("userId"),
        userName: localStorage.getItem("userName"),
        totalTime: localStorage.getItem("totalTime"),
        week: localStorage.getItem("week"),
      });
    }
  },
};
</script>
