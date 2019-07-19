<template>
  <div id="paymentIndex">
    <van-nav-bar
      title="催缴记录"
      left-arrow
      @click-left="onClickLeft">
    </van-nav-bar>
    <ul class="header">
      <li>项目名称</li>
      <li>启动时间</li>
      <li>报告</li>
    </ul>
    <main>
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" loading-text pulling-text="下拉刷新">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <van-cell v-for="(item,index) in list" :key="index">
                    <ul class="content">
                        <li>
                            <span style="">{{item.uptownName}}</span>
                            <span>{{item.createTime.substring(0,10)}}</span>
                            <span>
                                <a @click="toPaymentReport(item.uptownId,item.processMonth)">查看</a>
                            </span>
                        </li>
                    </ul>
                </van-cell>
            </van-list>
        </van-pull-refresh>
      <!-- 显示空白页面  -->
      <div v-if="isEmptyShow" style="margin-top:30px;text-align: center">
        <img src="../../assets/img/audit/empty@2x.png" alt="" width="128" height="119"/>
      </div>
    </main>
  </div>
</template>

<script>
  import axios from 'axios'
  import GetUrlParam from '@/utils/urlParse'

  export default {
    name: "paymentIndex",   //  催缴记录页
    data() {
      return {
        active: '0',
        objArr: [],
        uptownId: '',
        processMonth: '',
        isEmptyShow: false,
        pageNo:1,
        pageSize:5,

        // 下拉刷新
        list:[],
        loading: false,
        finished: false,
        finishedText: '没有更多了',
        refreshLoading: false,
      }
    },
    methods: {
      onLoad() {
          this.getPaymentList()
      },

      onRefresh() {
          // 加载第一次请求
          this.list = []
          this.pageNo = 1
          // this.pageNo++
          this.getPaymentList(1)
      },

      /**
       *    初始化参数  url取参数   保存参数（每次都要执行这个逻辑）
       */
      initParam() {
        localStorage.setItem('userId', this.owerId)
        localStorage.setItem('companyId', this.companyId)
        localStorage.setItem('uptownId', this.uptownId)
      },

      onClickLeft() {
        let url = location.href
        localStorage.setItem('paymentIndex href', url)
        if (url.indexOf('fromPhone') != -1) {
          location.href = 'zjh://close'
        } else {
          let searchStr = `?company_id=${localStorage.getItem('companyId')}&userId=${localStorage.getItem('userId')}&village_id=${localStorage.getItem('uptownId')}`
          location.href = this.$envConfigObj.referUrl + searchStr
        }
      },

      /**
       *   详情
       */
      toPaymentReport(uptownId, processMonth) {
        this.$buryPoint('look-over')
        this.$router.push(
          {
            name: 'paymentReport',
            query: {
              month: processMonth,
              uptownId: uptownId,
              userId:localStorage.getItem('userId')
            }
          }
        )

      },
      
      /**
       *  催缴列表
       */
      getPaymentList(type) {
        let that = this
        axios.get( this.$envConfigObj.cuiJiaoPath + `/arrears/queryProcessList?uptownId=${localStorage.getItem('uptownId')}&pageNo=${this.pageNo}&pageSize=${this.pageSize}`, {
        }).then(function (res) {
          if (res.data.status == 0) {
              let totalCount = res.data.data.total
              console.log(res.data.data)
              that.loading = false;   // 加载状态结束
              that.objArr = res.data.data.records
              that.list = [...that.list, ...that.objArr]              //    数组pollfiy
              if (that.list.length == 0){
                  that.isEmptyShow = true
                  that.finishedText = ''
              }
              // 刷新逻辑
              if (type === 1) {
                  that.refreshLoading = false;
              }

              // 页码加1  下次从这里开始查
              if (that.list.length < totalCount){

                  that.pageNo++
                  that.finished = false;
              }
              // 根据total做判断
              // 数据全部加载完成
              if (that.list.length >= totalCount) {
                  that.finished = true;
              }
          }else{
            that.isEmptyShow = true　　// error
          }

        }).catch(function (error) {
          console.log(error);
        });
      }
    },

    created() {
      this.companyId = GetUrlParam('company_id')
      this.owerId = GetUrlParam('userId')
      this.uptownId = GetUrlParam('village_id')
      console.warn('cur page: ', location.href)
      console.log(' ==== paymentIndex begin ======')
      console.log('href', location.href)
      this.initParam()
      // this.getPaymentList()
    }
  }
</script>

<style scoped lang="stylus">
#paymentIndex{
  main{
    height: 84vh;
    overflow: auto;
  }
}

  #paymentIndex
    height: 100%;
    background-color: #F5F5F5

    .van-nav-bar__left
      .van-nav-bar__arrow
        font-size: 24px;
        color: #333333;
        font-weight: 600;

    .van-nav-bar__title
      color: #333333
      font-size: 17px
      font-weight: 500

    .header
      display: flex
      padding: 10px 15px
      background-color: #F3F8FD
      text-align:center

      li
        width: 33vw
        color: #666666
        font-size: 13px

    /*border: 1px solid blue*/

    .content
      background: #fff
      text-align:center

      li
        display: flex
        align-items: center
        padding: 10px 15px
        line-height: 40px
        // border-bottom: 1px solid #F3F8FD
        font-size: 14px
        color: #444444

        span
          width: 33vw
          /*border: 1px solid red*/

          a
            color: #268AED

</style>
