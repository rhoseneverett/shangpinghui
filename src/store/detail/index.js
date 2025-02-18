import { reqDetailList,reqAddOrUpdateShopCart } from '@/api';

const state = {
    detailList:{},
};
const mutations = {
    GETDETAILLIST: (state, detailList) => {
         state.detailList = detailList;
    }
}
const actions = {

    async getDetailList({ commit }, skuId) {
        let result = await reqDetailList(skuId);
        console.log(result)
        if (result.code == 200) {
            commit("GETDETAILLIST", result.data);
        }
    },
    
    async addShopCart({commit},{skuId,skuNum}){
        let result  = await reqAddOrUpdateShopCart(skuId,skuNum);
        if(result.code==200){
            return 'ok';
        }else{
            return Promise.reject(new Error('faile'));
        }
    }
};
const getters = {
    categoryView(state){
       return state.detailList.categoryView||{}
    },
    spuSaleAttrList(state){
       return state.detailList.spuSaleAttrList; 
    },
    //产品详情的数据的简化
    skuInfo(state){
      return state.detailList.skuInfo||{};
    }
};
export default {
    state,
    mutations,
    actions,
    getters
}