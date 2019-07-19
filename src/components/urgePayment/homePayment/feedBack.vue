<template>
  <div id="feedBack">
    <van-nav-bar
      class="feedBackTitle"
      title="上门反馈"
      left-arrow
      @click-left="onClickLeft"
    />
    <item :itemObj="obj" :isVisit='true' @billDetail="billDetails"></item>
    <div class="select">
      <ul class="status">
        <li>
          <p>是否在家</p>
          <p @click="setHomeStatus">
            <span v-if="isInHome === 1">在家</span> <!-- 动态文字 -->
            <span v-else>不在家</span> <!-- 动态文字 -->
            <van-icon name="arrow"/>
          </p>
        </li>
        <li>
          <p>是否成功催缴</p>
          <p @click="setSuccessStatus">
            <span v-if="isArrearSuccess === 1">成功</span>    <!-- 动态文字 -->
            <span v-else>失败</span>    <!-- 动态文字 -->
            <van-icon name="arrow"/>
          </p>
        </li>
      </ul>
      <div class="photo">
        <p>
          上传图片<span>( 最多6张 )</span>
        </p>
        <ul>
          <li v-for="(item,idx) in imgArr" :key="idx">
            <img :src="item.content" alt="" width="100%" height="100%"/>
            <div class="deleteImg" @click="deleteImg(idx)">
              <img src="../../../assets/svg/delete.svg" alt=""/>
            </div>
          </li>
          <li>
            <van-uploader :after-read="onRead" :multiple="false">
              <img src="../../../assets/img/urgePayment/icon_pic@2x.png" alt="" width="36" height="30"/>
            </van-uploader>
          </li>
        </ul>
        <p>
          <span>( 建议上传催收函与门牌号等凭证 )</span>
        </p>
      </div>
      <div class="textarea">
        <h4>催缴说明</h4>
        <van-field
          @input="countLength"
          v-model="message"
          type="textarea"
          placeholder="催缴情况说明，不超过100字"
          rows="4"
          autosize
        />
        <p>
          <span ref="warning">{{this.message.length}}</span>
          <span>/100</span>
        </p>
      </div>
    </div>
    <div class="btnContainer">
      <div class="btn">
        <van-button size="large" type="info" @click="submitFeedBack">提交</van-button>
      </div>
    </div>
    <van-actionsheet v-model="homeShow" :actions="homeStatusArr" cancel-text="取消" @select="onSelectHome"
                     @cancel="onHomeCancel"></van-actionsheet>
    <van-actionsheet v-model="successShow" :actions="successStatusArr" cancel-text="取消" @select="onSelectSuccess"
                     @cancel="onSuccessCancel"></van-actionsheet>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import axios from 'axios'
  import item from '../common/item'

  export default {
    name: "feedBack",   // 上门反馈
    data() {
      return {
        homeShow: false,
        houseId:null,
        successShow: false, //
        count: '', // 字数
        imgArr: [],
        uploadImgArr: [],
        message: '', // 催缴说明
        obj:{},
        homeStatusArr: [
          {
            name: '在家',
          },
          {
            name: '不在家',
          }
        ],
        successStatusArr: [
          {
            name: '成功',
          }, {
            name: '失败',
          }
        ],
        isInHome: 1,  //  1:在家，  2不在家
        isArrearSuccess: 1,  // 是否催缴成功1：成功，2：失败
      }
    },
    components: {
      item
    },
    methods: {
      billDetails(){
          this.$buryPoint('bill-details')
          axios.get(`${this.$envConfigObj.houseId}?cottage_id=${this.obj.houseId}`).then(res=>{
              if(res.data.errorCode == 0){
                  const getHouseId = res.data.data.list.FWID
                  let url = `zjh://?action=billDetail&house_id=${getHouseId}&customer_mobilephone=${this.obj.customPhone}&customer_id=${this.obj.customId}&village_id=${this.obj.uptownId}&customer_name=${this.obj.customName}&address=${this.obj.uptownName}${this.obj.unitNumber}${this.obj.houseName}`
                  console.log('url',url)
                  window.location.href = url
              }
          })
      },

      onClickLeft(){
        this.$router.go(-1)
      },

      countLength() {
        let len = this.message.length
        if (len > 100) {
          this.message = this.message.substring(0, 99)
          this.$refs.warning.style.color = 'red'
        }
      },

      deleteImg(index) {
        this.imgArr.splice(index, 1)
      },

      goBack() {
        this.$router.go(-1)
      },

      onSelect() {
        this.show = false;
        Toast(item.name);
      },

      setHomeStatus() {
        this.homeShow = true
      },

      setSuccessStatus() {
        this.successShow = true
      },

      onSelectHome(item, index) {
        this.isInHome = index + 1
        this.homeShow = false
      },

      onSelectSuccess(val, index) {
        this.isArrearSuccess = index + 1
        this.successShow = false
      },

      onHomeCancel() {
        this.homeShow = false
      },

      onSuccessCancel() {
        this.successShow = false
      },

      onRead(file) {
        if (this.imgArr.length < 6) {
          this.imgArr.push(file)           // 图片渲染
          this.Base64ToBlob(file)     // 图片上传
        } else {
          Toast({
            type: 'fail',
            message: '最多上传6个'
          })
        }
      },

      submitFeedBack() {  //    /arrears/home/submitFeedback
        let params = {
          arrearId: this.arrearId,
          isArrearSuccess: this.isArrearSuccess,
          imgAddress: this.uploadImgArr,
          isInHome: this.isInHome,   // 在家
          ownerId: this.$store.state.conditionParam.ownId,
          taskId: this.taskId,
          houseId: this.houseId,
          arrearDescription: this.message    // desc
        }
        axios.post(this.$envConfigObj.cuiJiaoPath + '/arrears/home/submitFeedback', params).then((res) => {
          if (res.data.status == 0) {
            // this.$router.push({
            //   name: "arrearsRecord",
            //   params: {
            //     taskId: this.taskId,
            //     houseId:this.houseId
            //   }
            // })
            this.$router.go(-1)
          }
        })
      },

      Base64ToBlob(file) {  // base64Data
        let binaryString = window.atob(file.content.split(',')[1]);
        let arrayBuffer = new ArrayBuffer(binaryString.length);
        let intArray = new Uint8Array(arrayBuffer);

        for (let i = 0, j = binaryString.length; i < j; i++) {
          intArray[i] = binaryString.charCodeAt(i);
        }
        let data = [intArray];
        let blob;
        try {
          blob = new Blob(data, {
            type: file.file.type
          });
        } catch (error) {
          window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
          if (error.name === 'TypeError' && window.BlobBuilder) {
            let builder = new BlobBuilder();
            builder.append(arrayBuffer);
            blob = builder.getBlob(file.file.type);
          } else {
            throw new Error('版本过低，不支持上传图片');
          }
        }
        let formData = new FormData();
        formData.append("file", blob, file.file.name)
        this.uploadImg(formData)
      },

      uploadImg(formData) {
       const imgUpLoad =  Toast.loading({
          mask: true,
          message: '图片上传中...'
        });
        let that = this
        console.log(formData.get('file').name)
        axios.post(`${this.$envConfigObj.cuiJiaoPath}/arrears/home/img/upload?userId=${localStorage.getItem('userId')}`, formData).then((res) => {
          if (res.data.status == 0) {
            imgUpLoad.clear()
            Toast({
              type: 'success',
              message: '上传成功',
              duration: '700'
            })
            console.log('图片上传的结果')
            console.log(res.data.data)
            that.uploadImgArr.push(res.data.data[0])
          }
        })
      }
    },
    created() {
      this.taskId = this.$route.params.taskId
      this.arrearId = this.$route.params.arrearId
      this.obj = this.$route.params
      this.houseId = this.$route.params.houseId
      console.log('obj',this.obj)
    }
  }
</script>

<style scoped lang="stylus">
  #feedBack
    height 100%
    background #f5f5f5
    overflow: auto;
    .feedBackTitle
      height .43rem
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
    .header
      display: flex
      justify-content: center
      height: .63rem
      border-bottom: 1px solid rgba(235, 235, 235, 1)

      .backImg
        position: absolute
        left: 0.15rem
        top: -.3rem

      .title
        font-size: 0.18rem
        color: rgba(51, 51, 51, 1)

    .select
      height: 65vh;
      overflow: auto;
      background #ffffff
      margin-top .1rem
      ul.status
        li
          display: flex
          height: .44rem
          padding: 0 .15rem
          border-bottom: 2px solid rgba(247, 247, 247, 1)

          p
            font-size: .14rem
            color: rgba(68, 68, 68, 1)
            flex: 1

            i
              font-size: .14rem
              position: relative
              top: 0.02rem

          p:nth-child(2)
            text-align: right

      .photo
        border-bottom: 1px solid rgba(247, 247, 247, 1)
        padding-bottom: .1rem

        p
          font-size: .14rem
          margin-left: .14rem

          span
            font-size: .12rem
            color: rgba(153, 153, 153, 1)
            margin-left: 8px

        .van-uploader
          width: .72rem
          height: .72rem
          border: 2px solid rgba(247, 247, 247, 1)
          display: flex
          justify-content: center
          align-items: center

        ul
          display: flex
          justify-content: flex-start
          flex-direction: row
          flex-flow: wrap
          padding: 0.05rem .1rem

          li
            display: flex
            padding: 0 0.07rem
            /*border: 1px solid blue*/
            width: .72rem
            height: .72rem
            margin-top: 0.08rem

            .deleteImg
              position: relative

              img
                position: absolute
                left: -0.1rem
                top: -0.05rem
                width: .16rem
                height: .16rem

      .textarea
        padding: 0.05rem .1rem
        margin-top: .1rem
        margin-bottom: .25rem
        /*border: 1px solid red*/
        font-size: .14rem

        p
          margin-top: 4px
          font-size: .12rem
          text-align: right

        .van-cell
          padding: 0
          border: 1px solid rgba(247, 247, 247, 1)

          .van-cell__value
            .van-field__body
              textarea
                padding: 5px
                border: 1px solid red

    .btnContainer
      height: .44rem
      position:fixed
      bottom 0
      width 100%
      /*border: 1px solid red*/
      background-color: rgba(247, 247, 247, 1)

      .btn
        position: absolute
        height .44rem
        top: 0
        width: 100vw
        display flex
        .van-button{
          height  .44rem
          line-height .44rem
        }
</style>
<style lang="stylus">
  #feedBack
    .textarea
      .van-cell
        .van-cell__value
          .van-field__body
            textarea
              padding: 5px
</style>
