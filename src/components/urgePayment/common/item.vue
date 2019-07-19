<template>
  <div class="item" @click="toItemDetail(itemObj.taskId,$event)">
    <div class="splitLine"></div>
    <ul class="message">
      <li>
        <div class="status">
          <div class="left">
            <span class="customName" v-html="itemObj.customName"></span>
            <div class="followStatus" v-hasBtn @click.stop="toggle()">
                <span class="yes" v-show="itemObj.isFollow">
                  <i></i>已关注
                </span>
                <span class="no" v-show="!itemObj.isFollow">
                  + 关注
                </span>
            </div>
            <div style=" height: .23rem; display: flex;">
              <img src="../../../assets/img/urgePayment/icon_call@2x.png" alt="" @click.stop="call()" v-has-btn/>
            </div>
          </div>
          <div class="right">
            <span class="yes" v-show="itemObj.payStatus">已支付</span>
            <span class="no" v-show="!itemObj.payStatus">未支付</span>
          </div>
        </div>
        <div class="price">
          <div>
            <span>￥{{itemObj.arrearageMoney}}元</span>
            <span class="arrow"></span>
            <i>逾期{{itemObj.arrearageTime}}天</i>
          </div>
          <!-- 上门页面：有    已支付：不显示-->
          <!-- <div class="share" v-if="isVisit && !itemObj.payStatus">
            <div class="shareBtn" @click.stop="WXshareFn">
              <i></i>
              <span>分享账单</span>
            </div>
          </div> -->
          <div class="share" v-if="isVisit && !itemObj.payStatus">
            <div class="shareBtn1" @click.stop="billDetailFn">
              <i></i>
              <span>账单详情</span>
            </div>
          </div>
        </div>
        <div class="tip" v-show="adviceStatus">
          <img src="../../../assets/img/urgePayment/tips@2x.png" alt="">
          <span>{{itemObj.suggestedToHomeTime}}</span>
        </div>
        <div class="add">
          <div class="left">
            <img src="../../../assets/img/urgePayment/location@2x.png" alt="">
            <span>{{itemObj.uptownName}}{{itemObj.unitNumber}}{{itemObj.houseName}}</span>
          </div>
          <div class="right" v-show="adviceStatus">
            <div class="btn" @click.stop="goToVisiit(itemObj)">
              <button v-hasBtn v-show="itemObj.hasToHome == 1">上门</button>
              <button v-hasBtn v-show="itemObj.hasToHome == 2">再次上门</button>
            </div>
            <div class="first" @click="phone(itemObj.customPhone)" v-show="itemObj.hasCalled==1">
              <van-button type="info" v-hasBtn>拨打</van-button>
            </div>
            <div class="nth" @click="phone(itemObj.customPhone)" v-show="itemObj.hasCalled==2">
              <van-button plain v-hasBtn>再次拨打</van-button>
            </div>
            <div class="success" v-show="itemObj.hasSmsSend==1">
              <img src="../../../assets/img/sms/icon_success.png" alt="">
              <span>发送成功</span>
            </div>
            <div class="failed" v-show="itemObj.hasSmsSend==2">
              <img src="../../../assets/img/sms/icon_fail@2x.png" alt="">
              <span>发送失败</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>

</template>
<script>
  import axios from 'axios'

  export default {
    name: "smsReminderIndex",
    data() {
      return {
        customName: '',
        followStatus: false,
        amount: "1024",
        isRepeat: false,   // 上门  再次上门
      }
    },
    props: {
      itemObj: {
        type: Object,
        default() {
          return {}
        }
      },
      adviceStatus: true,
      isVisit: false,    // 是否上门
    },
    methods: {
      WXshareFn() {
        this.$emit('wxEvent')
      },

      billDetailFn(){
        this.$emit('billDetail')
      },

      // 拨打
      phone(customPhone) {
        this.$dialog.confirm({
          message: customPhone,
          cancelButtonColor: "#007AFF",
          confirmButtonColor: "#007AFF",
          className: "confirmUpdate",
        }).then(() => {
          // on close
        }).catch(() => {

        });
      },

      // 电话
      call() {
        if (this.itemObj.customPhone == '') {
          this.$toast({
            message: "该用户未录入电话",
            duration: 1000,
          })
          return
        }
        this.$buryPoint('call-icon')
        this.$dialog.confirm({
          title: this.itemObj.customPhone,
          cancelButtonColor: "#007AFF",
          confirmButtonColor: "#007AFF",
          className: "confirmUpdate",
          confirmButtonText: '拨打',
        }).then(() => {
          axios.post(this.$envConfigObj.cuiJiaoPath + '/arrears/phone/insertDial', {
            taskDetailId: this.itemObj.taskId,
            houseId: this.itemObj.houseId,
            arrearId:this.itemObj.arrearId,
            ownerId: localStorage.getItem('userId'),
            telUser: this.itemObj.customName,
            telPhone: this.itemObj.customPhone,
          }).then((res) => {
            if (res.data.status == 0) {
              console.log('tel:' + this.itemObj.customPhone)
              window.location.href = 'tel:' + this.itemObj.customPhone
            }
          })
        }).catch((err) => {
          console.log(err)
        });
      },

      toItemDetail(id, event) {
        if (event.target.tagName !== 'BUTTON') {
          this.$router.push({name: 'arrearsDetail', params: {taskId: id, houseId: this.itemObj.houseId}})
        }
      },

      // 上门
      goToVisiit(val) {
        this.$buryPoint('door')
        console.log('this.obj',this.itemObj)
          this.$router.push({
            name: 'feedBack',
            params: this.itemObj
          })
      },

      // 关注
      addFollow() {
        let that = this
        that.$buryPoint('attention')
        axios.post(this.$envConfigObj.cuiJiaoPath + '/attention/addFollow', {
          ownId: this.$store.state.conditionParam.ownId,
          customPhone: this.itemObj.customPhone,
          houseId: this.itemObj.houseId,
          customType: 1,
          customAddress: this.itemObj.uptownName + this.itemObj.unitNumber + this.itemObj.houseName,
          customName: this.itemObj.customName,
        }).then(function (res) {

        })
      },

      // 取消关注
      cancelFollow() {
        let that = this
        that.$buryPoint('Remove-attention')
        axios.get(`${this.$envConfigObj.cuiJiaoPath}/attention/cancelFollow/${localStorage.getItem('userId')}/${this.itemObj.houseId}`).then(function (res) {

        })
      },

      toggle() {
        if (this.itemObj.isFollow == true) {
          this.itemObj.isFollow = false;  // 关注
          this.cancelFollow()
          this.$toast({
            message: "已取消关注",
            position: {
              bottom: 50,
            },
          })
        } else {
          this.itemObj.isFollow = true
          this.addFollow()
          this.$toast({
            message: "关注成功",
            position: {
              bottom: 50,
            },
          })
        }
      },
    },
    created() {
      this.isFollow = this.itemObj.isFollow
      // console.log('111',this.itemObj)
    }
  }
</script>
<style lang="stylus">
  .confirmUpdate
    width: 70%

    .van-dialog__header
      font-size .17rem;
      color #030303


</style>
<style lang="stylus" scoped>
  .item
    .splitLine
      background: #f5f5f5
      height: 0.1rem

    .message
      li
        // height 1.5rem
        background-color #fff
        padding .14rem .17rem .13rem .2rem
        box-sizing: border-box

        .status
          display flex;
          height .34rem;
          align-items: center
          justify-content: space-between

          .left
            display: flex
            align-items: center

            > span
              max-width: 1.6rem
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap

            .customName
              font-size .17rem
              color #333
              font-weight 500

            .followStatus
              width .56rem
              height .24rem
              position relative
              line-height .22rem
              text-align center
              margin-left .08rem

              .yes, .no
                font-size .12rem
                position: absolute
                width: 100%
                left: 0

                i
                  display: inline-block
                  width: 0.09rem
                  height: 0.08rem
                  margin-right: 3px

              .yes
                border 1px solid #CCCCCC;
                border-radius .04rem;
                color #444
                font-weight 400

                i
                  background-image: url("../../../assets/img/urgePayment/icon_unfollow@2x.png")
                  background-position: center center
                  background-size: contain

              .no
                border 1px solid #268AED
                border-radius .04rem
                color #268AED

                i
                  background-image: url("../../../assets/img/urgePayment/icon_follow@2x.png")
                  background-position: center center
                  background-size: contain

            img
              width: 0.23rem
              height: 0.23rem
              margin-left: 0.05rem

          .right
            font-size .14rem

            .yes
              color #444

            .no
              color #268AED

        .price
          display flex

          div
            display: flex

            span
              color #268AED
              font-size .16rem

            .arrow
              display: inline-block
              width: 0
              height: 0
              border-width: .08rem
              border-style: solid
              border-color: transparent rgba(221, 221, 221, 0.5) transparent transparent
              position: relative
              top: .05rem;
              right: -0.02rem;

            i
              font-size: 0.1rem
              color: #666
              font-style: normal
              border: 1px solid rgba(221, 221, 221, 0.5)
              border-radius: 3px
              background rgba(221, 221, 221, 0.5)
              line-height: .16rem
              height: .14rem
              // margin-left: 0.05rem
              margin-top: 0.03rem
              padding: 0.01rem 0.02rem

          .share
            display: flex
            justify-content: flex-end
            flex: 1
            .shareBtn1
              // border 1px solid #268aed
              border-radius .04rem
              padding .03rem .05rem
              padding-right 0
              span
                font-size .14rem
                color #1CC8AE
              i
                display: inline-block
                width: .08rem
                height: .12rem
                background-image: url("../../../assets/img/record/icon_total2@2x.png")
                // background-color: rgba(52, 184, 0, 1)
                background-size: contain
                background-repeat: no-repeat
                margin-right: 3px
                border: none
            .shareBtn
              display: flex
              align-items: center
              justify-content: space-around
              color: rgba(52, 184, 0, 1)
              background-color: rgba(52, 184, 0, 1)
              /*width: .72rem*/
              height: .24rem
              padding: 0.02rem 0.08rem
              border-radius: .2rem


              span
                font-size: .11rem
                color: #fff

        .tip
          display flex
          height: .18rem
          line-height: .18rem
          padding .07rem 0 0 0

          img
            width: .14rem
            height: .14rem
            margin: 0.02rem .06rem 0 0

          span
            color #4C5F6C
            font-size .12rem


        .add
          display flex
          justify-content: space-between
          padding: 5px 0

          .left
            font-size .12rem
            max-width 2.23rem

            img
              width .12rem
              height .15rem
              vertical-align: middle

          .right

            .btn
              display: flex
              align-items: flex-start

              button
                display: flex
                align-items: center
                justify-content center
                font-size: .13rem
                // padding-top: 3px
                // padding-bottom: 3px
                padding 0
                width: .7rem
                height: .3rem
                border: 1px solid #268AED
                border-radius: 5px

              button:nth-child(1)
                background-color: #268AED
                color: #fff

              button:nth-child(2)
                background-color: #fff
                color: #268AED

  .first, .nth {
    display: flex;
    justify-content: flex-end;

    .van-button {
      width .7rem
      height .3rem
      line-height .3rem
      padding 0
    }
  }

  .nth {
    border 1px solid #268AED
    border-radius 4px;

    .van-button {
      color #268AED
      font-size .13rem;
    }
  }
</style>

