<template>
    <div id="clect">
        <v-nav-bar :title="title"/>
        <search @queryBySearch="queryBySearch($event)"
                @orderByStatus="orderByStatus($event)"
                @orderBySteward="orderBySteward($event)" :stewardList="stewardList" :statusType="1"/>
        <div id="list">
            <div class="header">
                <span>姓名</span>
                <span>房号</span>
                <span>欠款金额</span>
                <span>欠款时长(天)</span>
                <span>通知次数</span>
            </div>
            <main>
                <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" loading-text pulling-text="下拉刷新">
                    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                        <van-cell v-for="(item,index) in list" :key="index">
                            <ul>
                                <li>
                                    <span>{{ item.customName }}</span>
                                    <span>{{ item.houseName }}</span>
                                    <span>{{ item.arrearageMoney }}</span>
                                    <span>{{ item.arrearageTime }}</span>
                                    <span>{{ item.noticeCount }}</span>
                                </li>
                            </ul>
                        </van-cell>
                    </van-list>
                </van-pull-refresh>
            </main>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import search from '../common/recordSearch'
export default {
    name:"collectionRecord",
    components:{ search },
    data(){
        return{
            title:"催收函记录",
            arrearsId:null,
            stewardList:[],
            customName:null,
            hasNotice:null,  // 是否催缴(0 是 1否)
            houseName:null,  // 房间号
            month:null,
            ownerId:null,
            pageNo:1,
            pageSize:10,

            itemArr:[],
            // 下拉刷新
            list:[],
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            refreshLoading: false,
        }
    },
    methods: {
        isNum(num) {
            const reg = /^[1-9]\d*$|^0$/;
            if (reg.test(num) == true) {
                return true
            } else {
                return false
            }
        },

        onLoad() {
            this.getList(1)
        },

        onRefresh() {
            // 加载第一次请求
            this.list = []
            this.pageNo = 1
            // this.pageNo++
            this.getList(1)
        },

        queryBySearch(val){
            console.log(val)
            this.list = []
            this.pageNo = 1
            if(val==""){
                this.houseName = null
                this.customName = null
            }else{

                this.isNum(val) ? this.houseName = val : this.customName = val
            }
            // this.pageNo++
            this.getList(1)
        },

        orderByStatus(val){
            console.log('hasNotice',val)
            this.hasNotice = val
            this.list = []
            this.pageNo = 1
            // console.log(this.hasNotice)
            this.getList(1)
        },

        orderBySteward(id){
            console.log('id',id)
            // console.log('hasNotice',val)
            this.ownerId = id
            this.list = []
            this.pageNo = 1
            // console.log(this.hasNotice)
            this.getList(1)
        },

        getparams(){
            this.arrearsId = this.$route.params.arrearsId
        },

        getsteward(){
            let that = this
            axios.get(this.$envConfigObj.cuiJiaoPath + `/summary/queryArrearsStewardList?arrearsId=${that.arrearsId}`).then(res=>{
                console.log(res.data.data)
                this.stewardList=res.data.data
            })
        },

        getList(type){
            let that = this
            axios.post(this.$envConfigObj.cuiJiaoPath + `/summary/queryReminderLetterRecord`,{
                arrearsId:that.arrearsId,
                customName:that.customName,
                hasNotice:that.hasNotice,
                houseName:that.houseName,
                month:that.month,
                ownerId:that.ownerId,
                pageNo:that.pageNo,
                pageSize:that.pageSize,
                userId:localStorage.getItem('userId')
            }).then(res=>{
                if (res.data.status == 0){
                    
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
            })
        }
    },
    mounted() {

    },
    watch: {
        '$route':'getparams'
    },
    created() {
        this.getparams(),
        this.getsteward()
    },
}
</script>
<style lang="stylus" scoped>
// #list{
    .van-cell{
        padding 0
    }
    .header{
        display flex
        justify-content space-between
        text-align center
        align-items: center;
        padding: .12rem 0;
        border-bottom 1px solid #ebebeb
        span{
            flex 1
            font-size .14rem
            font-weight 600
            color #444
        }
    }
    main{
        height 70vh
        overflow auto
        ul{
            li{
                display flex
                justify-content space-between
                text-align center
                align-items center
                padding .2rem 0.12rem
                border-bottom 1px solid #ebebeb
                span{
                    flex 1
                    font-size .14rem
                }
            }
        }
    }
// }
</style>
<style lang="stylus">
#clect{
    .van-list__finished-text{
        height 70vh
    }
}
</style>



