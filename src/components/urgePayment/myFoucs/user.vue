<template>
    <div id="user">
        <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" loading-text pulling-text="下拉刷新">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <van-cell v-for="(item,index) in list" :key="index">
                    <ul>
                        <li>
                            <div class="left">
                                <van-cell>
                                    <template slot="title">
                                        <span class="custom-text">{{ item.customName }}</span>
                                        <van-tag color="#268AED" v-show="item.customType==1" plain>业主</van-tag>
                                    </template>
                                </van-cell>
                                <span class="address">{{ item.customerAddress }}</span>
                            </div>
                            <div class="right">
                                <div class="followStatus" @click="toggle(item,item.followStatus=!item.followStatus,index)" v-has-btn>
                                    <span class="yes" v-if="item.followStatus">
                                        <img src="../../../assets/img/urgePayment/icon_unfollow@2x.png" alt="">已关注
                                    </span>
                                    <span class="no" v-if="!item.followStatus">
                                        + 关注
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </van-cell>
            </van-list>
        </van-pull-refresh>
        <empty :isEmptyShow="isEmpty"></empty>
    </div>
</template>
<script>
import empty from '../common/empty'
import axios from 'axios'
export default {
    name:"user",
    components:{ empty },
    data(){
        return{
            isEmpty:false,
            pageNo:1,
            pageSize:10,
            userId:"102266",
            userList:[],
            // 下拉刷新
            list:[],
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            refreshLoading: false,
        }
    },
    created() {
        
    },
    mounted() {

    },
    methods: {
        onLoad() {
            this.getUserList()
        },
        onRefresh() {
            // 加载第一次请求
            this.list = []
            this.pageNo = 1
            // this.pageNo++
            this.getUserList(1)
        },

        // 切换关注状态
        toggle(item,flag,index){
            let that = this
             console.log(item)
             if(item.followStatus==false){
                that.$buryPoint('Remove-attention')
                axios.get(`${ this.$envConfigObj.cuiJiaoPath}/attention/cancelFollow/${this.$store.state.conditionParam.ownId}/${item.houseId}`).then(function (res) {
                    console.log('取消关注')
                    that.list.splice(index,1)
                })
                this.$toast({
                    message: "已取消关注",
                    position:{
                        bottom:50,
                    },
                })
            }else{
                that.$buryPoint('attention')
                axios.post( this.$envConfigObj.cuiJiaoPath + '/attention/addFollow', {
                    ownId: localStorage.getItem('userId'),
                    customPhone: item.customPhone,
                    houseId: item.houseId,
                    customType: 1,
                    customAddress: item.customAddress,
                    customName: item.customName,
                }).then(function (res) {
                    console.log('关注')
                })
                this.$toast({
                    message: "关注成功",
                    position:{
                        bottom:50,
                    },
                })
            }
        },

        // 获取关注用户列表
        getUserList(type){
            let that = this
            axios.get( this.$envConfigObj.cuiJiaoPath + `/attention/HasFollow/${that.$store.state.conditionParam.ownId}/${that.pageNo}/${that.pageSize}`)
            .then(res=>{

                // console.log(this.userList)
                if (res.data.status == 0) {
                    let totalCount = res.data.data.total
                    console.log(res.data.data)
                    that.loading = false;   // 加载状态结束
                    that.userList = res.data.data.records
                    // console.log(that.phoneArr)
                    that.list = [...that.list, ...that.userList]              //    数组pollfiy
                    if (that.list.length == 0){
                        that.isEmpty = true
                        that.finishedText = ''
                    }
                    // 刷新逻辑
                    if (type === 1) {
                        that.refreshLoading = false;
                    }
                    // 页码加1  下次从这里开始查
                    if (that.list.length < totalCount){
                        that.pageNo++
                        that.finished = false;
                    }
                    // 根据total做判断
                    // 数据全部加载完成
                    if (that.list.length >= totalCount) {
                        that.finished = true;
                    }
                }

            }).catch(err=>{
                console.log(err)
            })
        }
    },
}
</script>
<style lang="stylus" scoped>
#user{
    .van-list{
        height: 84vh;
        overflow: auto;
    }
    ul{
        li{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding .06rem .15rem .08rem .19rem;
            border 1px solid #eee
            .left{
                display flex
                flex-direction column

                .address{
                    font-size .14rem;
                    color #666;
                    max-width 2.2rem;
                    text-overflow ellipsis;
                    overflow hidden
                    white-space nowrap
                }
                .van-cell{
                    padding 0
                }
                .van-cell:not(:last-child)::after{
                    border none
                }
                .van-cell__title{
                    flex: 1;
                    font-size: 14px;
                    color: #666;
                    padding 0 0 .1rem 0
                    .custom-text{
                        font-family:PingFangSC-Medium;
                        color #444;
                        font-size .16rem
                    }
                    .van-tag{
                        height: .14rem;
                        line-height: .14rem;
                        // padding .01rem .04rem;
                        margin-left .04rem
                    }
                }
            }
            .right{
                 .followStatus{
                    width .64rem;
                    height .3rem;
                    position relative;
                    line-height .3rem;
                    text-align center;
                    margin-left .08rem
                    .yes,.no{
                        font-size .14rem;
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
        }
    }
    .van-cell{
        padding 0
        border none
    }
}
</style>

