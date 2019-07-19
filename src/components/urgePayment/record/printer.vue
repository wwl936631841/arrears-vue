<template>
    <div id="print">
        <v-nav-bar :title="title"/>
        <div class="content">
            <p>催收函发送到您邮箱</p>
            <div>
                <div class="bottom">
                    <p>邮箱地址:</p>
                    <input type="text" v-model="value" placeholder="example@.xxx.com">
                </div>
                <div class="send" @click="gosSendEmail">
                    <button>发送</button>
                </div>
                <div class="top">
                    <p>
                      <span>或分享至微信</span>
                    </p>
                    <img src="../../../assets/img/record/icon_wechat@2x.png" @click="share" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import wx from 'weixin-js-sdk';
export default {
    name:"printer",
    data(){
        return{
            title:"打印",
            value:'',
            arrearsId:null,
            WXshareObj: {},
            weixinObj: null,
        }
    },
    methods: {
        gosSendEmail(){
            this.$buryPoint('print-send')
            let that = this
            axios.post(this.$envConfigObj.cuiJiaoPath + `/arrears/notice/sendEmail`,{
                arrearsId:that.arrearsId,
                fileName: "notice.pdf",
                mailSubject: "催缴通知测试",
                mailText: "催缴测试内容",
                sendPerson:[
                    that.value
                ],
                userId:localStorage.getItem('userId')
            }).then(res=>{
                console.log(res.data.status)
                if(res.data.status === 0){
                    that.$router.push({
                        name:"sendEmail",
                        params:that.$route.params
                    })
                }
            })
        },

        getparams(){
            this.arrearsId = this.$route.params.arrearsId
            
        },

        share(){
            this.$buryPoint('reminder-wx-share')
            let imgUrl = require('../../../assets/img/urgePayment/zfc@2x.png')
            console.log(imgUrl)
            let lineLink = this.weixinObj
            let shareTitle = "催收函"
            let descContent = "催收函"

            wx.config({
            debug: true,    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: this.WXshareObj.appid,   // 必填，公众号的唯一标识
            timestamp: this.WXshareObj.timestamp,  // 必填，生成签名的时间戳
            nonceStr: this.WXshareObj.nonceStr,  // 必填，生成签名的随机串
            signature: this.WXshareObj.signature,  // 必填，签名
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']  // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
                title: shareTitle, // 分享标题
                link: lineLink,
                imgUrl: imgUrl // 分享图标
            });
            // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
            wx.onMenuShareAppMessage({
                title: shareTitle, // 分享标题
                desc: descContent, // 分享描述
                link: lineLink,
                imgUrl: imgUrl, // 分享图标
                type: 'link' // 分享类型,music、video或link，不填默认为link
            });

            wx.onMenuShareWeibo({
                title: shareTitle, // 分享标题
                desc: descContent, // 分享描述
                link: lineLink, // 分享链接
                imgUrl: imgUrl// 分享图标

            });
            wx.onMenuShareQZone({
                title: shareTitle, // 分享标题
                desc: descContent, // 分享描述
                link: lineLink, // 分享链接
                imgUrl: imgUrl // 分享图标
            });
                window.location.href = `zjh://?action=shareToWechat&jump_url=` + lineLink + `&title=` + shareTitle + `&description=` + descContent + `&imageUrl=`
            });
        },

        getQrcode(){
            let that = this
            axios.post(this.$envConfigObj.cuiJiaoPath + `/arrears/notice/getShareQrCodeAddr/${localStorage.getItem('userId')}/${that.arrearsId}`,{
                arrearsId:that.arrearsId,
                userId:localStorage.getItem('userId')
            }).then(res=>{
                console.log(res.data.data)
                this.weixinObj = res.data.data
            })
        },

        getWxConfig() {
            let that = this
                axios.get(this.$envConfigObj.wxConfig).then(function (res) {
            if (res.data.errorCode == 0) {
                that.WXshareObj = res.data.data
                console.log(that.WXshareObj)
            }
            }).catch((e) => {
                console.log('========= wx share err ===========')
                console.log(e)
            })
        }
    },
    watch: {
        '$route':'getparams'
    },
    created() {
        this.getparams(),
        this.getWxConfig(),
        this.getQrcode()
    },
}
</script>
<style lang="stylus" scoped>
#print{
    background-color #f5f5f5
    height 100%
    .content{
        p{
            color #444
            font-size .16rem
            font-weight bold
            padding 0 .1rem
        }
        >div{
            // padding .2rem
            // border 1px solid #eee
            margin .1rem
            height 3rem
            position relative
            .top{
                text-align center
                display flex
                flex-direction column
                align-items center
                p{
                    width 100%
                    span{
                        background-color #f5f5f5
                        padding: 0 18px 0 18px;
                        position: relative;
                        font-size: .14rem;
                        color #313131
                    }
                }
                p:before{
                    content: '';
                    display: block;
                    height: 1px;
                    width: 100%;
                    background-color: #ddd;
                    position: relative;
                    top: 10px;
                    left: 0;
                }
                img{
                    margin-right .05rem
                    width .48rem
                    height .48rem
                }
                // button{
                //     outline none
                //     border 1px solid #f10215
                //     background-color #fff
                //     font-size .14rem
                //     color #f10215
                //     padding .03rem .05rem
                // }
            }
            .bottom{
                background-color #fff
                display flex
                height .46rem
                align-items center 
                padding 0 .12rem
                p{
                    font-size .14rem
                    color #444
                    padding 0
                    margin .1rem 0
                }
                input{
                    flex 1
                    height .36rem
                    font-size .14rem
                    border: none;
                    text-align: right;
                }
            }
            .send{
                width 3.56rem
                height .45rem
                display flex
                justify-content center
                margin-top .15rem
                // position absolute
                // bottom .6rem
                button{
                    border none
                    background-color #268AED
                    border-radius .05rem
                    line-height .45rem
                    font-size .16rem
                    width 100%
                    color #fff
                }
            }
        }
    }
}
</style>

