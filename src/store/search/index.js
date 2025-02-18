import { reqGetSearchInfo } from "@/api"

const state = {
  searchList: {}
}

const actions = {
  async getSearchList(context, params = {}) {
    let result = await reqGetSearchInfo(params)
    console.log(result)
    if (result.code == 200) {
      context.commit("GETSEARCHLIST", result.data);
    }
  }
}

const mutations = {
  GETSEARCHLIST(state, searchList) {
    state.searchList = searchList;
  }
}

const getters = {
  goodsList(state) {
    return state.searchList.goodsList || [];
  },
  tradeMarkList(state){
    return state.searchList.trademarkList;
  },
  attrsList(){
      return state.searchList.attrsList;
  }
}


export default {
  state,
  mutations,
  actions,
  getters
}