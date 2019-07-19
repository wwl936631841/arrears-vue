<template>
    <div id="phoneBackRecord">
        <v-nav-bar :title="title" />
        <ul>
            <li v-for="(item,index) in phoneRecord" :key="index">
                <div class="top">
                    <div class="left">
                        <img src="../../../assets/img/phoneDetail/img/icon_time@2x.png" alt="">
                        <span class="time">{{ item.feedbackTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
                    </div>
                    <div class="right" v-show="item.isSuccess==2">未接通</div>
                    <div class="right success" v-show="item.isSuccess==1">已接通</div>
                </div>
                <div class="bottom">
                    <span class="msg">
                        {{ item.details }}
                    </span>
                </div>
            </li>
            <!-- <li>
                <div class="top">
                    <div class="left">
                        <img src="../../../assets/img/phoneDetail/img/icon_time@2x.png" alt="">
                        <span class="time">2019/02/22 15:30:20</span>
                    </div>
                    <div class="right">未接通</div>
                </div>
                <div class="bottom">
                    <span class="msg">
                        业主反馈说服务质量不好，不想交物业费业主反馈说服 务质量不好，
                        不想交物业费业主反馈说服务质量不好， 不想交物业费业主反馈说服务质量.
                    </span>
                </div>
            </li> -->
        </ul>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:"phoneBackRecord",
    data(){
        return{
            title:"电话反馈记录",
            taskDetailId:null,
            phoneRecord:[

            ],
            houseId:''
        }
    },
    computed:{

    },
    created() {
        this.getParams()
        this.getPhoneRecordList()
    },
    mounted() {

    },
    watch: {
        '$route':'getParams'
    },
    methods: {
        getParams(){
            this.taskDetailId = this.$route.query.taskId
            this.houseId = this.$route.query.houseId
        },

        // 获取电话反馈列表
        getPhoneRecordList(){
            axios.get(
              this.$envConfigObj.cuiJiaoPath + `/arrears/phone/queryFeedback?taskDetailId=${this.taskDetailId}&houseId=${this.houseId}`
            ).then(res=>{
                this.phoneRecord = res.data.data
            }).catch(err=>{
                console.log(err)
            })
        }
    },
}
</script>
<style lang="stylus" scoped>
    #phoneBackRecord{
        background-color #f7f7f7;
        height 100%
        ul{
            li{
                padding .14rem .15rem .16rem .18rem
                margin-bottom .10rem
                background-color #fff
                .top{
                    display flex
                    justify-content space-between
                    .left{
                        font-size .14rem;
                        color #999;
                        img{
                            width .14rem
                            vertical-align middle
                            margin-right .04rem
                        }
                    }
                    .right{
                        font-size .14rem;
                        color #268AED
                        &.success{
                            color #333
                        }
                    }
                }
                .bottom{
                    display flex
                    padding-top .1rem;
                    .msg{
                        font-size .14rem;
                        color #444;
                        line-height .22rem
                    }
                }
            }
        }
    }
</style>

