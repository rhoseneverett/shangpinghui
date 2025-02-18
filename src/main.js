import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import TypeNav from '@/components/TypeNav'
import store from '@/store'
import '@/mock/serve'
import 'swiper/css/swiper.css'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import * as API from '@/api'
import {Form, FormItem, Input, Button,Checkbox,MessageBox} from 'element-ui'
import VueLazyload from 'vue-lazyload'
import pic from "@/assets/images/1.gif"

Vue.component('TypeNav',TypeNav)
Vue.component('Carousel',Carousel)
Vue.component(Pagination.name,Pagination);
Vue.config.productionTip = false
Vue.prototype.$msgbox = MessageBox

Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.component(Checkbox.name, Checkbox);

Vue.use(VueLazyload, {
  loading: pic,
})

new Vue({
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  }, 
  router,
  store
}).$mount('#app')
