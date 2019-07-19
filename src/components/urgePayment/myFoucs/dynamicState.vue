<template>
    <div id="dynamicState">
        <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" loading-text pulling-text="下拉刷新">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <van-cell v-for="(item,index) in list" :key="index">
                    <ul v-if="itemArr.length!=0">
                        <li>
                            <div class="top">
                                <div v-show="item.type==1" class="left">短信催缴</div>
                                <div v-show="item.type==2" class="left">电话催缴</div>
                                <div v-show="item.type==3" class="left">上门催缴</div>
                                <div class="right">
                                    <span class="time">19/02/22 15:30</span>
                                </div>
                            </div>
                            <div class="bottom">
                                <span class="msg">
                                    {{ item.arrearsSuggest }}
                                </span>
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
import GetUrlParam from '@/utils/urlParse'
export default {
    name:"dynamicState",
    components:{ empty },
    data(){
        return{
            isEmpty:false,
            pageNo:1,
            pageSize:3,
            itemArr:[],
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
    methods:{
        onLoad() {
            this.getFoucsDynamic()
        },
        onRefresh() {
            // 加载第一次请求
            this.list = []
            this.pageNo = 1
            this.getFoucsDynamic(1)
        },
        getFoucsDynamic(type){
            let that = this
            axios.get(this.$envConfigObj.cuiJiaoPath + `/attention/attentionDynamic/${this.$store.state.conditionParam.ownId}/${that.pageNo}/${that.pageSize}`).then(res=>{
                if (res.data.status == 0) {
                    let totalCount = res.data.data.total
                    console.log(res.data.data)
                    that.loading = false;   // 加载状态结束
                    that.itemArr = res.data.data.records
                    // console.log(that.phoneArr)
                    that.list = [...that.list, ...that.itemArr]              //    数组pollfiy
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
#dynamicState{
    .van-list{
        height: 84vh;
        overflow: auto;
    }
    ul{
        li{
            padding .08rem .15rem .08rem .18rem
            // margin-bottom .10rem
            background-color #fff
            border-bottom  1px solid #eee
            .top{
                display flex
                justify-content space-between
                .right{
                    font-size .13rem;
                    color #999;
                }
                .left{
                    font-size .16rem;
                    color #444
                }
            }
            .bottom{
                display flex
                padding-top .04rem;
                .msg{
                    font-size .14rem;
                    color #666;
                    line-height .22rem
                }
            }
        }
    }
    .van-cell{
        padding 0
        border none
    }
    .none{
        display flex
        justify-content center
        img{
            width 2.05rem;
            height 1.5rem;
            padding-top .33rem;
        }
    }
}
</style>

