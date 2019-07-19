<template>
  <div id="homeDetail">
    <van-nav-bar
      class="homeDetailTitle"
      title="催缴详情"
      left-text=""
      right-text="催缴记录"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <item :itemObj="itemObj" :isVisit='true' @billDetail="billDetails"></item>
    <div class="list">
      <van-cell>
        <template slot="title">
          <span class="custom-text">{{itemObj.customName}}</span>
          <van-tag color="#268AED" plain>业主</van-tag>
        </template>
      </van-cell>
      <ul class="listContent">
        <li>
          <p>最新入场时间</p>
          <p>{{itemObj.latestAdmissionTime}}</p>
        </li>
        <li>
          <p>今天门禁刷卡次数</p>
          <p>{{itemObj.creditsNumber}}次</p>
        </li>
        <li>
          <p>今天停车场进出次数</p>
          <p>{{itemObj.parkTime}}次</p>
        </li>
        <li>
          <p>本月累计上门次数</p>
          <p>{{itemObj.localMonthArrearsCount}}次</p>
        </li>
        <li>
          <p>本月成功上门次数</p>
          <p>{{itemObj.localMonthSuccessArrearsCount}}次</p>
        </li>
        <li>
          <p>上门建议方案</p>
          <p>{{itemObj.proposal}}</p>
        </li>
      </ul>
    </div>
    <div class="callList">
      <ul>
        <li v-for="(item,index) of itemObj.voSet" :key="index">
          <p>{{item.customName}}</p>
          <p>
            <img src="../../../assets/img/urgePayment/icon_call@2x.png" width="23" height="23" @click="call" alt="...">
          </p>
        </li>
        <li>
          <p>前端测试数据</p>
          <p>
            <img src="../../../assets/img/urgePayment/icon_call@2x.png" width="23" height="23" @click="call" alt="...">
          </p>
        </li>
      </ul>
    </div>
    <div class="btn">
      <van-button size="large" type="info" @click="toFeedBack">上门反馈</van-button>
    </div>
  </div>
</template>

<script>
  import item from '../common/item'
  import axios from 'axios'
  import GetUrlParam from '@/utils/urlParse'

  export default {
    name: "arrearsDetail",
    data() {
      return {
        customName: '',
        pageNo: 1,
        pageSize: 10,
        taskId: '',
        houseId: '',
        arrearType: 3,     // /arrears/home/details/1/1/3
        itemObj: {},
      }
    },
    components: {
      item
    },
    props: {},
    methods: {
      billDetails(){
          this.$buryPoint('bill-details')
          axios.get(`${this.$envConfigObj.houseId}?cottage_id=${this.houseId}`).then(res=>{
              if(res.data.errorCode == 0){
                  const getHouseId = res.data.data.list.FWID
                  let url = `zjh://?action=billDetail&house_id=${getHouseId}&customer_mobilephone=${this.itemObj.customPhone}&customer_id=${this.itemObj.customId}&village_id=${this.itemObj.uptownId}&customer_name=${this.itemObj.customName}&address=${this.itemObj.uptownName}${this.itemObj.unitNumber}${this.itemObj.houseName}`
                  console.log('url',url)
                  window.location.href = url
              }
          })
      },

      // 电话
      call() {
        let that = this
        that.$buryPoint('call-icon')
        if (this.itemObj.customPhone == '') {
          this.$toast({
            message: "该用户未录入电话",
          })
        } else {
          this.$dialog.confirm({
            title: this.itemObj.customPhone,
            cancelButtonColor: "#007AFF",
            confirmButtonColor: "#007AFF",
            className: "confirmUpdate",
            confirmButtonText: '拨打',
          }).then(() => {
            axios.post(this.$envConfigObj.cuiJiaoPath + '/arrears/phone/insertDial', {
              taskDetailId: this.itemObj.taskId,
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
        }
      },

      /**
       *  两个入口：  取参规则一致
       *    1.从自己的页面跳转过去（提交给郭勇）
       *    2.从app跳转过来（）
       */
      getDetail() {
        this.taskId = this.$route.params.taskId
        this.houseId = this.$route.params.houseId
        axios.get(`${this.$envConfigObj.cuiJiaoPath}/arrears/home/details/${this.taskId}/${this.houseId}/${this.arrearType}`).then((res) => {
          if (res.data.status == 0) {
            this.itemObj = res.data.data
            console.log('itemObj',this.itemObj)
          }
        })
      },

      /**
       *  两种入口 --- 两种跳转规则
       */
      onClickLeft() {
        let fromPhone = GetUrlParam('fromPhone')
        if ((fromPhone == "android") || (fromPhone == "iOS")) {
          window.location.href = "zjh://close"
        } else if (fromPhone == null) {
          this.$router.go(-1)
        }
      },

      onClickRight() {
        let that = this
        that.$buryPoint('visit-records')
        this.$router.push({
          name: "arrearsRecord",
          params: {
            taskId: that.itemObj.taskId,
            houseId:that.itemObj.houseId
          }
        })
      },

      toFeedBack() {
        this.$router.push({
          name: 'feedBack',
          params: this.itemObj
        })
      }
    },

    created() {
      this.getDetail()
    },

    beforeRouteUpdate(to, from, next) {
      console.log(from)
      console.log(to)
      next()
    }
  }
</script>

<style scoped lang="stylus">
  .btn {
    position: fixed;
    bottom: 0;
    width: -webkit-fill-available;
    margin: .15rem .12rem;
    height .44rem
    button{
        width: 100%;
        position absolute
        top 0
    }
    .van-button--default{
        .van-button__text{
            color #268AED;
        }
    }
  }

  .van-tag {
    padding: .02rem .05rem;
    line-height: .16rem;
  }

</style>
<style lang="stylus">
  #homeDetail
    .homeDetailTitle
      height .43rem;
      line-height .43rem

      .van-nav-bar__left
        padding-left .15rem
        left 0
        .van-icon-arrow-left
          font-size .20rem
          color #333

      .van-nav-bar__title
        font-size .18rem
        color #333

      .van-nav-bar__right
        font-size .15rem
        color #268AED
    height 100%
    background: rgba(247, 247, 247, 1)

    .item
      height: 1.2rem

      .splitLine
        height: 0

      .message
        li
          .status
            display: flex
            align-items: center

            .left
              > span
                font-size: .17rem
                font-weight: 600

            .right
              span
                color: rgba(68, 68, 68, 1)
                font-size: .14rem

          .price
            margin-top: .1rem

          .add
            margin-top: .1rem

            .left
              display: flex
              align-items: center

              img
                margin-right: 5px

    .list
      // margin-top: .3rem
      border-top: .15rem solid rgba(247, 247, 247, 1)

      .listContent
        padding: 0 .15rem
        background: #fff

        li
          display: flex
          line-height .44rem
          border-bottom 1px solid #eee
          p
            margin 0
            flex: 1
            font-size: .14rem
            color #666

          p:nth-child(2)
            color #444
            text-align: right

    .callList
      ul
        margin-top: .15rem

        li
          display: flex
          height: .44rem
          padding: 0 .15rem
          border-bottom: 1px solid rgba(235, 235, 235, 1)
          background: #fff

          p
            font-size: .14rem
            flex: 1
            color #444

          p:nth-child(2)
            margin: 0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
</style>
