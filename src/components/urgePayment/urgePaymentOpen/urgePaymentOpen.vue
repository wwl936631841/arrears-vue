<template>
  <div id="urgePaymentOpen">
    <van-nav-bar title="启动催缴" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="address">
        <div class="left">
            <img src="../../../assets/img/urgePaymentOpen/icon_address@2x.png" alt="">
            <span>{{ ruleList.villageName }}</span>

        </div>
    </div>
    <div class="message">
        <div class="msg">
            <div class="rule">
                <div class="left">催缴模板</div>
                <div class="right" v-if="!itemArr.name" @click="please">请选择规则模板 <van-icon name="arrow" /></div>
                <div class="right" v-if="itemArr.name" @click="please">{{itemArr.name}} <van-icon name="arrow" /></div>
                <van-actionsheet v-model="show"  title="请选择规则模板">
                    <div v-for="(item,index) in ruleList.ruleList" :key="index">
                        <p @click="onSelect(index)">{{item.name}}</p>
                    </div>
                </van-actionsheet>
            </div>
            <div class="rule">
                <div class="left">欠费时长</div>
                <div class="right">欠费{{ itemArr.durationRule }}个月起开始催缴</div>
            </div>
            <div class="rule">
                <div class="left">催缴周期</div>
                <div class="right">{{ itemArr.periodRule }}个月</div>
            </div>
            <div class="rule">
                <div class="left">短信催缴</div>
                <div class="right">欠费{{ itemArr.noteRule }}个月起开启短信自动发送催缴</div>
            </div>
            <div class="rule">
                <div class="left">电话催缴</div>
                <div class="right">欠费{{ itemArr.telRule }}个月起开启电话催缴</div>
            </div>
            <div class="rule">
                <div class="left">上门催缴</div>
                <div class="right">欠费{{ itemArr.visitRule }}个月起开启上门催缴</div>
            </div>
            <div class="rule">
                <div class="left">金额规则</div>
                <div class="right">{{ itemArr.moneyRule }}</div>
            </div>
            <div class="rule" v-if="openid">
                <div class="left">状态</div>
                <div class="right statusColor">未启动</div>
            </div>
            <div class="rule" v-if="!openid">
                <div class="left">状态</div>
                <div class="right statusColor">已启动</div>
            </div>
        </div>
    </div>
    <div class="cButton" @click="open" v-show="openid">
        <van-button type="info">启动催缴</van-button>
    </div>
    <!-- <div class="cButton" @click="close" v-show="!openid">
        <van-button type="default">关闭催缴</van-button>
    </div> -->
  </div>
</template>
<script>
import axios from 'axios'
import GetUrlParam from '@/utils/urlParse'
    export default {
        name:'urgePaymentOpen',
        data(){
            return{
                show: false,
                title:"",
                openid:true,
                closeid:false,
                userId:"",
                uptownId:null,
                ruleList:{},
                month:null,
                index:null,
                // 对应模板的数据对象
                itemArr:{},
                // 流程状态
                ProcessStatus:null
            }
        },
        computed: {

        },
        methods:{
            please(){
                this.show=true
            },

            onSelect(index){
                let that = this
                this.show=false
                this.index=index
                console.log(this.index)
                this.itemArr = that.ruleList.ruleList[index]
                console.log(this.itemArr)
            },

            onClickLeft(){
                let fromPhone = GetUrlParam('fromPhone')
                if ((fromPhone == "android") || (fromPhone == "iOS")) {
                    window.location.href = "zjh://close"
                } else if (fromPhone == null) {
                    this.$router.go(-1)
                }
            },

            open(){
                this.$buryPoint('Start-property-reminder')
                console.log(this.itemArr)
                axios.post(
                    this.$envConfigObj.cuiJiaoPath + `/arrears/start`,
                    {
                        "uptownId":localStorage.getItem('uptownId'),
                        "processDefinitionKey":"reminder_arrearage",
                        "month":this.$utils.GetUrlParam('month'),
                        "prid":this.itemArr.prid,
                        "name":this.itemArr.name,
                        "durationRule":this.itemArr.durationRule,
                        "periodRule":this.itemArr.periodRule,
                        "noteRule":this.itemArr.noteRule,
                        "telRule":this.itemArr.telRule,
                        "visitRule":this.itemArr.visitRule,
                        "status":this.itemArr.status,
                        "isAll":this.itemArr.isAll,
                        "moneyRule":this.itemArr.moneyRule,
                        "createTime":this.itemArr.createTime,
                        "isDelete":this.itemArr.isDelete,
                        "updateTime":this.itemArr.updateTime,
                        "startTime":this.itemArr.startTime,
                        "starter":this.$utils.GetUrlParam('userId')
                    }
                ).then(res=>{
                    console.log('2222',res)
                    if(res.data.status==0){
                        this.$toast({
                            message: "已成功开启催缴",
                            position:{
                                bottom:50,
                            },
                        })
                        this.openid=false;
                        this.closeid=true;
                    }else{
                        this.$toast({
                            message: res.data.message,
                            position:{
                                bottom:50,
                            },
                        })
                    }
                })
            },
            // close(){
            //   this.$dialog.confirm({
            //     message: '关闭催缴后，本月不能再次启动催缴，请确认是否关闭催缴'
            //   }).then(() => {
            //     axios.post(
            //       this.$envConfigObj.cuiJiaoPath + `/arrears/stop`,
            //       {
            //         "uptownId":localStorage.getItem('uptownId'),
            //         "processDefinitionKey":"reminder_arrearage",
            //         "month":this.$utils.GetUrlParam('month'),
            //         // "processDefinitionKey":this.itemArr.processDefinitionKey,
            //         "prid":this.itemArr.prid,
            //         "name":this.itemArr.name,
            //         "durationRule":this.itemArr.durationRule,
            //         "periodRule":this.itemArr.periodRule,
            //         "noteRule":this.itemArr.noteRule,
            //         "telRule":this.itemArr.telRule,
            //         "visitRule":this.itemArr.visitRule,
            //         "status":this.itemArr.status,
            //         "isAll":this.itemArr.isAll,
            //         "moneyRule":this.itemArr.moneyRule,
            //         "createTime":this.itemArr.createTime,
            //         "isDelete":this.itemArr.isDelete,
            //         "updateTime":this.itemArr.updateTime,
            //         "startTime":this.itemArr.startTime,
            //         "starter":this.itemArr.starter
            //       }
            //     ).then(res=>{
            //       console.log(res)
            //       if(res.data.status==0){
            //         this.$toast({
            //           message: "已关闭催缴 如需再次催缴需重新启动",
            //           position:{
            //             bottom:50,
            //           },
            //         })
            //         this.openid==true;
            //       }else{
            //         this.$toast({
            //           message: "关闭失败",
            //           position:{
            //             bottom:50,
            //           },
            //         })
            //       }
            //     })
            //   }).catch((err) => {
            //     console.error(err)
            //   });
            // },

            // 催缴任务查询
            getTask(){
                axios.get(
                  this.$envConfigObj.cuiJiaoPath + `/arrears/rule?userId=${this.$utils.GetUrlParam('userId')}&uptownId=${localStorage.getItem('uptownId')}`,

                ).then(res=>{
                    
                    console.log(res)
                    if(res.data.data){
                        this.ruleList = res.data.data
                        this.itemArr = this.ruleList.ruleList[0]
                        console.log(this.ruleList)
                    }

                })
            },

            // 获取流程状态
            getStatus(){
                axios.get(
                  this.$envConfigObj.cuiJiaoPath + `/arrears/queryStatusByUptownId?month=${this.$utils.GetUrlParam('month')}&uptownId=${this.$utils.GetUrlParam('village_id')} `
                ).then(res=>{
                    console.log('11',res.data.data)
                    if(res.data.data==1){
                        this.openid=false
                    }
                })
            }
        },

        created() {
            this.getStatus()
            localStorage.setItem('uptownId', this.$utils.GetUrlParam('village_id'))
            this.getTask()
            var uid = GetUrlParam('uid');
            this.userId = this.$utils.GetUrlParam('userId')
            console.log(this.userId)

        }
    }
</script>
<style lang="stylus" scoped>
    #urgePaymentOpen{
        background-color:#F5F5F5;
        height: 100%;
        .van-nav-bar__title {
            font-size: 17px;
            font-weight: 700;
        }
        .van-nav-bar__arrow {
            font-size: 20px;
            color: #666666;
            font-weight: 600;
        }
        .address{
            width: 100%;
            height: 44px;
            line-height: 44px;
            position: relative;
            border-bottom: 1px solid #ebebeb;
            background-color #fff

            .left{
                display :flex;
                align-items center
                img{
                    width: 16px;
                    height: 17px;
                    padding:0 5px 0 13px;
                }

                span{
                    font-size: 15px;
                    color: #444;
                }
            }

            .right{
                // position: absolute;
                // top: 0;
                // right: .12rem;
                position: absolute;
                top: 0;
                right: .12rem;
                height: .44rem;
                display: flex;
                align-items: center;

                .van-icon-arrow{
                    font-size: 11px;
                    color: #bbb;
                }
            }
        }
        .cButton{
            position: fixed;
            bottom: 0;
            width: 100%;
            height 44px
            button{
                width: 100%;
                position absolute
                top 0px
            }
            .van-button--default{
                border none
                .van-button__text{
                    color #268AED;
                }
            }
        }

        .message {

            .msg{
                background-color #fff
                .rule{
                    height 44px
                    border-bottom 1px solid #eee
                    font-size .14rem
                    color #666
                    padding 0 .12rem
                    display flex
                    justify-content space-between
                    // align-items center
                    line-height 44px
                    .right{
                        color #333
                        .van-icon{
                            font-size 12px;
                        }
                        &.statusColor {
                            color: #268AED;
                            font-size: 14px;

                        }
                    }
                    p{
                        margin 0
                        text-align center
                    }
                }
                // .van-cell__title{
                //     flex: 1;
                //     font-size: 14px;
                //     color: #666;
                // }
                // .van-cell__value{
                //     flex:2;
                //     color: #333;
                //     text-overflow: ellipsis;
                //     overflow: hidden;
                //     white-space: nowrap;
                // }


            }
        }

    }

</style>
