<template>
  <div id="recordDetail">
    <div class="header">
      <div class="backImg" @click="goBack">
        <img src="../../../assets/img/urgePayment/icon_back@2x.png" alt="" width="12" height="20"/>
      </div>
      <p class="title">上门反馈</p>
    </div>
    <ul class="listInfo">
      <li>
        <span>是否在家</span>
        <span>{{isHome}}</span>
      </li>
      <li>
        <span>是否成功催缴</span>
        <span>{{isSuccess}}</span>
      </li>
    </ul>
    <div class="imgContainer">
      <p>
        <span>上传图片</span>
        <span>建议上传楼栋号、门牌号等凭证</span>
      </p>
      <ul class="imgList">
        <li v-for="(item,idx) of imgList" :key="idx">
          <img :src="item" alt=""/>
        </li>
      </ul>
    </div>
    <div class="desc">
      <p>催缴说明</p>
      <p>{{description}}</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "recordDetail",
    data() {
      return{
        isHome: '',
        isSuccess: '',
        imgList: [],
        description: '',
      }
    },
    methods:{
      goBack(){
        this.$router.go(-2)
      },

      feedBackDetail(){
        axios.get(`${ this.$envConfigObj.cuiJiaoPath}/arrears/home/queryFeedbackRecord?pageNo=${this.pageNo}&pageSize=${this.pageSize}&taskId=${this.taskId}`).then(res => {
          if (res.data.status == 0) {
            console.log('111',res)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      console.log(this.$route.params)
      let obj = this.$route.params.obj
      this.isHome = obj.isHome
      this.isSuccess = obj.isSuccess
      this.imgList = obj.imgList.length > 0 ? obj.imgList.split(',') : []
      console.log(this.imgList)
      this.description = obj.description
    },
    mounted() {

    }
  }
</script>

<style scoped lang="stylus">
#recordDetail
  height: 100vh
  width: 100vw
  background-color:#F7F7F7
  .header
    background-color:#fff
    display:flex
    align-items: center
    height: .45rem
    text-align:center
    .backImg
      display: flex
      align-items:center
      flex:1
      height: .45rem
      padding-left: .15rem
    .title
      flex:2
      text-align:left
      padding-left: .3rem
      margin: 0
      font-size: .16rem
  .listInfo
    background-color:#fff
    padding: 0 0.19rem 0 .15rem
    li
      display:flex
      align-items:center
      border-bottom: 1px solid #EBEBEB
      height: .44rem
      span
        flex: 1
        font-size: .14rem
      span:nth-child(2)
        text-align:right
  .imgContainer
    background-color:#fff
    padding: 0 0.19rem 0 .15rem
    p
      display:flex
      algin-items: center
      padding-top: .2rem
      margin:0
      height: .3rem
      line-height: .3rem
      span
        font-size: .12rem
      span:nth-child(1)
        color:rgba(68, 68, 68, 1)
        font-size: .14rem
      span:nth-child(2)
        color:#ACACAC
        margin-left: .1rem
    .imgList
      display: flex
      justify-content: flex-start
      flex-direction: row
      flex-flow: wrap
      padding: 0.05rem 0
      li
        flex-basis 100px
        height: 1rem
        text-align center
        img
          width: .72rem
          height: .72rem
  .desc
    display: felx
    align-items: center
    background-color:#fff
    border-top: 1px solid #F7F7F7
    padding: 0.2rem 0.19rem 0 .15rem
    height: .88rem
    p
      font-size: .14rem
      margin: 0
    p:nth-child(2)
      margin-top: .05rem
      color: rgba(102, 102, 102, 1)


</style>
