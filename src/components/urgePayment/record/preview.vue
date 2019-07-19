<template>
    <div id="preview">
        <v-nav-bar :title="title" />
        <div class="search">
            <form action="/">
                <van-search
                v-model="value"
                placeholder="请输入搜索关键词"
                show-action
                shape="round"
                @search="onSearch"
                >
                <div slot="action" @click="onSearch">搜索</div>
                </van-search>
            </form>
        </div>
        <div class="center">
            <span>{{ uptownName }}</span>
            <div class="right">
                <span>欠费户数 {{ total.arrearsCount || 0 }} 户</span>
                <span>金额 {{ total.arrearsMoney }} 元</span>
            </div>
        </div>
        <div class="bottom">
            <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" loading-text pulling-text="下拉刷新">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                    <van-cell v-for="(item,index) in list" :key="index">
                        <ul>
                            <li>
                                <div class="left">
                                    <img src="../../../assets/img/record/icon_location@2x.png" alt="">
                                </div>
                                <div class="right">
                                    <div class="money">
                                        <span class="address">{{ item.unitNumber }} {{item.houseName}}</span>
                                        <span class="price">￥{{ item.arrearageMoney }}</span>
                                    </div>
                                    <p class="user">{{ item.customName }}</p>
                                    <span class="time">逾期 {{ item.arrearageTime }} 天</span>
                                    <span class="times">通知 {{item.noticeCount}} 次</span>
                                </div>
                            </li>
                            
                        </ul>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
        </div>
        <footer @click="goPrinter">
            <button>发送</button>
        </footer>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:"preview",
    data(){
        return{
            title:'打印预览',
            value:"",
            itemArr:[],
            total:{},
            arrearsId:null,
            uptownName:'',
            pageNo:1,
            pageSize:10,
            customName:null,
            houseName:null,
            userName:null,
            // 下拉刷新
            list:[],
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            refreshLoading: false,
        }
    },
    watch : {
        '$route': 'getParams'
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

        getParams () {
            this.arrearsId =localStorage.getItem('arrearsId') 
            this.uptownName =localStorage.getItem('uptownName') 
            console.log(this.uptownName)
        },

        onLoad() {
            this.getList()
        },

        onRefresh() {
            // 加载第一次请求
            this.list = []
            this.pageNo = 1
            this.getList(1)
        },

        onSearch(){
            console.log('value:',this.value)
            if(this.value==""){
                this.houseName = null
                this.customName = null
            }else{

                this.isNum(this.value) ? this.houseName = this.value : this.customName = this.value
            }
            this.list = []
            this.pageNo = 1
            this.getList(1)
        },

        goPrinter(){
            this.$buryPoint('pre-send')
            this.$router.push({
                name:"printer",
                params:{
                    arrearsId:this.arrearsId,
                    params:this.total
                }
            })
        },

        // 盖章
        stamp(){
            axios.post(this.$envConfigObj.cuiJiaoPath + `/arrears/notice/printSeal`,{
                arrearsId:localStorage.getItem('arrearsId'),
                userId:this.userId,
                stampNum: this.total.arrearsCount,
                userName:this.userName
            }).then(res=>{
                console.log(res)
            })
        },

        getList(type){
            let that = this
            axios.post(this.$envConfigObj.cuiJiaoPath + `/summary/queryNoticeList`,{
                userId:localStorage.getItem('userId'),
                houseName:that.houseName,
                arrearsId:localStorage.getItem('arrearsId'),
                pageNo:that.pageNo,
                pageSize:that.pageSize,
                customName:that.customName
            }).then(res=>{
                
                if (res.data.status == 0) {
                    let totalCount = res.data.data.total
                    console.log('21',res.data.data)
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

            }).then(res=>{
                if(that.itemArr!=''){
                    that.userName = that.itemArr[0].ownerName
                    that.userId = that.itemArr[0].ownerId
                    that.stamp()
                }
            })
        },
        gettotal(){
            axios.get(this.$envConfigObj.cuiJiaoPath + `/summary/queryNoticeSummary?arrearsId=${localStorage.getItem('arrearsId')}&userId=${localStorage.getItem('userId')}`).then(res=>{
                if (res.data.status == 0) {
                    console.log('total',res.data.data)
                    this.total = res.data.data
                }
            })
        }
    },
    created() {
        this.getParams()
        this.gettotal()
    },
}
</script>
<style lang="stylus" scoped>
#preview{
    .van-search{
        background-color #f5f5f5 !important
        .van-search__content{
            background-color #fff
        }
    }
    .search{
        background #f5f5f5 !important
    }
    .center{
        padding .1rem .12rem
        height .44rem
        display flex
        flex-direction column
        justify-content space-between
        border-bottom 1px solid #ebebeb
        >span{
            font-size .14rem
            color #313131
            font-weight bold
        }
        .right{
            display flex
            >span{
                color rgb(102, 102, 102)
                font-size .14rem
                color  #666
                line-height .22rem
                margin-right .1rem
            }
        }
    }
    .bottom{
        .van-cell{
            padding 0
            line-height .18rem
        }
        height: calc(100vh - 2.5rem);
        padding-bottom .59rem
        overflow auto
        ul{
            li{
                display flex
                font-size .12rem
                padding 0 .18rem 0 0
                .left{
                    display flex
                    justify-content center
                    align-items flex-start
                    padding 0.06rem .12rem
                    img{
                        width  .24rem
                        height .24rem
                    }
                }
                .right{
                    flex 1
                    border-bottom 1px solid #eee
                    padding-bottom .07rem

                    .money{
                        display flex
                        justify-content space-between
                        padding-top .08rem
                        font-weight bold
                        .address{
                            font-size .16rem
                        }
                        .price{
                            font-size .16rem
                        }
                    }
                    p{
                        margin .04rem 0
                        height  .2rem
                        line-height .2rem
                        font-size .12rem
                        color #313131
                    }
                    >span{
                        color rgb(153, 153, 153)
                        &.times{
                            margin-left .1rem
                        }
                    }
                }
            }
        }
    }
    footer{
        position fixed
        bottom 0
        width 100%
        display flex 
        flex-direction column
        align-items center
        padding .1rem 0
        background-color: #fff;
        border-top 1px solid #ebebeb

        button{
            height .4rem
            font-size .16rem
            background-color #268AED
            border none
            color  #fff
            width  3.5rem
            border-radius .04rem
        }
    }
}
</style>

