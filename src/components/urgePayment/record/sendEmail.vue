<template>
    <div id="close">
        <v-nav-bar :title="title">
        </v-nav-bar>
        <div class="myStep">
            <div class="left">
                <img src="../../../assets/img/record/icon_sucess@2x.png" alt="">
                <span class="blueLine"></span>
                <span class="grayLine"></span>
                <img src="../../../assets/img/record/icon_send@2x.png" alt="">
            </div>
            <div class="right">

                <div>
                    <h3 class="sys">操作成功，系统处理中</h3>
                    <p class="user">通知欠费用户{{total}}户</p>
                    <p class="money">金额{{money}}元。</p>
                </div>
                <div>
                    <h3 class="success">邮件发送成功</h3>
                    <p class="plan">预计10分钟后发送完成</p>
                </div>
            </div>
        </div>
        <button @click="back">完成</button>
    </div>
</template>
<script>
export default {
    name:"sendEmail",
    data(){
        return{
            title:"打印结果",
            total:null,
            money:null
        }
    },
    
    watch: {
        '$route':'getparams'
    },

    methods: {
        getparams(){
            this.total = this.$route.params.params.arrearsCount
            this.money = this.$route.params.params.arrearsMoney
        },

        back(){
            this.$router.go(-3)
        }
    },

    created() {
        this.getparams()
    }
}
</script>
<style lang="stylus" scoped>
#close{
    height 100%
    background-color #f5f5f5
    .myStep{
        margin: .12rem
        background-color #fff
        display flex
        padding .12rem 0 .19rem
        .left{
            flex-basis .6rem
            display flex
            flex-direction column
            align-items center 
            justify-content center
            img{
                width .24rem
                height .24rem
            }
            .blueLine{
                background-color #268AED
                display block
                width 2px
                height 48px
            }
            .grayLine{
                background-color #D8D8D8
                display block
                width 2px
                height 48px
            }
        }
        .right{
            display flex
            flex-direction column
            justify-content: space-between;
            
            >div{
                .sys{
                    margin 0
                    font-size .16rem
                    color rgb(18, 150, 219)
                }
                .user{
                    margin 0
                    font-weight bold
                    font-size .14rem
                    line-height .28rem
                    color #313131
                }
                .money{
                    margin 0
                    font-size .12rem
                    color rgb(102, 102, 102)
                }
                .success{
                    margin 0
                    font-size .16rem
                    color #313131
                    line-height .28rem
                }
                .plan{
                    margin 0
                    font-size .12rem
                    color rgb(102, 102, 102)
                }
            }
        }
    }
    >button{
        width 3.51rem
        height .45rem
        color #ffffff
        border none
        margin 0 .12rem
        font-size .16rem
        background-color #268AED
        border-radius .04rem
        position relative
        bottom .6rem
    }
}
</style>


