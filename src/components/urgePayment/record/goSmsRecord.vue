<template>
    <div id="sms">
        <v-nav-bar :title="title" />
        <search @queryBySearch="queryBySearch($event)"
                @orderByUrge="orderByUrge($event)"
                @orderBySteward="orderBySteward($event)" :stewardList="stewardList" :statusType="2"/>
        <div class="header">
            <span>姓名</span>
            <span>房号</span>
            <span>欠款金额</span>
            <span>催缴次数</span>
            <span>支付状态</span>
        </div>
        <main>
            <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" loading-text pulling-text="下拉刷新">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <van-cell v-for="(item,index) in list" :key="index">
            
                        <list :itemList="item"></list>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
        </main>
    </div>
</template>
<script>
import axios from 'axios'
import search from '../common/recordSearch'
import list from '../common/list'
export default {
    name:"goSmsRecord",
    components:{ search , list },
    data(){
        return{
            title:"短信催缴记录",
            arrearId:null,
            stewardList:[],
            isArrears:null,  // 是否催缴(0 是 1否)
            condition:null,
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
            this.list = []
            this.pageNo = 1
            this.getList(1)
        },

        queryBySearch(val){
            this.list = []
            this.pageNo = 1
            if(val==""){
                this.condition = null
            }else{

                this.isNum(val) ? this.condition = val : this.condition = val
            }
            this.getList(1)
        },

        orderByUrge(val){
            console.log('isArrears',val)
            this.isArrears = val
            this.list = []
            this.pageNo = 1
            this.getList(1)
        },

        orderBySteward(id){
            console.log('id',id)
            this.ownerId = id
            this.list = []
            this.pageNo = 1
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
            axios.post(this.$envConfigObj.cuiJiaoPath + `/arrears/message/details/messageReport`,{
                arrearId:that.arrearsId,
                condition:that.condition,
                isArrears:that.isArrears,
                ownerId:that.ownerId,
                pageNo:that.pageNo,
                pageSize:that.pageSize,
            }).then(res=>{
                console.log('res.data',res)
                if (res.data.status == 0){
                    
                    let totalCount = res.data.data.total
                    console.log(res.data.data)
                    that.loading = false;   // 加载状态结束
                    that.itemArr = res.data.data.data
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
.van-cell{
    padding 0
}
main{
    height 70vh
    overflow auto
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
    }
}
</style>
<style lang="stylus">
#sms{
    .van-list__finished-text{
        height 70vh
    }
}
</style>
