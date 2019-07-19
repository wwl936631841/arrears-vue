<template>
  <div id="auditReport">
    <van-nav-bar
      title="稽查报告"
      left-arrow
      @click-left="onClickLeft">
    </van-nav-bar>
    <van-list finished-text="没有更多了">
      <panel-head date="" :is-position="true" :title="auditObj.communityName"></panel-head>
      <van-cell :key="0" title="审核时间">
        <span>{{auditObj.auditTime.substring(0,10)}}</span>
      </van-cell>
      <van-cell :key="0" title="审核人">
        <span>{{auditObj.examiner}}</span>
      </van-cell>
      <van-cell :key="0" title="审核意见">
        <span v-if="isAgree">同意</span>
        <span v-if="!isAgree">驳回</span>
      </van-cell>
    </van-list>
    <ul>
      <h4>{{auditObj.exTypeDes}}</h4>
      <li v-if="iconShow">
        <span>{{auditObj.applyTime.substring(0,4)}}/{{auditObj.applyTime.substring(4)}}</span>
        <span v-if="auditObj.exAmount != 0">免费放行金额{{auditObj.exAmount}}元,</span>
        <span v-if="auditObj.freeNums != 0">免费放行{{auditObj.freeNums}}次，</span>
        <span v-if="auditObj.involvedNums != 0">涉及车辆{{auditObj.involvedNums}}辆</span>
      </li>
      <li v-if="auditObj.handerNums !=0">
        <span>{{auditObj.applyTime.substring(0,4)}}/{{auditObj.applyTime.substring(4)}}</span>
        <span v-if="auditObj.handerNums !=0">手动开闸{{auditObj.handerNums}}次</span>
      </li>
    </ul>
    <div class="footer" v-if="isAgree">
      <h4>审核结果</h4>
      <p>{{auditObj.auditOpinion}}</p>
    </div>
    <div class="footer" v-if="!isAgree">
      <h4>驳回原因</h4>
      <p>{{auditObj.auditOpinion}}</p>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import panelHead from './panelHead'
  // import {auditPath} from '../../api/env'

  export default {
    name: "auditReport",   // 稽查报告
    data() {
      return {
        loading: false,
        finished: true,
        isAgree: true,
        auditObj: {},
        iconShow: false,  //
      }
    },
    components: {
      panelHead
    },
    methods: {
      getAuditReportDetail() {
        let params = this.$route.params.id
        let that = this
        axios.get(this.$envConfigObj.auditPath + `/audit/car/queryDetail/${params}`).then(function (res) {
          // debugger   错误处理啊
          let obj = res.data.data
          that.auditObj = obj
          that.isAgree = that.auditObj.auditStatus
          that.iconShow = obj.exAmount !=0 || obj.freeNums != 0 || obj.involvedNums != 0
        }).catch(function (error) {
          console.log(error);
        });
      },
      onClickLeft() {
        this.$router.push('/auditRecordList')
      }
    },
    created() {
      console.warn('cur page: ', location.href)
      this.getAuditReportDetail()
    },
    mounted() {

    },

  }
</script>

<style scoped lang="stylus">
  #auditReport
    .van-cell__title, .van-cell__value
      text-align: left

    .van-nav-bar__left
      .van-nav-bar__arrow
        font-size: 24px;
        color: #333333;
        font-weight: 600;
    .van-nav-bar__title
      color: #333333
      font-size: 17px
      font-weight: 500
    ul
      list-style-type: none /*  无效 */
      border-bottom: 10px solid #F5F5F5
      padding-bottom: 20px

      h4
        color: #F55023
        text-align: left
        padding-left: 15px
        font-size: 14px

      li
        margin-left: 16px
        margin-top: 15px
        text-align: justify
        line-height: 22px

        span:nth-child(1)
          color: #666666

        span:nth-child(2)
          margin-left: 10px

        span:nth-child(4)
          margin-left: 74px

        span
          font-size: 14px
      li:

      :before
        display: inline-block
        content: "●"
        color: #A9D4FF;
        font-size: 12px
        position: relative
        top: -3px
        right: 5px

        span
          text-align: left


        span:last-child
          margin-left: 20px;

    .footer
      h4
        text-align: left
        font-size: 14px
        padding: 0 0 15px 15px;
        border-bottom: 1px solid #F5F5F5

      p
        text-align: left
        padding-left: 15px
        line-height: 30px;
        font-size: 14px

  .van-list
    div:nth-child(4)
      border-bottom: 1px solid #F5F5F5

  .van-list
    .van-cell__title
      color: #313131
      font-size: 14px
      flex: 1
      font-weight:600

    .van-cell__value
      color: #313131
      font-size: 14px
      flex: 2
      text-align: left

</style>
