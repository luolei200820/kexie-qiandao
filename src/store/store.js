var store = {
  state: {
    student: {
      userId: 0,
      userName: ""
    },
    totalTime: "",
    week: "",
    accumulatedTime: "",
    isLogin: false,
    isLogout: false
  },
  mutations: {
    setLogin(state) {
      state.isLogin = true;
      state.isLogout = false;
    },
  }
};

export default store;
