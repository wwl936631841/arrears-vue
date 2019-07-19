<template>
  <div id="search">
    <ul class="condition">            <!-- 单一状态维护 -->
      <li>
        <div v-show="this.moneyDefault" @click="getListByMoneyActive">
          <span>欠费金额</span>
          <!-- 默认情况  -->
          <img src="../../../assets/img/urgePayment/arrow_default@2x.png" alt="" width="9"
               height="13"/>
        </div>
        <div v-show="this.moneyDown" @click="getListByMoneyDown">
          <span>欠费金额</span>
          <img src="../../../assets/img/urgePayment/arrow_down@2x.png" alt="" width="9"
               height="13"/>
        </div>
        <div v-show="this.moneyUp" @click="getListByMoneyUp">
          <span>欠费金额</span>
          <img src="../../../assets/img/urgePayment/arrow_up2@2x.png" alt="" width="9"
               height="13"/>
        </div>
      </li>
      <li>
        <div v-show="this.timeDefault" @click="getListByTimeSpanActive">
          <span>逾期时长</span>
          <!-- 默认情况  -->
          <img src="../../../assets/img/urgePayment/arrow_default@2x.png" alt="" width="9"
               height="13"/>
        </div>
        <div v-show="this.timeDown" @click="getListByTimeSpanDown">
          <span>逾期时长</span>
          <img src="../../../assets/img/urgePayment/arrow_down@2x.png" alt="" width="9"
               height="13"/>
        </div>
        <div v-show="this.timeUp" @click="getListByTimeSpanUp">
          <span>逾期时长</span>
          <img src="../../../assets/img/urgePayment/arrow_up2@2x.png" alt="" width="9"
               height="13"/>
        </div>
      </li>
      <li @click="togglePanel">
        <span>状态</span>
        <van-icon name="arrow-down" color="#BBBBBB" size="12px" v-show="this.activeStatus.iconToggle"/>
        <van-icon name="arrow-up" color="#BBBBBB" size="12px" v-show="!this.activeStatus.iconToggle"/>
      </li>
    </ul>
    <form action="/">
      <van-search
        v-model="content"
        placeholder="搜索业主名称或房间号"
        @search="onSearch"
        @clear="clearSearchCtx"
      />
    </form>
    <div class="overlay" v-show="this.bodyLock" @click="toggleOverLay">
      <ul class="option" v-if="statusType === 1">
        <li @click.capture.stop="chooseItem(3,$event)">
          <a>待上门</a>
        </li>
        <li @click.capture.stop="chooseItem(4,$event)">
          <a>已上门</a>
        </li>
      </ul>
      <ul class="option" v-if="statusType === 2">
        <li @click.capture.stop="chooseItem(5,$event)">
          <a>待拨打</a>
        </li>
        <li @click.capture.stop="chooseItem(6,$event)">
          <a>已拨打</a>
        </li>
      </ul>
      <ul class="option" v-if="statusType === 3">
        <li @click.capture.stop="chooseItem(8,$event)">
          <a>发送失败</a>
        </li>
        <li @click.capture.stop="chooseItem(7,$event)">
          <a>发送成功</a>
        </li>
        <li @click.capture.stop="chooseItem(9,$event)">
          <a>等待发送</a>
        </li>
      </ul>
      <div class="mask"></div>
    </div>

  </div>
</template>

<script>
  import {cuiJiaoPath} from '../../../api/env'
  import {mapState, mapGetters, mapMutations} from 'vuex'

  export default {
    name: "conditionSearch",
    data() {
      return {
        moneyUp: false,
        moneyDown: false,
        moneyDefault: true,
        timeUp: false,
        timeDown: false,
        timeDefault: true,

        content: '',
        bodyLock: false,      // 遮罩
        orderType: '',  // DESC ASC
        orderColumn: ''
      }
    },
    props: {  
      statusType: {        //  1：上门  2：电话  3：短信
        type: Number,
        default: 1,
      },
      iconRestore: {
        type: Boolean,
        default: false,
      },

    },
    watch: {
      iconRestore: function () {
        if (this.iconRestore) {
          this.init()
        }
      }
    },
    computed: {
      ...mapState([
        'conditionParam',   // 过滤参数
        'defaultParam',
        // 'defaultStatus',  //  默认状态
      ]),
      ...mapGetters(['activeStatus'])
    },
    methods: {
      // 初始化状态
      init() {
        this.initMoney()
        this.initTimeSpan()
      },
      defaultStatus() {
        return {
          moneyUp: true,  // 欠费金额
          timeUp: true,   // 逾期时长
          iconToggle: true, // 状态
          bodyLock: false,   // 状态选择
        }
      },
      //  不生效
      clearSearchCtx() {
        // debugger
        // alert('clear')
        this.content = ''
      },
      ...mapMutations({
        changeConditionParam: 'changeConditionParam'
      }),
      isNum(num) {
        const reg = /^[1-9]\d*$|^0$/;
        if (reg.test(num) == true) {
          return true
        } else {
          return false
        }
      },

      // 状态选择
      chooseItem(idx, $event) {
        // debugger
        console.log($event.target)
        let curDom = $event.target
        let domArr = document.querySelector('.option').children
        for (let item of domArr) {
          item.className = ""        // 这个的生效问题    移除className
        }
        curDom.tagName.toLowerCase() == 'a' ? curDom.parentNode.className = 'active' : curDom.className = 'active'
        this.bodyLock = false
        // this.$store.commit('changeActiveStatus', 'bodyLock')
        this.conditionParam.status = idx
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.$emit('orderByStatus')

      },

      // 搜索条件查询
      onSearch(val) {
        this.$store.commit('setDefaultStatus', this.defaultStatus)    //  恢复默认状态
        this.conditionParam.pageNo = 1
        this.isNum(val) ? this.conditionParam.houseId = val : this.conditionParam.customName = val
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.$emit('queryBySearch')
      },
      togglePanel() {
        console.log(this.activeStatus.bodyLock)
        this.bodyLock = !this.bodyLock
        document.body.style.overflow = 'hidden'
      },

      // 初始化
      initMoney() {
        this.moneyDefault = true
        this.moneyDown = false
        this.moneyUp = false
      },

      // 初始化
      initTimeSpan() {
        this.timeDefault = true
        this.timeUp = false
        this.timeDown = false
      },

      //  money 倒序
      getListByMoneyActive() {
        this.initTimeSpan()
        this.moneyDefault = false
        this.moneyDown = true
        this.conditionParam.pageNo = 1
        this.conditionParam.orderColumn = 'arrearage_money'
        this.conditionParam.orderType = 'DESC'
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.$emit('orderByMoney')
      },

      //  money 升序
      getListByMoneyDown() {
        this.moneyDefault = false
        this.moneyDown = false
        this.moneyUp = true
        this.conditionParam.pageNo = 1
        this.conditionParam.orderColumn = 'arrearage_money'
        this.conditionParam.orderType = 'ASC'
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.$emit('orderByMoney')
      },

      // money 倒序
      getListByMoneyUp() {
        this.moneyDefault = false
        this.moneyUp = false
        this.moneyDown = true
        this.conditionParam.pageNo = 1
        this.conditionParam.orderColumn = 'arrearage_money'
        this.conditionParam.orderType = 'DESC'
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.$emit('orderByMoney')
      },

      // 逾期时长 倒序
      getListByTimeSpanActive() {
        this.initMoney()
        this.timeDefault = false
        this.timeDown = true
        this.conditionParam.pageNo = 1
        this.conditionParam.orderColumn = 'arrearage_time'
        this.conditionParam.orderType = 'DESC'
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.$emit('orderByTimeSpan')
      },

      // 逾期时长 倒序
      getListByTimeSpanUp() {
        this.timeUp = false
        this.timeDown = true
        this.conditionParam.pageNo = 1
        this.conditionParam.orderColumn = 'arrearage_time'
        this.conditionParam.orderType = 'DESC'
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.$emit('orderByTimeSpan')
      },

      // 逾期时长 升序
      getListByTimeSpanDown() {
        this.timeDown = false
        this.timeUp = true
        this.conditionParam.pageNo = 1
        this.conditionParam.orderColumn = 'arrearage_time'
        this.conditionParam.orderType = 'ASC'
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.$emit('orderByTimeSpan')
      },

      // 逾期时长
      getListByTimeSpan() {
        // this.timeDefault = false   // 关闭默认
        // this.timeUp = !this.timeUp
        // this.$store.commit('setDefaultStatus', this.defaultStatus())
        // this.timeFlag = !this.timeFlag
        // alert(this.timeFlag)
        // this.$store.commit('changeActiveStatus', {key: 'timeUp', flag: this.timeFlag})
        // this.conditionParam.pageNo = 1
        // this.conditionParam.orderColumn = 'arrearage_time'
        // this.activeStatus.timeUp == true ? this.conditionParam.orderType = 'DESC' : this.conditionParam.orderType = 'ASC'
        // this.$store.commit('changeConditionParam', this.conditionParam)
        // this.$emit('orderByTimeSpan')
      },
      toggleOverLay() {
        this.bodyLock = false
      },
      getListByStatus() {

      }
    },
    created() {

    },
    mounted() {
      let that = this
      let dom = document.getElementsByClassName('van-field__left-icon')[0]
      if(dom){
        dom.onclick = function(){
          that.onSearch(that.content)
        }
      }
    }

  }
</script>

<style scoped lang="stylus">
  #search
    position: fixed
    width: 100%
    // top: .8rem
    z-index: 99999
    /*border: 1px solid red*/
    padding-bottom: .1rem
    background: #F7F7F7

    .condition
      font-size: .14rem
      display: flex
      align-items center
      height: .38rem
      background-color: #fff

      li
        display: flex
        align-items center
        justify-content: center
        flex: 1

        img, .van-icon
          margin-left: 6px

    .van-search
      background-color: #F7F7F7 !important
      // padding-bottom: 0
      padding .09rem .11rem 0rem .13rem

      .van-search__content
        align-items center
        height .32rem
        border-radius: 15px
        background-color: #fff
        border: 1px solid #F7F7F7

    .option
      margin: 0
      font-size: .14rem
      background-color: #fff
      /*height: .8rem*/
      padding: 0.1rem 0

      li
        line-height: .3rem
        height: .3rem
        font-size: .14rem
        cursor: pointer
        /*border:1px solid blue*/
        text-align: center

        a
          font-size: .12rem

      .active
        color: rgb(38, 138, 237);
        font-size: .14rem

    // 自定义遮罩

    .overlay
      /*border: 1px solid red*/
      width: 100vw
      // height: 100vh
      position: absolute
      top: .4rem
      left: 0
      z-index: 10000
      background-color: rgba(51, 51, 51, 0.5)
      cursor: pointer;

      ul {
        li {
          font-size .14rem;
          color #444
        }
      }

      .mask {
        height 100vh
        background: rgba(0, 0, 0, .2)
      }

  // 动画效果 tansition
</style>
