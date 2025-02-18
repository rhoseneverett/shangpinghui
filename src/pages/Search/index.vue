<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-show="searchParams.categoryName">
              {{ searchParams.categoryName }}<i @click="clearName">×</i>
            </li>
            <!-- 用户搜索关键字的按钮 -->
            <li class="with-x" v-show="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="clearKeyword">×</i>
            </li>
            <li class="with-x" v-show="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1] }}
              <i @click="clearTradeMark">×</i>
            </li>
            <li
              class="with-x"
              v-for="(prop, index) in searchParams.props"
              :key="index"
            >
              {{ prop.split(":")[1] }}
              <i @click="clearProp(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector
          @getTradeMarkInfo="getTradeMarkInfo"
          @getAttrInfo="getAttrInfo"
        />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{active:isComprehensive}">
                  <a @click="changeOrder(1)">{{compre}}</a>
                </li>
                <li :class="{active:isPrice}">
                  <a @click="changeOrder(2)">{{price}}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`detail/${good.id}`"
                      ><img v-lazy="good.defaultImg"
                    /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <Pagination :total="total" :pageSize="searchParams.pageSize" :pageNo="searchParams.pageNo" :continues="5" @currentPage="currentPage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapGetters } from "vuex";
import {mapState} from 'vuex';

export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    //响应式数据
    return {
      //收集需要带给服务器参数，参数可变化的，响应式的
      //携带给服务器参数
      searchParams: {
        category1Id: "", //一级分类的id
        category2Id: "", //二级分类的id
        category3Id: "", //三级分类的id
        categoryName: "", //产品的名字
        keyword: "", //关键字
        props: [], //平台属性的选择参数
        trademark: "", //品牌参数
        //上面这七个参数：有用户选择决定的，因此初始值为空的
        //下面这三个：都有初始值
        order: "1:desc", //携带给服务器参数order--->初始值"1:desc"[综合降序]
        pageNo: 1,
        // pageNo:parseInt(localStorage.getItem('pageNo'))||1, //获取第几页的数据，默认即为第一个的数据
        pageSize: 3, //每一页需要展示多少条数据
      },
      compre: '综合⬇',
      price:'价格'
    };
  },
  beforeMount() {
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  mounted() {
    this.getSearchList();
  },
  computed: {
    ...mapGetters(["goodsList"]),
    isComprehensive(){
      return this.searchParams.order.includes(1)
    },
    isPrice(){
      return this.searchParams.order.includes(2)
    },
    ...mapState({
       total:state=>state.search.searchList.total
    })
  },
  methods: {
    getSearchList() {
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    clearName() {
      this.searchParams.categoryName = "";
      if (this.$route.params) {
        this.$router.push({ name: "search", params: this.$route.params });
      }
    },
    clearKeyword() {
      this.searchParams.keyword = "";
      if (this.$route.query) {
        this.$router.push({ name: "search", query: this.$route.query });
      }
      this.$bus.$emit("changeKeyword");
    },
    getTradeMarkInfo(trademark) {
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      //在发请求
      this.getSearchList();
    },
    clearTradeMark() {
      this.searchParams.trademark = "";
      this.getSearchList();
    },
    getAttrInfo(attr, attrValue) {
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      if (this.searchParams.props.indexOf(prop) == -1) {
        this.searchParams.props.push(prop);
        this.getSearchList();
      }
    },
    clearProp(index) {
      this.searchParams.props.splice(index, 1);
      this.getSearchList();
    },
    changeOrder(type){
      if(type==1){
        this.price = '价格'
        if (this.compre.includes('⬇')) {
          this.compre = '综合⬆';
          this.searchParams.order = '1:asc'
        } else {
          this.compre = '综合⬇';
          this.searchParams.order = '1:desc'
        }
      }else{
        this.compre = '综合'
        if (this.price.includes('⬇')) {
          // 如果包含 ⬇，则替换为 ⬆
          this.price = '价格⬆'
          this.searchParams.order = '2:asc'
        } else {
          // 如果不包含 ⬇，则添加 ⬇
          this.price = '价格⬇'
          this.searchParams.order = '2:desc'
        }
      }
      this.getSearchList();
    },
    currentPage(pageNo){
       this.searchParams.pageNo = pageNo;
       //本次存储持久化
      //  localStorage.setItem('pageNo',pageNo);
       //再次发请求
       this.getSearchList();
    }
  },
  watch: {
    $route() {
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      this.getSearchList();
      //如果下一次搜索时只有params参数，拷贝后会发现searchParams会保留上一次的query参数
      //所以每次请求结束后将相应参数制空
      this.searchParams.category1Id = "";
      this.searchParams.category2Id = "";
      this.searchParams.category3Id = "";
      this.$route.params.keyword = "";
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>