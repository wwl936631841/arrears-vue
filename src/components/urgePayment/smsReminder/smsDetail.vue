<template>
    <div id="smsDetail">
        <van-nav-bar
            class="smsDetailTitle"
            title="短信催缴"
            left-text=""
            right-text="催缴记录"
            left-arrow
            @click-left="onClickLeft"
            @click-right="onClickRight(itemObject.customPhone)"
        />
        <div>
            <div class="smsDetail">
                <div class="status">
                    <div class="left">
                        <span class="customName">{{ itemObject.customName}}</span>
                        <div class="followStatus" v-hasBtn @click="toggle">
                            <span class="yes" v-if="itemObject.isFollow">
                                <img src="../../../assets/img/urgePayment/icon_unfollow@2x.png" alt="">已关注
                            </span>
                            <span class="no" v-if="!itemObject.isFollow">
                                + 关注
                            </span>
                        </div>
                    </div>
                    <div class="right">
                        <span class="yes" v-show="itemObject.payStatus">已支付</span>
                        <span class="no" v-show="!itemObject.payStatus">未支付</span>
                    </div>
                </div>
                <div class="price">
                    <div class="left">
                        <span>{{itemObject.arrearageMoney}}元</span>
                        <i>逾期{{itemObject.arrearageTime}}天</i>
                    </div>
                    <div class="right">
                        <div class="success" v-show="hasSmsSend==1">
                            <img src="../../../assets/img/sms/icon_success.png" alt="">
                            <span>等待发送</span>
                        </div>
                        <div class="success" v-show="hasSmsSend==2">
                            <img src="../../../assets/img/sms/icon_success.png" alt="">
                            <span>发送成功</span>
                        </div>
                        <div class="failed" v-show="hasSmsSend==3">
                            <img src="../../../assets/img/sms/icon_fail@2x.png" alt="">
                            <span>发送失败</span>
                        </div>
                    </div>
                </div>

                <div class="add">
                    <div class="left">
                        <img src="../../../assets/img/sms/location@2x.png" alt="">
                        <span>{{ itemObject.uptownName }} {{itemObject.unitNumber}}</span>
                    </div>
                </div>
            </div>
            <div class="list">
                <van-cell>
                    <template slot="title">
                        <span class="custom-text">{{itemObject.customName}}</span>
                        <van-tag color="#268AED" plain>业主</van-tag>
                    </template>
                </van-cell>
                <van-cell title="最新入场时间" v-show="itemObject.latestAdmissionTime==null" :value="itemObject.latestAdmissionTime" />
                <van-cell title="最新入场时间" v-show="itemObject.latestAdmissionTime!=null"  :value="itemObject.latestAdmissionTime | moment('YYYY-MM-DD HH:mm')" />
                <van-cell title="今天门禁刷卡次数" :value="itemObject.creditsNumber" />
                <van-cell title="今天停车场进出次数" :value="itemObject.parkTime" />
                <!-- <van-cell title="今天停车场进出次数" :value="itemObject.parkTime+'次'" /> -->

            </div>
            <div class="call">
                <div>
                    <div class="left">
                        <span>{{itemObject.customName}}</span><span>( 业主 )</span>
                    </div>
                    <div class="right">
                        <span class="phone">
                            <img src="../../../assets/img/urgePayment/icon_call@2x.png" width="21" height="21" @click="call" v-hasBtn>
                        </span>
                    </div>
                </div>
                <div style="margin-top:0" v-for="(item,index) in itemObject.voSet" :key="index">
                    <div class="left">
                        <span>{{item.user_info}}</span><span>( 家属 )</span>
                    </div>
                    <div class="right">
                        <span class="phone">
                            <img src="../../../assets/img/urgePayment/icon_call@2x.png" width="21" height="21" @click="call" v-hasBtn>
                        </span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
// import {cuiJiaoPath} from '../../../api/env'
import axios from 'axios'
import GetUrlParam from '@/utils/urlParse'

export default {
    name:"smsDetail",
    data(){
        return{
            // customType:"" , // 业主类型: 1业主
            taskId:"",
            houseId:"",
            arrearType:"",
            hasSmsSend:"",
            itemObject:{}
        }
    },
    
    created () {
        let self = this
        self.getParams()
        // 获取短信催缴详情
        this.getSmsReminderDetails();

    },

    watch : {
        '$route': 'getParams'
    },

    methods: {
        // 获取query参数
        getParams () {
            this.taskId = this.$route.query.taskId
            this.houseId = this.$route.query.houseId
            this.arrearType = this.$route.query.arrearType
            this.hasSmsSend = this.$route.query.hasSmsSend
        },

        onClickLeft(){
            this.$router.go(-1)
        },

        // 催缴记录页跳转
        onClickRight(customPhone){
            this.$router.push({
                name:"recordReminder",
                query:{
                    phone:customPhone
                }
            })
        },

        // 添加关注
        addFollow() {
            let that = this
            that.$buryPoint('attention')
            axios.post(this.$envConfigObj.cuiJiaoPath + '/attention/addFollow', {
            ownId: localStorage.getItem('userId'),
            customPhone: this.itemObject.customPhone,
            houseId: this.itemObject.houseId,
            customType: 1,
            customAddress: this.itemObject.uptownName + this.itemObject.unitNumber + this.itemObject.houseName,
            customName: this.itemObject.customName,
            }).then(function (res) {
                console.log('关注')
            })
        },

        // 取消关注
        cancelFollow() {
            let that = this
            that.$buryPoint('Remove-attention')
            axios.get(`${this.$envConfigObj.cuiJiaoPath}/attention/cancelFollow/${localStorage.getItem('userId')}/${this.itemObject.houseId}`).then(function (res) {
                console.log('取消关注')
            })
        },

        // 切换关注状态
        toggle(){
            if(this.itemObject.isFollow==true){
                this.itemObject.isFollow=false;
                this.cancelFollow();
                this.$toast({
                    message: "已取消关注",
                    position:{
                        bottom:50,
                    },
                })
            }else{
                this.itemObject.isFollow=true
                this.addFollow();
                this.$toast({
                    message: "关注成功",
                    position:{
                        bottom:50,
                    },
                })
            }
        },

        // 获取短信催缴详情
        getSmsReminderDetails(){
            let that = this
            axios.get(
              this.$envConfigObj.cuiJiaoPath+`/arrears/home/details/${that.taskId}/${that.houseId}/${that.arrearType}`
            ).then(res=>{
                that.itemObject = res.data.data
            }).catch(err=>{
                console.log(err)
            })
        },

        // 拨打电话
        call() {
            let that = this
            that.$buryPoint('call-icon')
            if (this.itemObject.customPhone == '') {
            this.$toast({
                message: "该用户未录入电话",
            })
            }
            axios.post(this.$envConfigObj.cuiJiaoPath + '/arrears/phone/insertDial', {
                taskDetailId: this.itemObject.taskId,
                ownerId: localStorage.getItem('userId'),
                telUser: this.itemObject.customName,
                telPhone: this.itemObject.customPhone,
            }).then((res) => {
            if (res.data.status == 0) {
                window.location.href = 'tel:' + this.itemObject.customPhone
            }
            })
        },
    }
}
</script>
<style lang="stylus" scoped>
    #smsDetail{
        height 100%
        background-color #F5F5F5
        .smsDetailTitle{
            height .43rem;
            line-height .43rem
            .van-nav-bar__left{
                padding-left .15rem
                left 0
                .van-icon-arrow-left{
                    font-size .20rem
                    color #333
                }
            }
            .van-nav-bar__title{
                font-size .18rem
                color #333
            }
            .van-nav-bar__right{
                font-size .15rem
                color #268AED
            }
        }
        .smsDetail{
            margin-top 5px;
            background-color #fff
            padding .14rem .17rem .13rem .2rem;
            box-sizing: border-box;
            .status{
                display flex;
                height .34rem;
                justify-content: space-between;
                .left{
                    display: flex;
                    .customName{
                        text-overflow ellipsis
                        overflow hidden
                        white-space nowrap
                        max-width 1.6rem
                        font-size .17rem;
                        color #333
                    }
                    .followStatus{
                        width .56rem;
                        height .24rem;
                        position relative;
                        line-height .24rem;
                        text-align center;
                        margin-left .08rem
                        .yes,.no{
                            font-size .12rem;
                            position: absolute;
                            width: 100%;
                            left: 0;
                        }
                        .yes{
                            border 1px solid #ccc;
                            border-radius .04rem;
                            color #444;
                            img{
                                width .1rem
                            }
                        }
                        .no{
                            border 1px solid #268AED;
                            border-radius .04rem;
                            color #268AED;
                        }
                    }
                }
                .right{
                    font-size .14rem;
                    .yes{
                        color #444
                    }
                    .no{
                        color #268AED
                    }
                }
            }
            .price{
                display flex;
                justify-content space-between
                .left{
                    display flex
                    height .22rem;
                    line-height .22rem;
                    span{
                        color #268AED;
                        font-size .16rem;
                    }
                    i{
                        font-size: 0.1rem;
                        color: #4c5f6c;
                        font-style: normal;
                        border: 1px solid #ddd;
                        border-radius: 3px;
                        background-color: #ddd;
                        line-height: .16rem;
                        height: .14rem;
                        margin-left: 0.05rem;
                        margin-top: 0.03rem;
                    }
                }
                .right{
                    .success,.failed{
                        font-size .14rem;
                        display: flex;
                        align-items: center;
                        img{
                            width .16rem;
                            height .16rem;
                            margin-right: .03rem;
                        }
                    }
                }
            }

            .add{
                display flex;
                justify-content : space-between;
                padding-top .08rem;
                .left{
                    font-size .12rem;
                    // max-width 2.23rem;
                    img{
                        width .12rem;
                        height .15rem;
                        vertical-align: middle;
                    }
                }
            }
        }
        .list{
            margin-top 12px;
            .van-cell__title{
                flex: 1;
                font-size: 14px;
                color: #666;
                .custom-text{
                    font-family:PingFangSC-Medium;
                    color #444;
                    font-size .14rem
                }
                .van-tag{
                    height: .14rem;
                    line-height: .14rem;
                    padding .01rem .04rem;
                }
            }
            .van-cell__value{
                color: #333;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        .call{
            >div{
                margin-top 9px;
                display flex;
                justify-content: space-between;
                background-color #ffffff
                line-height .44rem
                height .44rem
                border-bottom: 1px solid #ebebeb;
                .left{
                    color #444
                    font-size .14rem
                    padding-left .19rem
                    span:nth-child(1){
                        margin-right 5px;
                    }
                }
                .right{
                    padding-right: .17rem;
                    .phone{
                        float right
                        width .21rem
                        height .21rem
                        border-radius .04rem;
                        text-align center
                        margin-top: .11rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .van-icon-phone{
                            font-size .14rem
                            color #268AED
                        }
                    }
                }
            }
        }
    }
</style>
