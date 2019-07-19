<template>
  <div id="auditTaskList">
    <!--<h1>auditTaskList</h1>-->
    <van-nav-bar title="稽查任务" right-text="稽查记录" left-arrow @click-left="onClickLeft"
                 @click-right="onClickRight"></van-nav-bar>
    <div>

    </div>
    <!--<van-tabs v-model="active" swipeable @change="getAuditTaskListByType">-->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="(item,index) in typeList" :title="item" :key="index">
        <div class="list">
          <div style=" margin: .4rem 1rem;" v-if="companyName != ''">
            <panelHead :title="companyName" date="" :is-building="true"></panelHead>
          </div>
          <div class="item" v-for="(item,idx) in taskList" :key="idx">
            <van-panel>
              <panel-head :title="item.communityName" :is-position="true" :date="item.applyTime"></panel-head>
              <div class="border"></div>
              <ul>
                <!-- 金额异常显示 -->
                <li v-if="item.exAmount != 0">
                  <span style="font-size:14px;color:#666666">免费放行金额</span>
                  <span style="color:#313131;font-size:14px;font-weight:500;">￥{{item.exAmount}}元</span>
                </li>
                <!-- 次数异常显示 -->
                <li v-if="item.exNum != 0">
                  <span style="font-size:14px;color:#666666">异常放行次数</span>
                  <span style="color:#313131;font-size:14px;font-weight:500;">{{item.exNum}}次</span>
                </li>
              </ul>
              <div slot="footer" class="footer">
                <h4>{{item.exTypeDes}}</h4>
                <van-button plain type="info" size="small" @click="auditing(item.taskDetailId)">去稽查
                </van-button>
              </div>
            </van-panel>
          </div>

          <!-- 显示空白页面  -->
          <div v-if="isEmptyShow" style="margin-top: 30px; text-align: center">
            <img src="../../assets/img/audit/empty@2x.png" alt="" width="128" height="119"/>
          </div>

        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import panelHead from './panelHead'
  // import {auditTaskList} from "@/api/audit";
  import GetUrlParam from '@/utils/urlParse'
  import {referUrl} from '../../api/env'
  import {Toast} from 'vant'
  import axios from 'axios'

  export default {
    name: "auditTaskList",
    // 审计记录
    data() {
      return {
        // typeList: ['车辆'],
        typeList: ['车辆', '', '', '', ''],
        auditId: 0,
        active: 0,
        taskList: [],
        communityId: '',    //  用于页面传递参数
        companyName: '',   // 公司名
        companyId: '',  // 公司id
        ownerId: '',   // 用户id
        isEmptyShow: false,
      }
    },
    components: {
      panelHead
    },
    props: {},
    computed: {},
    methods: {

      /**
       *    初始化参数  url取参数
       *    如果url不存在参数：从localStorage中取
       */
      initParam() {
        this.companyId = GetUrlParam('company_id')      // 公司id
        this.owerId = GetUrlParam('userId')            // 审计员id
        this.communityId = GetUrlParam('village_id')     //  项目id
        // console.info('=== auditTaskList page ===')
        console.info('companyId', this.companyId)
        console.info('owerId', this.owerId)
        console.info('communityId', this.communityId)
        localStorage.setItem('userId', this.owerId)    // 存
        localStorage.setItem('companyId', this.companyId)    // 存
        localStorage.setItem('communityId', this.communityId)    // 存
        localStorage.setItem('username', decodeURIComponent(GetUrlParam('username')))    // 存    审计
        console.info('local storage:: begin')
        console.info(localStorage.getItem('userId'))
        console.info(localStorage.getItem('companyId'))
        console.info(localStorage.getItem('communityId'))
        console.info('local storage:: end ')
        // console.info('===  auditTaskList page ===')
      },
      /**
       *  获取审计任务列表
       */
      getAuditTaskList() {
        let that = this
        axios.get(this.$envConfigObj.auditPath + `/audit/car/queryPersonTaskList?companyId=${this.companyId}&ownerId=${this.owerId}&communityId=${this.communityId}&pageNo=1&pageSize=10`).then(function (res) {
        // auditTaskList(params).then((res) => {
          console.log('arr',res)
          let arr = res.data.data.records
          if (arr.length > 0) {
            that.taskList = arr
            that.isEmptyShow = arr.length == 0
            for (let i = 0; i < arr.length; i++) {
              let exNum = arr[i].freeNums + arr[i].handlerNums
              arr[i].exNum = exNum
            }
            console.log('communityId -->', that.communityId)

            // if (that.taskList[0]) {
            //   that.communityId = that.taskList[0].communityId
            //   // 公司名
            //   that.companyName = that.taskList[0].companyName
            // } else {
            //   that.communityId = ''
            // }
          }else{
            that.isEmptyShow = true
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      /**
       *  多tab情况     接口这块要改的，应该支持type传递！ 不然你这里也没法弄
       */
      getAuditTaskListByType(index) {
        // ////alert('change')
        // ////alert(index)
        //  当前是车辆   以后是按照类型去发起请求
      },
      /**
       *   返回
       *   1.返回原生
       *   2.返回圭贤
       */
      onClickLeft() {
        let url = location.href
        // localStorage.setItem('auditTaskList href', url)
        location.href = 'zjh://close'
      },
      /**
       *  跳转稽查记录    http://webapp.test.zanjiahao.com/fee/reminder/feeMission?userId=102252&uptownId=73
       */
      onClickRight() {
        // alert(this.communityId)
        // this.$router.push({
        //     path: `auditRecordList/${this.communityId}`
        // })
        this.$buryPoint('audit-records')
        if (!this.communityId) {
          // alert('this.communityId为空')
          this.communityId = 0               //  真实环境中：这个字段一定是可以取到的！　所以
        }
        localStorage.setItem('auditTaskListURL',location.href)
        this.$router.push({path: `/auditRecordList`})      // 这里改一下吧！
        // this.$router.push(`auditRecordList/1`)  OK
      },
      /**
       *
       * @param taskId
       */
      auditing(taskId) {
        // this.$router.push('auditing')//   路由传递参数
        this.$router.push({path: `/auditing/${taskId}`})   // -> /auditing/123
      }
    },
    created() {
      console.warn('cur page: ',location.href)
      this.initParam()   // 初始化参数
      this.getAuditTaskList()   // 查询list
      localStorage.removeItem('auditTaskListURL')
    },
    mounted() {
    },
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/mixin.styl"
  #auditTaskList
    background-color: #F5F5F5
    height: 100vh

    .van-nav-bar__title
      color:#333333
      font-size:17px
      font-weight:500;
    .van-nav-bar__left
      .van-nav-bar__arrow
        font-size: 24px;
        color: #333333;
        font-weight: 600;
      .van-nav-bar__text
        font-size: 15px
        color:#268AED

    h2
      text-align: left
      display: flex
      align-items: center

      .icon
        display: inline-block
        /*border: 1px solid red*/
        width: 24px
        height: 24px
        margin-right: 5px;

    .list
      .van-panel
        /*border: 1px solid deeppink*/
        margin: .04rem .1rem;

        .van-panel__header {
          display: none
        }

      .border
        border-1px(#F5F5F5)

      ul
        li
          display: flex
          justify-content space-between
          line-height: 35px;
          padding: 0 15px;

      .footer
        display: flex
        align-items: center
        justify-content: space-between
        .van-button__text
          font-size:.14rem

        h4
          margin: .1rem 0
          color:#F55023
          font-size:.14rem


</style>
<style lang="stylus">
  .van-tabs
    .van-tabs__nav--line
      .van-tabs__line
        background-color: #268AED
  .van-tab--active
    font-weight: 500
    color: #268AED
    font-size: 15px
  .van-nav-bar__text
    color: #268AED
</style>
