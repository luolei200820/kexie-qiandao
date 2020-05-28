var store = {
    state: {
        student: {
            id: "",
            name: "",
            isLogin: false
        }
    },
    setLogin(val) {
        //console.log(`store set user ${val.id} login`)
        this.state.student.id = val.id
        this.state.student.name = val.name
        this.state.student.isLogin = true
    },
    setLogOut() {
        this.state.student.id = ""
        this.state.student.name = ""
        this.state.student.isLogin = false
    }
}

export default store