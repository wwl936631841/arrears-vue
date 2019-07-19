<template>
    <div id="phoneDetail">
        <v-nav-bar style="position:relative" :title="title">
            <img src="../../../assets/img/phoneDetail/img/more@2x.png" @click="sOrH" class="options"/>
            <div class="showOrHide" v-show="showOrHide">
                <div class="top"></div>
                <ul class="bottom">
                    <li @click="phoneRecord(phoneObject.taskId)">电话拨打记录</li>
                    <li @click="phoneBack(phoneObject.taskId)">电话反馈记录</li>
                </ul>
            </div>
        </v-nav-bar>
        <div class="smsDetail">
            <div class="status">
                <div class="left">
                    <span class="customName">{{ phoneObject.customName }}</span>
                    <div class="followStatus" v-hasBtn @click="toggle">
                        <span class="yes" v-if="phoneObject.isFollow">
                            <img src="../../../assets/img/urgePayment/icon_unfollow@2x.png" alt="">已关注
                        </span>
                        <span class="no" v-if="!phoneObject.isFollow">
                            + 关注
                        </span>
                    </div>
                    <div class="rightPhone">
                        <span class="phone">
                            <img src="../../../assets/img/urgePayment/icon_call@2x.png" width="24" height="24" @click="call" v-hasBtn>
                        </span>
                    </div>
                </div>
                <div class="right">
                    <span class="yes" v-show="phoneObject.payStatus">已支付</span>
                    <span class="no" v-show="!phoneObject.payStatus">未支付</span>
                </div>
            </div>
            <div class="price">
                <div class="left">
                    <span>￥{{ phoneObject.arrearageMoney }}元</span>
                    <div style="display: flex;">
                        <i style="position:relative">
                            <em class="jiantou"></em>
                            逾期{{ phoneObject.arrearageTime }}天
                        </i>
                    </div>
                </div>
                <div class="right">
                    <div class="success">
                        <img src="../../../assets/img/record/icon_total2@2x.png" alt="">
                        <span @click="billDetails">账单详情</span>
                    </div>
                </div>
            </div>

            <div class="add">
                <div class="left">
                    <img src="../../../assets/img/sms/location@2x.png" alt="">
                    <span>{{ phoneObject.uptownName }} {{ phoneObject.unitNumber }}</span>
                </div>
            </div>
        </div>
        <div class="list">
            <van-cell>
                <template slot="title">
                    <span class="custom-text">{{ phoneObject.customName }}</span>
                    <van-tag color="#268AED" plain>业主</van-tag>
                </template>
            </van-cell>
            <van-cell title="最新入场时间" v-show="phoneObject.latestAdmissionTime==null" :value="phoneObject.latestAdmissionTime" />
            <van-cell title="最新入场时间" v-show="phoneObject.latestAdmissionTime!=null" :value="phoneObject.latestAdmissionTime | moment('YYYY-MM-DD HH:mm')" />
            <van-cell title="今天门禁刷卡次数" :value="phoneObject.creditsNumber" />
            <van-cell title="今天停车场进出次数" :value="phoneObject.parkTime" />
            <van-cell title="本月拨打电话次数" :value="phoneObject.localMonthArrearsCount" />
            <van-cell title="本月拨通电话次数" :value="phoneObject.localMonthSuccessArrearsCount" />
            <!-- <div class="tip">
                <div class="left">
                    <img src="../../../assets/img/sms/tips@2x.png" alt="">
                    <span>建议方案</span>
                </div>
                <div class="right">

                    <span>{{ phoneObject.proposal }}</span>
                </div>
            </div> -->
        </div>
        <div class="call">
            <div>
                <div class="left">
                    <span>{{ phoneObject.customName }}</span><span>( 业主 )</span>
                </div>
                <div class="right">
                    <span class="phone">
                        <img src="../../../assets/img/urgePayment/icon_call@2x.png" width="21" height="21" @click="call" v-hasBtn>
                    </span>
                </div>
            </div>
            <div v-for="(item,index) in phoneObject.voSet" :key="index" >
                <div class="left">
                    <span>{{ item.user_info }}}</span><span>( 家属 )</span>
                </div>
                <div class="right">
                    <span class="phone">
                        <img src="../../../assets/img/urgePayment/icon_call@2x.png" width="21" height="21" @click="call" v-hasBtn>
                    </span>
                </div>
            </div>
        </div>
        <div class="phoneBack" @click="record(phoneObject)">
            <van-button type="info" v-hasBtn>电话反馈</van-button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:"phoneDetail",
    data(){
        return{
            title:"催缴详情",
            showOrHide:false,
            houseId:"",
            arrearType:"",
            phoneObject:{},
        }
    },
    created () {
        let self = this
        self.getParams()
        self.getPhoneReminderDetails()
    },
    mounted() {

    },
    watch : {
        '$route': 'getParams'
    },
    methods: {
        // 电话记录和反馈按钮显示与隐藏
        sOrH(){
            if(this.showOrHide){
                this.showOrHide=false;
            }else{
                this.showOrHide=true
            }
        },

        back(){
            console.log(111222)
            let fromPhone = GetUrlParam('fromPhone')
            if ((fromPhone == "android") || (fromPhone == "iOS")) {
                window.location.href = "zjh://close"
            } else if (fromPhone == null) {
                this.$router.go(-1)
            }
        },

        // 拨打电话
        call() {
            let that = this
            that.$buryPoint('call-icon')
            if (this.phoneObject.customPhone == '') {
            this.$toast({
                message: "该用户未录入电话",
            })
            }
            axios.post(this.$envConfigObj.cuiJiaoPath + '/arrears/phone/insertDial', {
                taskDetailId: this.phoneObject.taskId,
                ownerId: localStorage.getItem('userId'),
                houseId: this.phoneObject.houseId,
                arrearId:this.phoneObject.arrearId,
                telUser: this.phoneObject.customName,
                telPhone: this.phoneObject.customPhone,
            }).then((res) => {
            if (res.data.status == 0) {
                window.location.href = 'tel:' + this.phoneObject.customPhone
            }
            })
        },

        // 跳转电话记录页
        phoneRecord(taskDetailId){
            this.$router.push({
                name:"phoneRecord",
                query:{
                    taskDetailId:this.taskId,
                    houseId:this.phoneObject.houseId
                }
            })
        },

        // 跳转电话反馈记录页
        phoneBack(taskId){
            this.$router.push({
                name:"phoneBackRecord",
                query:{
                    taskId:this.taskId,
                    houseId:this.phoneObject.houseId
                }
            })
        },

        billDetails(){
            this.$buryPoint('bill-details')
            axios.get(`${this.$envConfigObj.houseId}?cottage_id=${this.phoneObject.houseId}`).then(res=>{
                if(res.data.errorCode == 0){
                    const getHouseId = res.data.data.list.FWID
                    let url = `zjh://?action=billDetail&house_id=${getHouseId}&customer_mobilephone=${this.phoneObject.customPhone}&customer_id=${this.phoneObject.customId}&village_id=${this.phoneObject.uptownId}&customer_name=${this.phoneObject.customName}&address=${this.phoneObject.uptownName}${this.phoneObject.unitNumber}${this.phoneObject.houseName}`
                    console.log('url',url)
                    window.location.href = url
                }
            })
        },

        getParams () {
            this.taskId = this.$route.query.taskId
            console.log(this.taskId)
            this.houseId = this.$route.query.houseId
            this.arrearType = this.$route.query.arrearType

        },
        
        // 添加关注
        addFollow() {
            let that = this
            that.$buryPoint('attention')
            axios.post(this.$envConfigObj.cuiJiaoPath + '/attention/addFollow', {
            ownId: localStorage.getItem('userId'),
            customPhone: this.phoneObject.customPhone,
            houseId: this.phoneObject.houseId,
            customType: 1,
            customAddress: this.phoneObject.uptownName + this.phoneObject.unitNumber + this.phoneObject.houseName,
            customName: this.phoneObject.customName,
            }).then(function (res) {
                console.log('关注')
            })
        },

        // 取消关注
        cancelFollow() {
            let that = this
            that.$buryPoint('Remove-attention')
            axios.get(`${this.$envConfigObj.cuiJiaoPath}/attention/cancelFollow/${localStorage.getItem('userId')}/${this.phoneObject.houseId}`).then(function (res) {
                console.log('取消关注')
            })
        },

        // 切换关注状态
        toggle(){

            if(this.phoneObject.isFollow==true){
                this.phoneObject.isFollow=false;
                this.cancelFollow();
                this.$toast({
                    message: "已取消关注",
                    position:{
                        bottom:50,
                    },
                })
            }else{
                this.phoneObject.isFollow=true
                this.addFollow();
                this.$toast({
                    message: "关注成功",
                    position:{
                        bottom:50,
                    },
                })
            }
        },

        // 电话反馈
        record(val){
            this.$buryPoint('telephone-feedback')
            this.$router.push({
                name:"phoneBack",
                params:val     
                
            })
        },

        // 获取电话催缴详情
        getPhoneReminderDetails(){
            let that = this
            axios.get(
              this.$envConfigObj.cuiJiaoPath + `/arrears/home/details/${that.taskId}/${that.houseId}/${that.arrearType}`
            ).then(res=>{
                that.phoneObject = res.data.data
                console.log(that.phoneObject)
            }).catch(err=>{
                console.log(err)
            })
        }
    },
}
</script>
<style lang="stylus" scoped>
    #phoneDetail{
        height 100%
        background-color #F7F7F7
        .options{
            position: absolute;
            z-index: 1;
            right: 0.18rem;
            top: 0.19rem;
            width: .22rem;
        }
        .showOrHide{
            width .96rem;
            height .77rem;
            position: fixed;
            right: .12rem;
            top: .58rem;
            z-index: 2;
            .top{
                position relative
                left 0.75rem
                width: 0;
                height: 0;
                border-left: .05rem solid transparent;
                border-right: .05rem solid transparent;
                border-bottom: .05rem solid rgba(74,74,74,0.9);
            }
            .bottom{
                border-radius 3px
                height .72rem;
                background:rgba(74,74,74,0.9)
                display: flex;
                font-size: .13rem;
                color: #fff;
                flex-direction: column;
                line-height: .36rem;
                padding 0 .04rem;
                text-align center
                li:first-child{
                    border-bottom  1px solid #787878

                }
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
                    .rightPhone{
                        .phone{
                            float right
                            width .24rem
                            height .24rem
                            border-radius .04rem;
                            text-align center
                            margin: 0 0 0 .05rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            .van-icon-phone{
                                font-size .16rem
                                color #268AED
                            }
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
                    .jiantou{
                        width: 0;
                        height: 0;
                        border-width: 0.05rem;
                        border-style: solid;
                        border-color: transparent #ddd transparent transparent;
                        position: absolute;
                        top: 2px;
                        left: -0.1rem;
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
                    .success{
                        font-size .14rem;
                        display: flex;
                        align-items: center;
                        height .28rem
                        padding 0 .05rem
                        color #1CC8AE
                        border-radius .04rem
                        padding-right 0
                        // border 1px solid #268aed
                        img{
                            width .12rem
                            margin-right .03rem
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
            .tip{
                display flex
                justify-content: space-between;
                border-bottom 1px solid #eee
                background-color #fff
                .left{
                    display flex;
                    height : .18rem;
                    line-height : .18rem;
                    padding .07rem 0 .11rem .2rem;;
                    img{
                        width : .14rem;
                        height : .14rem;
                        margin: 0.02rem .06rem 0 0;
                    }
                    span{
                        color #4C5F6C;
                        font-size .12rem;
                    }
                }
                .right{
                    display flex
                    justify-content: flex-end
                    padding .07rem 0.19rem 0.07rem 0
                    width 50vw
                    span{
                        font-size .14rem;
                        color #4C5F6C;
                        line-height .22rem
                    }
                }
            }
        }
        .call{
            margin-top 9px;
            >div{
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
        .phoneBack{
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
    }
</style>

