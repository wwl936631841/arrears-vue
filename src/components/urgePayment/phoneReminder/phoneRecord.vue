<template>
    <div id="phoneRecord">
        <v-nav-bar :title="title" />
        <div v-if="phoneRecordList.length!=0">
            <ul class="header">
                <li>时间</li>
                <li>执行方案</li>
                <li>拨打用户</li>
            </ul>
            <div class="record" v-for="(item,index) in phoneRecordList" :key="index">
                <span class="left">
                    {{ item.callTime | moment('YYYY-MM-DD HH:mm:ss') }}
                </span>
                <span class="center">{{ item.type }}</span>
                <span class="right">{{ item.telUser }}</span>
            </div>
        </div>
        <div v-if="phoneRecordList.length==0" class="noRecord">
            <img src="../../../assets/img/phoneDetail/img/empty@2x.png" alt="">
            <span>没有查找到相关信息</span>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:"phoneRecord",
    data(){
        return{
            title:"电话拨打记录",
            taskDetailId:null,
            phoneRecordList:[],
            houseId:''
        }
    },
    created() {
        this.getParams()
        this.getPhoneRecord()
    },
    mounted() {

    },
    watch: {
        '$route':'getParams'
    },
    methods: {
        getParams(){
            this.taskDetailId = this.$route.query.taskDetailId
            this.houseId = this.$route.query.houseId
        },

        // 获取电话反馈记录
        getPhoneRecord(){
            let that = this
            axios.get(
              this.$envConfigObj.cuiJiaoPath + `/arrears/phone/queryDial?taskDetailId=${this.taskDetailId}&houseId=${this.houseId}`
            ).then(res=>{
                that.phoneRecordList = res.data.data
                console.log(that.phoneRecordList)
            }).catch(err=>{
                console.log(err)
            })
        }
    },
}
</script>
<style lang="stylus" scoped>
    #phoneRecord{
        .header{

            display: flex
            height .44rem
            background-color #fff
            border 1px solid #EBEBEB
            li{
                text-align center
                line-height .44rem
                width: 33vw
                color: #444
                font-size: .14rem
                font-weight 500
                &:first-child{
                    text-align left
                    padding-left .19rem
                }
                &:last-child{
                    text-align right
                    padding-right .27rem
                }
            }
        }
        .record{
            display flex
            align-items center
            font-size .14rem;
            color #444
            border-bottom 1px solid #ebebeb
            .left,.center,.right{
                width 33vw
                text-align center
                padding .1rem 0
                font-weight 400
            }
            .left{
                text-align left
                padding-left .19rem;
                line-height .2rem
            }
            .right{
                text-align right
                padding-right .27rem
                font-family:PingFangSC-Medium;
                font-weight 500
            }
        }
        .noRecord{
            display flex
            flex-direction column
            align-items: center;
            img {
                width 1.28rem;
                height 1.28rem;
                padding: .2rem 0 .2rem 0;
            }
            span{
                font-size .13rem;
                color #999
                line-height .18rem
            }
        }
    }
</style>

