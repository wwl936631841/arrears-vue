<template>
    <div id="recordReminder">
        <v-nav-bar :title="title" />
        <ul class="header">
            <li>时间</li>
            <li>执行方案</li>
            <li>结果</li>
        </ul>
        <div v-if="this.dataArr.length!=0">

            <div class="record" v-for=" item of dataArr" :key="item.index">
                <span class="left">
                    {{ item.create_time }}
                </span>
                <span class="center">
                    {{ item.type }}
                </span>
                <span class="right">
                    {{ item.status }}
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
    export default {
        name:"recordReminder",
    
        data(){
            return{
                title:"催缴记录",
                phone:"15827204733",
                
                dataArr:[
                    
                ]
                
            }
        },

        created() {
            this.getParams()
        },

        mounted() {
            this.getSmsRecord()
        },

        watch: {
            '$route': 'getParams'
        },

        methods: {
            // 获取短信催缴记录
            getSmsRecord(){
                axios.get(`${this.$envConfigObj.cuiJiaoPath}/arrears/message/records?phone=${this.phone}`).then(({data}) => {
                    this.dataArr=data.data
                    console.log(this.dataArr)
                }).catch(err => {
                    console.log(err);
                });
                
                
            },
            
            getParams(){
                this.phone = this.$route.query.phone
            }
        },
    }
</script>
<style lang="stylus" scoped>
    #recordReminder{
        .header{
            display: flex
            height .44rem
            background-color #fff
            border 1px solid #EBEBEB
            li{
                text-align center
                line-height .44rem
                width: 33vw
                color: #444
                font-size: .14rem
                font-weight 500
                &:first-child{
                    text-align left 
                    padding-left .19rem
                }
                &:last-child{
                    text-align right 
                    padding-right .27rem
                }
            }
        }
        .record{
            display flex
            align-items center
            font-size .14rem;
            color #444
            border-bottom 1px solid #ebebeb
            .left,.center,.right{
                width 33vw
                text-align center
                padding .12rem 0
                font-weight 400
            }
            .left{
                text-align left 
                padding-left .19rem;
            }
            .right{
                text-align right 
                padding-right .27rem
                font-family:PingFangSC-Medium;
                font-weight 500
            }
        }
    }
</style>
