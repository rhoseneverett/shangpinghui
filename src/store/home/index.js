import { reqCategoryList,reqBannerList,reqFloorList } from "@/api"

const state = {
  categoryList:[],
  bannerList:[],
  floorList:[],
}

const actions = {
  async categoryList(context){
    let result = await reqCategoryList()
    if(result.code ===200){
      context.commit('CATEGORYLIST',result.data)
    }
  },
  async getBannerList(context){
    let result = await reqBannerList()
    if(result.code ===200){
      context.commit('BANNERLIST',result.data)
    }
  },
  async getFloorList(context){
    let result = await reqFloorList()
    if(result.code ===200){
      context.commit('FLOORLIST',result.data)
    }
  },
}

const mutations ={
  CATEGORYLIST(state,categorylist){
    state.categoryList = categorylist
  },
  BANNERLIST(state,bannerList){
    state.bannerList = bannerList
  },
  FLOORLIST(state,floorList){
    state.floorList = floorList
  },
}

const getters = {}


export default {
  state,
  mutations,
  actions,
  getters
}