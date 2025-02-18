import {reqCode,reqRegister,reqLogin,reqUserInfo, reqLogout} from '@/api'

const state = {
  code:'',
  token:localStorage.getItem("Token"),
  userInfo:{}
}

const actions = {
  async getCode({commit},phone){
    let result = await reqCode(phone)
    console.log(result)
    if(result.code === 200){
      commit("GETCODE",result.data)
      return 'ok'
    }else{
      return Promise.reject(new Error('fail'))
    }
  },
  async register({commit},{phone,code,password }){
    let result = await reqRegister(phone,code,password)
    console.log(result)
    if(result.code === 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('fail'))
    }
  },
  async login({commit},{phone,password }){
    let result = await reqLogin(phone,password)
    console.log(result)
    if(result.code === 200){
      commit("GETTOKEN",result.data.token)
      localStorage.setItem("Token",result.data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('fail'))
    }
  },
  async getUser({commit}){
    let result = await reqUserInfo()
    console.log(result)
    if(result.code === 200){
      commit("GETUSER",result.data)
    }else{
      return Promise.reject(new Error('fail'))
    }
  },
  async logout({commit}){
    let result = await reqLogout()
    console.log(result)
    if(result.code === 200){
      commit("CLEAR")
    }else{
      return Promise.reject(new Error('fail'))
    }
  }
}

const mutations = {
  GETCODE(state,code){
    state.code = code
  },
  GETTOKEN(state,token){
    state.token = token
  },
  GETUSER(state,data){
    state.userInfo = data
  },
  CLEAR(state){
    state.userInfo = {}
    state.token = ''
    console.log("clear")
    localStorage.removeItem("Token")
  }
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}