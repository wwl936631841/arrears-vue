<template>
    <div id="v-nav-bar">
        <van-nav-bar
            class="navBarTitle"
            :title="title"
            left-text=""
            right-text=""
            left-arrow
            @click-left="onClickLeft"
            fixed
        />
        <slot></slot>
    </div>
</template>
<script>
import GetUrlParam from '@/utils/urlParse'
export default {
    name:"vNavBar",
    props:{
        title:{
            type:String,
        }
    },
    methods: {
        onClickLeft(){
            let fromPhone = GetUrlParam('fromPhone')
            if ((fromPhone == "android") || (fromPhone == "iOS")) {
                window.location.href = "zjh://close"
            } else if (fromPhone == null) {
                this.$router.go(-1)
            }
            // window.history.go(-1);
        }
    },
}
</script>
<style lang="stylus" scoped>
    #v-nav-bar{
        position: relative !important;
        background-color: #F5F5F5
        height: .44rem;
        width:100%;
        // border: 1px solid red
        .navBarTitle{
            height .44rem;
            line-height .44rem
            position fixed;
            top auto
            .van-nav-bar__left{
                padding-left .15rem
                left 0
                .van-icon-arrow-left{
                    font-size .20rem
                    color #333
                    font-weight 600
                }
            }
            .van-nav-bar__title{
                font-size .18rem
                color #333
                font-weight 600
            }
            .van-nav-bar__right{
                font-size .15rem
                color #268AED
            }
        }
    }
</style>

