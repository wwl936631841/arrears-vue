<template>
  <div id="search">
    <ul class="condition">            <!-- 单一状态维护 -->
      <li v-if="statusType === 1" @click.stop="toggleStatus">
        <span>{{ statustValue }}</span>
        <van-icon v-show="!status" name="arrow-down" color="#BBBBBB" size="12px"/>
        <van-icon v-show="status" name="arrow-up" color="#BBBBBB" size="12px"/>
      </li>
      <li v-if="statusType === 2" @click.stop="toggleUrgement">
        <span>{{ urgementValue }}</span>
        <van-icon v-show="!urgement" name="arrow-down" color="#BBBBBB" size="12px"/>
        <van-icon v-show="urgement" name="arrow-up" color="#BBBBBB" size="12px"/>
      </li>
      <li @click.stop="toggleSteward">
        <span>{{ stewardValue }}</span>
        <van-icon v-show="!steward" name="arrow-down" color="#BBBBBB" size="12px"/>
        <van-icon v-show="steward" name="arrow-up" color="#BBBBBB" size="12px"/>
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
    <div class="overlay" v-show="status" @click="toggleOverLay">
      <ul class="option">
        <li @click.capture.stop="chooseItem($event)">
          <a>全部</a>
        </li>
        <li @click.capture.stop="chooseItem($event)">
          <a>是</a>
        </li>
        <li @click.capture.stop="chooseItem($event)">
          <a>否</a>
        </li>
      </ul>
      <div class="mask" v-show="mask"></div>
    </div>
    <div class="overlay" v-show="urgement" @click="toggleOverLay">
      <ul class="options">
        <li @click.capture.stop="chooseurge($event)">
          <a>全部</a>
        </li>
        <li @click.capture.stop="chooseurge($event)">
          <a>是</a>
        </li>
        <li @click.capture.stop="chooseurge($event)">
          <a>否</a>
        </li>
      </ul>
      <div class="mask" v-show="mask"></div>
    </div>
    <div class="overlay" v-show="steward" @click="toggleOverLay">
      <ul class="optionss">
        <li @click.capture.stop="choosesteward(null,$event,'全部')">
          <a>全部</a>
        </li>
        <li @click.capture.stop="choosesteward(item.ownerId,$event,item.ownerName)" v-for="(item,index) in stewardList" :key="index">
          <a>{{item.ownerName}}</a>
        </li>
      </ul>
      <div class="mask" v-show="mask"></div>
    </div>
  </div>
</template>

<script>
  
  export default {
    name: "search",
    data() {
      return {
        bodyLock: false, 
        content: '',
        mask:false,
        status:false,
        urgement:false,
        steward:false,
        statustValue:"是否通知",
        urgementValue:"是否催缴",
        stewardValue:"物业管家",
      }
    },
    props: {  //  Right-hand side of 'instanceof' is not an object
      stewardList: {        //  1：上门  2：电话  3：短信
        type: Array,
      },
      statusType:{
        type:Number
      }

    },
    watch: {
      
    },
    computed: {
      
    },
    methods: {
        defaultStatus() {
            return {
                bodyLock: false,   // 状态选择
                hasArrears:null,
                hasNotice:null
            }
        },
        //  不生效
        clearSearchCtx() {
            this.content = ''
        },
        init(){
            this.mask = false
        },
        toggleStatus() {
            this.init()
            this.status = !this.status
            this.mask = !this.mask
            this.urgement = false
            this.steward = false
        },
        toggleUrgement(){
            this.init()
            this.urgement = !this.urgement
            this.mask = !this.mask
            this.steward = false
            this.status = false
        },
        toggleSteward(){
            this.init()
            this.steward = !this.steward
            this.mask = !this.mask
            this.status = false
            this.urgement = false
        },
        onSearch(val) {
            this.$emit('queryBySearch',val)
        },
        toggleOverLay() {
            this.bodyLock = false
        },
        chooseItem($event) {
            // debugger
            // console.log($event.target)
            let curDom = $event.target
            let domArr = document.querySelector('.option').children
            // let domArr = document.getElementsByClassName("option").childNodes
            // console.log(domArr)
            for (let item of domArr) {
            item.className = ""        // 这个的生效问题    移除className
            }
            curDom.tagName.toLowerCase() == 'a' ? curDom.parentNode.className = 'active' : curDom.className = 'active'
            this.bodyLock = false
            this.status = false
            if($event.target.innerText == '是'){
              this.statustValue = '是'
              this.hasNotice = 0
            }else if($event.target.innerText == '否'){
              this.statustValue = '否'
              this.hasNotice = 1
            }else if($event.target.innerText == '全部'){
              this.statustValue = '全部'
              this.hasNotice = null
            }else{
              this.statustValue = '是否通知'
              this.hasNotice = null
            }
            this.$emit('orderByStatus',this.hasNotice)
        },
        chooseurge($event) {
            let curDom = $event.target
            let domArr = document.querySelector('.options').children
            for (let item of domArr) {
              item.className = ""        // 这个的生效问题    移除className
            }
            curDom.tagName.toLowerCase() == 'a' ? curDom.parentNode.className = 'active' : curDom.className = 'active'
            this.bodyLock = false
            this.urgement = false
            if($event.target.innerText == '是'){
              this.urgementValue = '是';
              this.hasArrears = 0
            }else if($event.target.innerText == '否'){
              this.urgementValue = '否';
              this.hasArrears = 1
            }else if($event.target.innerText == '全部'){
              this.urgementValue = '全部'
              this.hasArrears = null
            }else{
              this.statustValue = '是否催缴'
              this.hasArrears = null
            }
            this.$emit('orderByUrge',this.hasArrears)
        },
        choosesteward(id,$event,name) {
            let curDom = $event.target
            let domArr = document.querySelector('.optionss').children
            for (let item of domArr) {
              item.className = ""        // 这个的生效问题    移除className
            }
            curDom.tagName.toLowerCase() == 'a' ? curDom.parentNode.className = 'active' : curDom.className = 'active'
            this.bodyLock = false
            this.steward = false
            name ? this.stewardValue = name : this.stewardValue = '物业管家'
            this.$emit('orderBySteward',id)
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
      document.body.addEventListener('click',function(){
        that.mask = false
        that.status = false
        that.urgement = false
        that.steward = false
      })
    }

  }
</script>

<style scoped lang="stylus">
  #search
    position: relative
    width: 100%
    z-index: 99999
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
      padding .09rem .11rem 0rem .13rem

      .van-search__content
        align-items center
        height .32rem
        border-radius: 15px
        background-color: #fff
        border: 1px solid #F7F7F7

    .option,.options,.optionss
      margin: 0
      font-size: .14rem
      background-color: #fff
      padding: 0.1rem 0

      li
        line-height: .3rem
        height: .3rem
        font-size: .14rem
        cursor: pointer
        text-align: center

        a
          font-size: .12rem

      .active
        color: rgb(38, 138, 237);
        font-size: .14rem

    // 自定义遮罩

    .overlay
      width: 100vw
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

</style>
