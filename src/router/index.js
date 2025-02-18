import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from "@/pages/Trade"
import Pay from "@/pages/Pay"
import PaySuccess from "@/pages/PaySuccess"
import Center from "@/pages/Center"
import myOrder from "@/pages/Center/myOrder"
import groupOrder from "@/pages/Center/groupOrder"

import store from '@/store'

Vue.use(VueRouter)

let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(this, location, () => { }, () => { });
  }
}

//重写VueRouter.prototype.replace方法
VueRouter.prototype.replace = function (location, resolve, reject) {
  (resolve && reject) ? originReplace.call(this, location, resolve, reject) : originReplace.call(this, location, () => { }, () => { });
}

let router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: () => import('@/pages/Home'),
      meta: { show: true }
    },
    {
      path: '/detail/:skuId',
      component: () => import('@/pages/Detail'),
      meta: { show: true }
    },
    {
      path: '/shopcart',
      component: () => import('@/pages/ShopCart'),
      meta: { show: true }
    },
    {
      path: '/pay',
      component: () => import('@/pages/Pay'),
      meta: { show: true },
      beforeEnter: (to, from, next) => {
        if (from.path == '/trade') {
          next();
        } else {
          next(false);
        }
      }
    },
    {
      path: '/paySuccess',
      component: () => import('@/pages/PaySuccess'),
      meta: { show: true }
    },
    {
      path: '/center',
      component: () => import('@/pages/Center'),
      meta: { show: true },
      children: [
        {
          path: 'myOrder',
          component: () => import('@/pages/Center/myOrder'),
        },
        {
          path: 'groupOrder',
          component: () => import('@/pages/Center/groupOrder')
        },
      ]
    },
    {
      path: '/trade',
      component: () => import('@/pages/Trade'),
      meta: { show: true },
      beforeEnter: (to, from, next) => {
        if (from.path == "/shopcart") {
          next()
        } else {
          next(false);
        }
      }
    },
    {
      path: '/addcartsuccess',
      component: () => import('@/pages/AddCartSuccess'),
      meta: { show: true },
      name: "addcartsuccess"
    },
    {
      path: '/search/:keyword?',
      component: () => import('@/pages/Search'),
      meta: { show: true },
      name: 'search'
    },
    {
      path: '/login',
      component: () => import('@/pages/Login'),
      meta: { show: false }
    },
    {
      path: '/register',
      component: () => import('@/pages/Register'),
      meta: { show: false }
    },
    {
      path: '/', // 当访问根路径时
      redirect: '/home' // 重定向到 /home
    }
  ],
  scrollBehavior() {
    return { y: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  let token = store.state.user.token
  console.log(token)
  let name = store.state.user.userInfo.name
  if (token) {
    if (to.path == '/login') {
      next('/home')
    } else {
      if (name) {
        next()
      } else {
        try {
          await store.dispatch('getUser')
          next();
        } catch (error) {
          await store.dispatch('logout');
          next('/login')
        }
      }
    }
  } else {
    if (to.path.includes('trade') || to.path.includes('pay') || to.path.includes('center')) {
      next('/login?redirect=' + to.path);
    } else {
      next();
    }
  }
})


export default router