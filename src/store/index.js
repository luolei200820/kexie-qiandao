import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: 0,
    userName: "",
    totalTime: "",
    week: "",
    accumulatedTime: "",
    isLogin: false,
    isLogout: false
  },
  mutations: {
    setLogin(state, loginInfo) {
      state.userId = loginInfo.userId;
      state.userName = loginInfo.userName;
      state.totalTime = loginInfo.totalTime;
      state.week = loginInfo.week;
      state.isLogin = true;
      state.isLogout = false;
    },
    setLogout(state, logoutInfo) {
      state.userId = logoutInfo.userId;
      state.userName = logoutInfo.userName;
      state.totalTime = logoutInfo.totalTime;
      state.accumulatedTime = logoutInfo.accumulatedTime;
      state.week = logoutInfo.week;
      state.isLogin = false;
      state.isLogout = true;
    }
  },
  actions: {
  },
  modules: {
  }
});
