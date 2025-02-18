//axios进行二次封装
import axios from 'axios';
//进度条
import nprogress from 'nprogress';
// //因为进度条样式咱们没有引入
import "nprogress/nprogress.css";
// //引入Vuex仓库模块
import store from '@/store';

//创建axios实例[创建出来的实例即为axios，只不过可以配置一些东西]
let request = axios.create({
    //可以给请求路径中添加一些参数 
    // baseURL: "/api",
    baseURL: "http://gmall-h5-api.atguigu.cn/api",
    //设置请求时间（5S）
    timeout: 5000
});


//请求拦截器:在发请求之前可以检测到，可以干一些事情
request.interceptors.request.use((config) => {
    if(store.state.shopcart.userTempId){
        config.headers.userTempId = store.state.shopcart.userTempId;
    }
    // //用户身份token
    if(store.state.user.token){
      config.headers.token = store.state.user.token;
    }
    nprogress.start();
    return config;
});

//响应拦截器：服务器的数据已经返回了，可以干一些事情
request.interceptors.response.use((res) => {
    //简化服务器返回的数据格式
    //服务器数据返回进度条结束
    nprogress.done();
    return res.data;
}, (error) => {
    //终止promise链
    return Promise.reject(error);
});
//对外暴露二次封装的axios
export default request;