<template>
    <div id="phoneBack">
        <v-nav-bar :title="title" />
        <div class="select">
            <div class="left">
                <span>是否接通</span>
            </div>
            <div class="right" @click="showUp">
                <span>未拨通</span>
                <van-icon name="arrow" />
            </div>
        </div>
        <div class="recordMsg">
            <p>催缴说明</p>
            <textarea name="" id="msg" placeholder="催缴情况说明，不超过100字">

            </textarea>
        </div>
        <div @click="submits" class="submits">
            <van-button type="info">提交</van-button>
        </div>
        <van-actionsheet
            v-model="show"
            :actions="actions"
            cancel-text="取消"
            @select="onSelect"
            @cancel="onCancel"
            />
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:"phoneBack",
    data(){
        return{
            title:"电话反馈",
            show:false,
            taskDetailId:null,
            ownerId:null,
            isSuccess:null,
            details:"",
            text:"",
            obj:{},
            actions: [
                {
                    name: '未拨通'
                },
                {
                    name: '已拨通'
                }
            ]
        }
    },
    created() {
        this.getParams()

    },
    mounted() {

    },
    watch: {
        '$route':'getParams'
    },
    methods: {
        // 弹出层
        showUp(){
            this.show=true;
        },

        // 确定弹出层的选项
        onSelect(value){
            this.show=false;
            var text = document.querySelector("#phoneBack .select .right span").innerHTML=value.name
            this.text=text
        },

        // 取消弹出层
        onCancel(){
            this.show=false
        },

        getParams(){
            this.taskDetailId = this.$route.params.taskId
            this.ownerId = this.$route.params.ownerId
            this.obj = this.$route.params
            console.log('obj',this.obj)
        },

        // 提交反馈的信息
        submits(){
            if(this.text=='已拨通'){
                this.isSuccess=1
            }else{
                this.isSuccess=2
            }
            this.details = document.getElementById('msg').value
            axios.post(
              this.$envConfigObj.cuiJiaoPath + '/arrears/phone/insertFeedback',
                {
                    taskDetailId:this.taskDetailId,
                    ownerId:this.ownerId,
                    houseId: this.obj.houseId,
                    arrearId:this.obj.arrearId,
                    isSuccess:this.isSuccess,
                    details:this.details
                }
            ).then(res=>{
                console.log(res)
                // this.$router.push({
                //     name:"phoneBackRecord",
                //     query:{
                //         taskId:this.obj.taskId,
                //         houseId:this.obj.houseId
                //     }
                // })
                this.$router.go(-1)
            }).catch(err=>{
                console.log(err)
            })
        }
    },
}
</script>
<style lang="stylus" scoped>
    #phoneBack{
        height 100%
        background-color #f7f7f7
        .select{
            height .44rem
            line-height .44rem
            display flex
            justify-content space-between
            padding 0 .15rem 0  .19rem
            background-color #fff
            .left{
                font-size .14rem;
                color #444;

            }
            .right{
                display flex
                color #333;
                font-size .14rem
                .van-icon-arrow{
                    line-height .44rem
                    color #bbbbbb
                    font-size .14rem
                    margin-left .02rem
                }
            }
        }
        .recordMsg{
            text-align center
            background-color #fff
            p{
                text-align left
                color #444;
                font-size .14rem
                padding: .1rem 0 .13rem .19rem;
                margin-bottom  0
            }
            #msg{
                width 3.45rem
                height 1rem
                font-size .14rem
                line-height .2rem
                padding .1rem
                box-sizing border-box
                border-color #ebebeb
            }
        }
        .submits{
            position: fixed;
            bottom: 0;
            width: -webkit-fill-available;
            margin: .15rem .12rem;
            height .44rem
            button{
                width: 100%;
                position absolute
                top 0
            }
            .van-button--default{
                .van-button__text{
                    color #268AED;
                }
            }
        }
    }
</style>

