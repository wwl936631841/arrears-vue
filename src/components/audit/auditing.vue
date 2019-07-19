<template>
  <div id="auditing">
    <van-nav-bar
      title="稽查"
      left-arrow
      @click-left="onClickLeft">
    </van-nav-bar>
    <div class="title" style="">
      <panel-head :title="auditObj.communityName" :date="auditObj.applyTime" :is-position="true"></panel-head>
    </div>
    <div class="border"></div>
    <div class="body">
      <h4 style="color:#F55023">{{auditObj.exTypeDes}}</h4>
      <ul>
        <li v-if="iconShow">
          <!-- 金额异常 -->
          <span v-if="auditObj.exAmount != 0">免费放行金额{{auditObj.exAmount}}元，</span>
          <!-- 次数异常 -->
          <span v-if="auditObj.freeNums != 0">免费放行{{auditObj.freeNums}}次，</span>
          <span v-if="auditObj.involvedNums != 0">涉及车辆{{auditObj.involvedNums}}辆</span>
        </li>
        <li v-if="auditObj.handerNums != 0">
          <span>手动开闸{{auditObj.handerNums}}次</span>
        </li>
      </ul>
    </div>
    <div style="height: .15rem; background-color: #F5F5F5"></div>
    <div class="radioGroup">
      <van-radio-group v-model="radio">
        <span class="radioItem">审核意见</span>
        <van-radio class="radioItem" name="1">同意</van-radio>
        <van-radio class="radioItem" name="2">驳回</van-radio>
      </van-radio-group>
    </div>
    <div class="border"></div>
    <div class="textarea">
      <van-cell-group>
        <van-field
          v-model="auditContent"
          clearable
          :error-message="errorMessage"
          type="textarea"
          placeholder="请填写说明"
          rows="2"
          autosize
        />
      </van-cell-group>
    </div>
    <div class="submit">
      <van-button size="large" type="info" @click="submit">提交</van-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  // import {auditPath} from '../../api/env'
  import {Toast} from 'vant';
  import GetUrlParam from '@/utils/urlParse'

  // import panelHead from 'panelHead'    // module not found
  import panelHead from './panelHead'

  export default {
    name: "auditing",   //  正在审计
    data() {
      return {
        radio: '1',
        auditContent: '',  // 审核意见内容
        auditObj: {},
        errorMessage: '',
        userId: '', // 原生传递过来的
        username:'', // 原生传递过来的
        iconShow: false,//
      }
    },
    watch: {
      '$route'(to, from) {
        console.log(from)
        console.log(to)
      }
    },
    components: {
      panelHead
    },
    props: {
      id: Number,
    },
    computed: {
      // 关联content  err msg

    },
    methods: {
      initParam() {
        // 先从url取参  然后localstorage（其他入口）
        let username = GetUrlParam('username')
        this.username = username == null ? localStorage.getItem('username') : decodeURIComponent(username)
        console.info('===username===')
        console.info(this.username)
        console.info('===username===')
        this.userId = GetUrlParam('userId') == null ? localStorage.getItem('userId') : GetUrlParam('userId')
      },
      getNowDate() {
        let date = new Date();
        let year = date.getFullYear() // 年
        let month = date.getMonth() + 1; // 月
        let day = date.getDate(); // 日
        let hour = date.getHours(); // 时
        let minutes = date.getMinutes(); // 分
        let seconds = date.getSeconds() //秒
        var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
        // var week = weekArr[date.getDay()];
        // 给一位数数据前面加 “0”
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
          day = "0" + day;
        }
        if (hour >= 0 && hour <= 9) {
          hour = "0" + hour;
        }
        if (minutes >= 0 && minutes <= 9) {
          minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
          seconds = "0" + seconds;
        }
        return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
      },
      getNowMonth() {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        return year + "." + this.padZero(month)
      },
      /**
       *  补0
       */
      padZero(num) {
        num <= 9 ? num = '0' + num : num
        return num
      },
      /**
       *  跳转方式
       */
      routerWay() {
        let url = location.href
        if (url.indexOf('fromPhone') != -1) {
          location.href = 'zjh://close'
        } else {
          // history.back()
          this.$router.go(-1)
        }
      },
      onClickLeft() {
        let url = location.href
        localStorage.setItem('auditing href', url)
        if (url.indexOf('fromPhone') != -1) {
          location.href = 'zjh://close'
        } else {
          // history.back()
          this.$router.go(-1)
        }
      },
      /**
       *  获取审计任务信息   绑值
       */
      getTaskDetail() {
        console.info('auditing---->', location.href)
        let param = this.$route.params.taskId
        let that = this
        axios.get(this.$envConfigObj.auditPath + `/audit/car/selectTaskInfo/${param}`, {}).then(function (res) {
          let obj = res.data.data
          that.auditObj = obj
          that.iconShow = obj.exAmount !=0 || obj.freeNums != 0 || obj.involvedNums != 0
        }).catch(function (error) {
          console.log(error);
        });

      },
      /**
       *
       */
      submit() {
        let that = this
        if (this.auditContent != '') {
          let param = {
            communityId: this.auditObj.communityId,
            auditCode: this.auditObj.auditCode,
            communityName: this.auditObj.communityName,
            auditTime: this.getNowDate(),
            auditMonth: this.auditObj.applyTime,
            auditStatus: this.radio == '1' ? true : false,
            auditOpinion: this.auditContent,
            examiner: this.username,      // 审核人  从localStorage取的
            userId: this.userId                //  审计员id
          }
          axios.post(this.$envConfigObj.auditPath + '/audit/car/submit', param).then(function (res) {
            console.info(res)
            if (res.data.status == 0) {
              that.$toast({
                type: 'success',
                message: '提交成功',
                duration: 1000,
              })
              that.routerWay()
            } else {
              console.error('===error=====')
              console.error(res.data.message)
              console.error('===error=====')
              that.$toast({
                type: 'fail',
                message: res.data.message,
                duration: 3000,
              })
              that.routerWay()
            }
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          that.$toast({
            type: 'fail',
            message: '请填写说明',
            duration: 3000,
          })
        }
      },

    },
    created() {
      this.initParam()
      this.getTaskDetail()
      console.warn('cur page: ', location.href)

    },
    mounted() {

    }
  }
</script>
<style lang="stylus" scoped>
#auditing{
  .title{
    // padding:0 .2rem
    // font-size .14rem
  }
}
</style>

<style scoped lang="stylus">
  @import "../../stylus/mixin.styl"
  #auditing
    backgronud-color: #F5F5F5
    height: 100vh

    .van-nav-bar__left
      .van-nav-bar__arrow
        font-size: .24rem;
        color: #333333;
        font-weight: 600;

    .van-nav-bar__title
      color: #333333
      font-size: .17rem
      font-weight: 500

    .border
      border-1px(#F5F5F5)

    .body
      padding: 0 .2rem

      h4, li
        text-align: justify
        font-size .14rem
      ul
        /*list-style-type: circle*/
        margin-bottom: .2rem

        li
          margin-top: .2rem
          span:nth-child(3)
            margin-left: .09rem
        li:

        :before
          display: inline-block
          content: "●"
          color: #A9D4FF;
          font-size: .12rem
          position: relative
          top: -3px
          right: 5px

          span
            font-size: .14rem
            color:#313131

    .radioGroup
      margin-top: .1rem
      margin-bottom: .1rem

      .radioItem
        color: #313131
        flex: 1
        font-size: .14rem
        font-weight: 500

      .van-radio-group
        display: flex
        justify-content: space-between
        padding: 0 .2rem
        line-height: .4rem
        font-weight: 600

        span
          flex: 3
          text-align: left

        div
          flex: 1

    .textarea
      .van-cell-group
        height: 15vh

        .van-field__body
          font-size: .14rem
          color: #999999

    .submit
      position: fixed
      bottom: 0
      width: 94%
      left: 3%
</style>
