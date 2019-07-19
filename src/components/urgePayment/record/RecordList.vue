<template>
    <div id="recordList">
        <v-nav-bar :title="title" />
        <div class="header">
            <span>管家姓名</span>
            <span>盖章时间</span>
            <span>盖章户数</span>
            <span>产生费用</span>
        </div>
        <main>
            <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" loading-text pulling-text="下拉刷新">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <van-cell v-for="(item,index) in list" :key="index">
                        <ul>
                            <li>
                                <span>{{ item.ownerName }}</span>
                                <span> {{ item.stampTime |  dataFormat('yyyy-MM-dd') }}  </span>
                                <span>{{ item.stampCount }}</span>
                                <span>{{ item.stampFee }}</span>
                            </li>
                        </ul>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
        </main>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:"RecordList",
    data(){
        return{
            title:"盖章记录",
            createId:null,
            arrearsId:null,
            createTime:null,
            enabled:null,
            id:null,
            ownerId:null,
            ownerName:null,
            stampCount:null,
            stampFee:null,
            stampTime:null,
            updateId:null,
            updateTime:null,
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
        onLoad() {
            this.getList(1)
        },

        onRefresh() {
            // 加载第一次请求
            this.list = []
            this.pageNo = 1
            this.getList(1)
        },
        
        
        getList(type){
            let that = this
            axios.post(this.$envConfigObj.cuiJiaoPath + `/arrears/notice/page`,{
                arrearsId:that.arrearsId,
                createId:that.createId,
                createTime:that.createTime,
                enabled:that.enabled,
                id:that.id,
                ownerId:that.ownerId,
                ownerName:that.ownerName,
                stampCount:that.stampCount,
                stampFee:that.stampFee,
                stampTime:that.stampTime,
                updateId:that.updateId,
                updateTime:that.updateTime,
                pageNo:that.pageNo,
                pageSize:that.pageSize,
            }).then(res=>{
                if (res.data.status == 0){
                    
                    let totalCount = res.data.data.total
                    console.log(res.data.data)
                    that.loading = false;   // 加载状态结束
                    that.itemArr = res.data.data.records
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
}
</script>
<style lang="stylus" scoped>
#recordList{
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
        }
    }
    main{
        height 83vh
        overflow auto
        ul{
            li{
                display flex
                justify-content space-between
                text-align center
                align-items: center;
                padding: .2rem 0;
                border-bottom 1px solid #ebebeb
                span{
                    flex 1
                    font-size .14rem
                    color #444
                }
            }
        }
    }
}
</style>

