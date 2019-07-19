<template>
    <div id="foucsSetting">
        <v-nav-bar :title="title" />
        <div class="top">
            <van-cell-group>
                <van-switch-cell v-model="checked1" title="消息提醒" />  
            </van-cell-group>
            <van-cell-group>
                <van-switch-cell v-model="checked2" title="接收催缴业主动态信息" />
            </van-cell-group>
            <van-cell-group>
                <van-cell title="清除缓存" :value=" size  "  />
            </van-cell-group>
        </div>
        <div class="bottom">
            <van-cell title="修改密码" is-link to="/arrears/reminderTask/myFoucs" />
            <van-cell value="检测更新" />
            <van-cell value="关于田丁" />
            <van-cell value="退出" />
        </div>
    </div>
</template>
<script>
export default {
    name:"foucsSetting",
    data(){
        return{
            title:"设置",
            checked1: true,
            checked2: true,
            size:"504KB"
        }
    },
    methods: {
        onClickLeft(){
            this.$route.go(-1)
        }
    },
}
</script>
<style lang="stylus" scoped>
#foucsSetting{
    height 100%
    background-color #f7f7f7
    .top{
        margin-bottom .1rem;
    }
}
</style>

