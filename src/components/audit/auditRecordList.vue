<template>
  <div id="auditRecordList">
    <van-nav-bar
      title="稽查记录"
      left-arrow
      @click-left="onClickLeft">
    </van-nav-bar>

    <van-tabs v-model="active" swipeable>
      <van-tab v-for="(item,index) in typeList" :title="item" :key="index" class="myTab">
        <!--内容 {{ index }}-->
        <ul class="header">
          <li>项目名称</li>
          <li>稽查时间</li>
          <li>审核类型</li>
          <li>报告</li>
        </ul>
        <ul class="content">
          <li v-for="(item,index) of list" :key="index">
            <span style="">{{item.communityName}}</span>
            <span>{{item.auditTime}}</span>
            <span>{{item.textStatus}}</span>
            <span>
              <a class="btn" @click="toAuditReport(item.id)">查看</a>
            </span>
          </li>
        </ul>
        <!-- 显示空白页面  -->
        <div v-if="isEmptyShow" style="margin-top: 30px;text-align: center">
          <img src="../../assets/img/audit/empty@2x.png"  alt="" width="128" height="119"/>
        </div>
      </van-tab>

    </van-tabs>
  </div>
</template>

<script>
  import axios from 'axios'
  // import {auditPath} from '../../api/env'
  import GetUrlParam from '@/utils/urlParse'
  // import {referUrl} from '@/api/env'


  export default {
    name: "auditRecordList",  //  稽查记录
    data() {
      return {
        // typeList: ['车辆'],
        typeList: ['车辆', '', '', '', ''],
        active: '0',
        list: [],
        communityId: null,    //
        userId: '',   // 稽查员id
        backUrl:'', // 保存跳转参考路径
        isEmptyShow: false,
        // userId: '',
        // uptownId: '',
      }
    },
    methods: {
      /**
       *    初始化参数  url取参数
       */
      init() {
        this.communityId = GetUrlParam('village_id')
        this.userId = GetUrlParam('userId')
        if (this.userId && this.communityId) {
          localStorage.setItem('userId', this.userId)
          localStorage.setItem('communityId', this.communityId)
        } else {
          this.communityId = localStorage.getItem('communityId')
          this.userId = localStorage.getItem('userId')
        }
      },
      /** 两个页面入口
       *  guixian：   我的        url跳转    OK！
       *  任务记录 ---》稽查记录 ----》 返回到稽查任务列表！
       */
      onClickLeft() {
        if (this.backUrl == '/auditTaskList') {
            location.href = localStorage.getItem('auditTaskListURL')
        }else{
          let searchStr = `?company_id=${localStorage.getItem('companyId')}&userId=${localStorage.getItem('userId')}&village_id=${localStorage.getItem('communityId')}`
          location.href =  this.$envConfigObj.referUrl + searchStr
        }
      },
      /**
       *  稽查记录列表
       */
      getAuditRecordList() {
        let that = this
        axios.post(this.$envConfigObj.auditPath + '/audit/car/pageQuery', {
          communityId: this.communityId,
          userId: this.userId,
          pageNo: 1,
          pageSize: 10,
        }).then(function (res) {
          if (res.data.status != 1) {
            let tempArr = res.data.data.records
            that.list = tempArr
            that.isEmptyShow = tempArr.length == 0
            for (let i = 0; i < tempArr.length; i++) {
              tempArr[i].auditStatus == true ? tempArr[i].textStatus = '同意' : tempArr[i].textStatus = '驳回'
              tempArr[i].auditTime = tempArr[i].auditTime.substring(0, 10)
            }
          }else{
            that.isEmptyShow = true
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      toAuditReport(id) {
        // ////alert(id)   http://webapp.test.zanjiahao.com/fee/reminder/feeMission?userId=102252&uptownId=73
        // location.href = `fee/reminder/feeMission?userId=${}`
        this.$router.push(`/auditReport/${id}`)   // 携带param参数的
      }
    },
    created() {
      localStorage.setItem('稽查记录refer:', document.referrer)
      console.log(' ================== auditRecordList begin ===================')
      console.log(this.$route)
      console.log('href', location.href)
      console.log(this.$route.params)
      this.init()
      this.getAuditRecordList()
      console.warn('cur page: ',location.href)
    },
    mounted() {

    },
    /**
     *  首页：
     *  冷： path：/
     *  稽查任务： /auditTaskList
     * @param to
     * @param from
     * @param next
     */
    beforeRouteEnter(to,from,next){
      localStorage.setItem('backUrl',from.path)
      next(vm => {
        vm.backUrl = localStorage.getItem('backUrl')
      })
    },
    beforeRouteLeave(to,from,next){
      console.info('auditRecordList backUrl ---> $',this.backUrl)
      next()
    }
  }
</script>

<style scoped lang="stylus">
  #auditRecordList
    height: 100vh
    background-color:#F5F5F5
    .van-nav-bar__left
      .van-nav-bar__arrow
        font-size: 24px;
        color:#666666;
        font-weight: 600;
    .van-nav-bar__title
      color: #333333
      font-size: 17px
      font-weight: 500
    .myTab
      .header
        display: flex
        justify-content: center
        /*padding: 20px 30px;*/

        li
          width: 25vw
          /*border: 1px solid red;*/
          text-align: center
          background-color: #F3F8FD
          padding: 10px 0;
          font-size:13px

      .content
        background-color:#fff
        text-align:center
        li
          display: flex
          align-items: center
          padding: 15px 0;

          span
            display: inline-block
            /*border: 1px solid red*/
            width: 25vw
            text-align: center
            font-size:14px

            .btn
              color:  #268AED
              cursor: pointer

          span:first-child
            /*border: 1px solid blue;*/
            padding-left: 5vw
            width: 20vw
            text-align: left

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
</style>
