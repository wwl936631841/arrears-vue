<template>
  <div id="reminderTaskIndex">
    <van-nav-bar
      class="reminderTitle"
      title="催缴任务"
      left-text=""
      right-text="我的关注"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
      v-show="headerShow"
    />
    <van-tabs swipeable @change="setActiveNum"
              v-model="active"
              :line-height='2'
              color="#268AED"
              :line-width='70'
              title-active-color="#268AED"
              title-inactive-color="#444">
      <van-tab title="催缴汇总">
        <arrearsTotal></arrearsTotal>
      </van-tab>
      <van-tab title="上门催缴">
        <home-payment></home-payment>
      </van-tab>
      <van-tab title="电话催缴">
        <phoneReminderIndex></phoneReminderIndex>
      </van-tab>
      <van-tab title="短信催缴">
        <smsReminderIndex></smsReminderIndex>
      </van-tab>
    </van-tabs>

  </div>
</template>
<script>
  import smsReminderIndex from '../smsReminder/Index'
  import arrearsTotal from '../arrearsTotal'
  import homePayment from '../homePayment/Index'
  import phoneReminderIndex from '../phoneReminder/Index'
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    name: "reminderTaskIndex",
    components: {
      smsReminderIndex,
      homePayment,
      phoneReminderIndex,
      arrearsTotal,
    },

    data() {
      return {
        active: sessionStorage.getItem('activeTabNum') != null ? sessionStorage.getItem('activeTabNum') : 0,
        overLayShow: false,
        headerShow: true,
      }
    },

    computed: mapState([
      'conditionParam'
    ]),
    
    methods: {
      // 状态init
      defaultStatus() {
        return {
          moneyUp: true,  // 欠费金额
          timeUp: true,   // 逾期时长
          iconToggle: true, // 状态
          bodyLock: false,   // 状态选择
        }
      },

      defaultParam() {
        return {
          orderColumn: 'visit_suggest',   // 默认值
          orderType: 'DESC',
          ownId: this.conditionParam.ownId,
          pageNo: 1,
          pageSize: 10,
          // type: 3,  // 1:短信催缴,2:电话催缴,3:上门催缴
          houseId: '',
          customName: '',
          status: '',
        }
      },

      setActiveNum(index, title) {
        sessionStorage.setItem('activeTabNum', index)   // 存储active index
        this.$store.commit('changeConditionParam', this.defaultParam())  // 清除过滤条件
      },

      onClickLeft() {
        window.location.href = "zjh://close"
      },

      onClickRight() {
        this.$buryPoint('My-concern')
        this.$router.push({
          name: "myFoucsIndex"
        })
      },

      // 角色信息初始化
      getRoleList() {
        axios.get(this.$envConfigObj.cuiJiaoPath + '/arrears/getRoleList?userId=' + this.conditionParam.ownId).then((res) => {
          if (res.data.status == 0) {
            this.$store.commit('setRoleArr', res.data.data)
          }
        })
      }
    },

    created() {
      console.debug('get app url begin')
      console.log(location.href)
      console.debug('get app url end')
      localStorage.removeItem('uptownId')
      let ownId = this.$utils.GetUrlParam('userId')
      let uptownId = this.$utils.GetUrlParam('village_id')
      localStorage.setItem('uptownId', uptownId)
      this.conditionParam.pageNo = 1
      this.$store.commit('changeConditionParam', this.conditionParam)
      this.$store.state.conditionParam.ownId = ownId
      this.getRoleList()
      localStorage.setItem('userId',this.$utils.GetUrlParam('userId'))
    },

    mounted() {
      window.addEventListener('scroll', this.showHeader)
    }
  }
</script>
<style lang="stylus" scoped>
  #reminderTaskIndex {
    min-height 100%
    background-color #F5F5F5
    .reminderTitle {
      z-index: 2000 !important;
      height .43rem;
      line-height .43rem
      position fixed
      top auto
      .van-nav-bar__left {
        padding-left .15rem
        left 0
        .van-icon-arrow-left {
          font-size .20rem
          color #333
        }
      }

      .van-nav-bar__title {
        font-size .18rem
        color #333
      }

      .van-nav-bar__right {
        font-size .15rem
        color #268AED
      }
    }
  }
</style>
<style lang="stylus">
#reminderTaskIndex{
  .van-tabs--line{
    padding-top .44rem
  }
  .van-tabs {
    // margin-top: .43rem
    width: 100%
    position: relative
    z-index: 1000
    // padding-top .63rem
    .van-tabs__wrap {
      /*border:1px solid red*/
      // position: fixed
      // top: .62rem
      width: 100%
      position relative
      top 0
      /*height: 100%*/
      z-index: 1006

      .van-tabs__nav {
        width: 100%
        z-index: 1005

        .van-tab {
          position: relative
          z-index: 1002
        }
      }

      .van-tabs__content {
        /*position: relative*/
      }
    }

    .van-tabs__content {
      position: relative
      z-index: 1001
      // padding-top .18rem

      .van-tab__pane {
        /*position: relative*/
        /*z-index: 1001*/
      }
    }
    
  }
}
</style>
