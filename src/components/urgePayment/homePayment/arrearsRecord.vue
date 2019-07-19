<template>
  <div id="arrearsRecord">
    <van-nav-bar
          class="navBarTitle"
          :title="title"
          left-text=""
          right-text=""
          left-arrow
          @click-left="onClickLeft"
      />
    <div>
      <ul class="header">
        <li>时间</li>
        <li>执行方案</li>
        <li>结果</li>
      </ul>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loading-text pulling-text="下拉刷新">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text='finishedText'
          @load="onLoad">
          <ul class="record" v-for="(item,index) in list" :key="index">
            <li class="left">{{ item.executeTime }}</li>
            <li class="center">{{ item.type }}</li>
            <li class="right" @click="toFeedBackDetail(item)">{{ item.result }}
              <van-icon name="arrow"/>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
    </div>
    <empty :isEmptyShow="isEmpty"></empty>
  </div>
</template>

<script>
  import empty from '../common/empty'
  import axios from 'axios'
  // import {cuiJiaoPath} from "../../../api/env";

  export default {
    name: "arrearsRecord",
    data() {
      return {
        loading: false,
        finished: false,
        isLoading: false,  // 下拉刷新
        title: '催缴记录',
        finishedText: '',
        list: [], //
        arrearsRecordList: [],
        isEmpty: false,
        taskId: '',
        houseId:'',
        pageNo: 1,
        pageSize: 10,
      }
    },
    components: {
      empty
    },
    methods: {
      onRefresh() {
        this.list = []
        this.pageNo = 1
        this.getRecordList(1)
      },

      onLoad() {
        this.getRecordList()
      },

      getRecordList(flag) {
        let that = this
        axios.get(`${ this.$envConfigObj.cuiJiaoPath}/arrears/home/queryFeedbackRecord?houseId=${this.houseId}&pageNo=${this.pageNo}&pageSize=${this.pageSize}`).then(res => {
          if (res.data.status == 0) {
            if(flag == 1){
              that.$toast({
                message:'刷新成功',
                duration: 600,
              })
              that.isLoading = false
            }
            // 加载状态结束
            that.loading = false
            that.arrearsRecordList = res.data.data.records
            that.list = [...that.list, ...that.arrearsRecordList]
            that.pageNo++
            if (that.list.length >= res.data.data.total) {
              that.finished = true;
              if (that.list.length > 13) that.finishedText = '没有更多了'
            }
            if (that.list.length == 0) that.isEmpty = true
          }
        }).catch(err => {
          console.log(err)
        })
      },

      toFeedBackDetail(obj) {
        console.log('obj', obj)
        this.$router.push({
          name: 'recordDetail',
          params: {
            obj,
            houseId:this.houseId
          }
        })
      },

      onClickLeft(){
        this.$router.go(-2)
      }
    },
    created() {
      console.log(this.$route.params)
      this.taskId = this.$route.params.taskId
      this.houseId = this.$route.params.houseId
    }
  }
</script>

<style scoped lang="stylus">
  #arrearsRecord
    .header
      display: flex
      height .44rem
      background-color #fff
      border 1px solid #EBEBEB

      li
        flex: 1
        text-align center
        line-height .44rem
        color: #444
        font-size: .14rem
        font-weight 600

    .record
      display flex
      align-items center
      font-size .14rem;
      color #444
      border-bottom 1px solid #ebebeb

      .left, .center, .right
        flex: 1
        text-align center
        padding .1rem 0
        font-weight 400


      .right
        text-align: right
        cursor: pointer
        padding-right .27rem
        font-family: PingFangSC-Medium;
        font-weight 600
        color: rgba(68, 68, 68, 1)

        i
          position: relative
          top: .025rem
          left: .1rem
          color: rgba(187, 187, 187, 1)
          font-weight: 600

    .noRecord
      display flex
      flex-direction column
      align-items: center;

      img
        width 2.05rem;
        height 1.5rem;
        padding: .2rem 0 .23rem 0;

      span
        font-size .13rem;
        color #999
        line-height .18rem
</style>
<style lang="stylus" scoped>
#v-nav-bar{
    position: relative !important;
    background-color: #F5F5F5
    height: .44rem;
    width:100%;
    .navBarTitle{
        height .44rem;
        line-height .44rem
        position fixed;
        top auto
        .van-nav-bar__left{
            padding-left .15rem
            left 0
            .van-icon-arrow-left{
                font-size .20rem
                color #333
                font-weight 600
            }
        }
        .van-nav-bar__title{
            font-size .18rem
            color #333
            font-weight 600
        }
        .van-nav-bar__right{
            font-size .15rem
            color #268AED
        }
    }
}
</style>

