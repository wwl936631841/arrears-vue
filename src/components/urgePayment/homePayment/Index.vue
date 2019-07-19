<template>
  <div id="homePayment">
    <condition-search @orderByMoney="orderByMoney($event)" :iconRestore="iconRestore"
                      @orderByTimeSpan="orderByTimeSpan($event)"
                      @orderByStatus="orderByStatus($event)"
                      @queryBySearch="queryBySearch($event)" :statusType='1'>
    </condition-search>

    <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" loading-text="努力加载中..." pulling-text="下拉刷新">
        <van-cell v-for="(item,index) in list" :key="index">
          <item :itemObj="item" :adviceStatus='true' @click="toItemDetail(item.id)"></item>
        </van-cell>

        <empty :isEmptyShow="isEmpty"></empty>
      </van-pull-refresh>
    </van-list>

    <!--<item v-for="(item,index) in itemArr" :key="index" :itemObj="item" :adviceStatus='true' @click="toItemDetail(item.id)"></item>-->

  </div>
</template>

<script>
  import item from '../common/item'
  import conditionSearch from '../common/conditionSearch'
  import empty from '../common/empty'
  import axios from 'axios'
  import GetUrlParam from '@/utils/urlParse'
  import {mapState, mapMutations} from 'vuex'     //  订阅模式

  export default {
    name: "homePayment",
    data() {
      return {
        isEmpty: false,    // 接口数组长度做判断
        type: 3,   // 上门
        itemArr: [],
        list: [],  // 展示部分
        loading: false,
        finished: false,
        finishedText: '没有更多了',
        refreshLoading: false,
        iconRestore: false,
      }
    },
    computed: mapState([
      'conditionParam',    // 过滤参数

    ]),
    components: {
      item,
      conditionSearch,
      empty
    },
    methods: {
      defaultParam() {
        return {
          orderColumn: 'visit_suggest',   // 默认值
          orderType: 'DESC',
          ownId: this.conditionParam.ownId,
          pageNo: 1,
          pageSize: 10,
          // type: 3,  // 1:短信催缴,2:电话催缴,3:上门催缴
          houseId: this.conditionParam.houseId,
          customName: this.conditionParam.customName,
          status: '',

        }
      },

      onLoad() {
        this.getList()
      },

      defaultStatus() {

      },

      onRefresh() {
        // 加载第一次请求
        this.isEmpty = false
        this.list = []
        this.$store.commit('changeConditionParam', this.defaultParam())    //  初始化
        this.iconRestore = true
        this.getList(1)
      },

      isNum(num) {
        var reg = /^[1-9]\d*$|^0$/;
        if (reg.test(num) == true) {
          return true
        } else {
          return false
        }
      },
      orderByCondition(arr) {
        this.orderType = arr[0]
        this.orderColumn = arr[1]
      },


      // 默认排序字段   方法合并       约定好排序规则！　　然后做方法合并
      orderByMoney(arr) {
        this.isEmpty = false
        this.list = []
        this.getList()
      },

      orderByTimeSpan() {
        this.isEmpty = false
        this.list = []
        this.conditionParam.pageNo = 1
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.getList()
      },

      orderByStatus(val) {
        this.isEmpty = false
        this.list = []
        this.conditionParam.pageNo = 1
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.getList()
      },

      queryBySearch(val) {
        this.isEmpty = false
        this.list = []
        this.conditionParam.pageNo = 1
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.getList()
      },

      getList(type) {
        let that = this
        return axios.post(this.$envConfigObj.cuiJiaoPath + '/arrears/home/page', {
          ...that.conditionParam,
          type: that.type,
        }).then(function (res) {
          if (res.data.status == 0) {
            let totalCount = res.data.data.total
            that.loading = false;   // 加载状态结束
            that.itemArr = res.data.data.records  // 每次新的
            console.log(that.itemArr)
            that.list = [...that.list, ...that.itemArr]              //    数组pollfiy
            if (that.list.length == 0) {
              that.isEmpty = true
              that.finishedText = ''
            }
            // 刷新逻辑
            if (type == 1) {
              that.refreshLoading = false;
              that.$toast({
                message: '刷新成功',
                duration: 600,
              })
            }
            // 页码加1  下次从这里开始查
            that.conditionParam.pageNo++
            that.$store.commit('changeConditionParam', that.conditionParam)
            // 根据total做判断
            // 数据全部加载完成
            if (that.list.length >= totalCount) {
              that.finished = true;
            }
          }
        })
      },
      toItemDetail(id) {
        this.$router.push('arrearsDetail')  //  动态路径传递参数    add参数
      },
    }
  }
</script>

<style scoped lang="stylus">
  #homePayment{
    /*border: 1px solid #fff*/
    // padding-top .44rem;
    .van-list{
      // margin-top: .8rem
      height: 73vh;
      overflow: auto;
      padding-top .8rem;
      .van-cell{
        padding: 0
      }
    }
  }
</style>


