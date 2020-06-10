var store = {
  state: {
    student: {
      id: '',
      name: '',
      isLogin: false,
    },
  },
  setLogin(val) {
    //console.log(`store set user ${val.id} login`)
    this.state.student.id = val.id
    this.state.student.name = val.name
    this.state.student.isLogin = true

    //set localStorage
    localStorage.setItem('id', val.id)
    localStorage.setItem('name', val.name)
    localStorage.setItem('isLogin', 'true')
  },
  setLogOut() {
    this.state.student.id = ''
    this.state.student.name = ''
    this.state.student.isLogin = false

    //remove localStorage name item
    localStorage.removeItem('name')
    //set localStorage logout
    localStorage.setItem('isLogin', 'false')
  },
}

export default store
