<template>
    <div id="myFoucsIndex">
        <v-nav-bar style="position:relative" :title="title">
            <div v-show="showOrHide" class="mask"></div>
            <div @click="showTip" class="options">
                <span class="tips">!</span>
                <span>关闭提醒</span>
            </div>
            <div class="showOrHide" v-show="showOrHide">
                <div class="top"></div>
                <div class="bottom">
                    <p class="close">关闭提醒</p>
                    <span>
                        当前默认主动推送已关注的业主动态消息，如需关闭推送提醒，可在
                        "
                        <span style="color:#268AED" @click="toFoucs">我的-设置</span>
                        "中关闭
                    </span>
                    <p class="know" @click="know">知道了</p>
                </div>
            </div>
        </v-nav-bar>
        <van-tabs
            v-model="active"
            :line-height='2'
            color="#268AED"
            :line-width=150
            title-active-color="#268AED"
            title-inactive-color="#444">
            <van-tab title="关注动态">
                <dynamicState />
            </van-tab>
            <van-tab title="关注用户">
                <user />
            </van-tab>
        </van-tabs>
        
    </div>
</template>
<script>
import dynamicState from './dynamicState'
import user from './user'
export default {
    name:"myFoucsIndex",
    components:{ dynamicState , user },
    data(){
        return{
            title:"我的关注",
            showOrHide:false,
            active:0
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    watch: {
        active(old,newValue){
            if (old!=0) {
                this.$buryPoint('Focus-on-users')
                console.log('point')
            }else{
                this.$buryPoint('Attention-dynamics')
            }
        }
    },
    methods: {
        showTip(){
            if(this.showOrHide){
                this.showOrHide=false;
            }else{
                this.showOrHide=true
            }
        },
        know(){
            this.showOrHide=false;
        },
        toFoucs(){
            this.$router.push({
                name:"foucsSetting"
            })
        }
    },
}
</script>
<style lang="stylus" scoped>
    #myFoucsIndex{
        height 100%
        position relative
        .options{
            position: absolute;
            z-index 1;
            right: 0.18rem;
            top: 0;
            width: 1.04rem;
            font-size .15rem;
            color #666;
            display flex;
            justify-content: flex-end;
             align-items: center;
            height .44rem;
            line-height .44rem;
            .tips{
                width: .16rem;
                height: .16rem;
                border: 1px solid #268AED;
                border-radius: 50%;
                line-height: .44rem;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: .08rem;
                color: #268AED;
                margin-right .04rem;
            }
        }
        .showOrHide{
            width 2.22rem;
            height 1.52rem;
            position: absolute;
            right: .12rem;
            top: .5rem;
            z-index: 3000;
            .top{
                position relative
                left 1.34rem
                width: 0;
                height: 0;
                border-left: .085rem solid transparent;  
                border-right: .085rem solid transparent;
                border-bottom: .085rem solid #fff;
            }
            .bottom{
                border-radius 3px
                height 1.48rem;
                background:#fff;
                font-size: .13rem;
                color: #fff;
                padding 0.12rem .2rem .16rem .17rem;
                box-sizing border-box;
                p{
                    color #444;
                    font-size .15rem;
                    line-height .21rem;
                    margin 0;
                    &.close{
                        margin-bottom: .1rem;
                    }
                    &.know{
                        margin-top .1rem
                    }
                }
                span{
                    color #666;
                    font-size .14rem;
                    line-height .20rem;
                    padding .1rem 0 
                }
            }
        }
        .mask{
            position: absolute;
            top: 0.44rem;
            z-index: 2500;
            width: 100%;
            height: calc( 100vh - .44rem);
            background-color rgba(51,51,51,0.2)
        }
    }
</style>

<style lang="stylus">
    #myFoucsIndex{
        #v-nav-bar{
            .navBarTitle{
                position: relative !important;
            }
        }
    }
</style>


