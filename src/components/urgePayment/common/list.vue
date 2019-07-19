<template>
    <div id="list">
        <main>
            <ul>
                <li>
                    <span>{{ itemList.customName }}</span>
                    <span>{{ itemList.houseName }}</span>
                    <span>{{ itemList.arrearageMoney }}</span>
                    <span>{{ itemList.arrearsCount }}{{itemList.arrears}}</span>
                    <span v-if="itemList.payStatus">已支付</span>
                    <span v-if="!itemList.payStatus">未支付</span>
                </li>
            </ul>
        </main>
    </div>
</template>
<script>
export default {
    name:"lister",
    data(){
        return{

        }
    },
    props:{
        itemList:{
            type:Object
        }
    },
    methods:{

    }
}
</script>
<style lang="stylus">
.van-cell:not(:last-child)::after{
    border none
}
</style>

<style lang="stylus" scoped>
#list{

    main{
        .van-cell:not(:last-child)::after{
            border none
        }
        .van-cell{
            border none
            padding 0
        }
        ul{
            li{
                display flex
                justify-content space-between
                text-align center
                align-items: center;
                padding .2rem 0.12rem
                border-bottom 1px solid #ebebeb
                span{
                    flex 1
                    main-width .82rem
                    font-size .14rem
                    color #444444
                }
            }
        }
    }
}
</style>


