<template>
    <div id="panelHead">
        <div>
            <span class="icon" v-bind:class="{ task_ic_loc: isPosition, 'sj_icon_b': isBuilding }"></span>
            <p style="color:#313131;font-weight:500;">{{title}}</p>
        </div>
        <p style="color:#666666;font-size:14px">{{date.substring(0,4)}}.{{date.substring(4)}}</p>
    </div>

</template>

<script>
    export default {
        name: "panelHead",     //  通用面板组件
        props: {
            title: {
                type: String,
                default: '国人通信大厦'
            },
            date: {
                type: String,
                default: '2019.02',
            },
            isPosition: {       // icon close
                type: Boolean,
                default: false
            },
            isBuilding: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped lang="stylus">
    @import "../../stylus/mixin.styl"
    #panelHead
        border-bottom: 1px solid #eee;
        display: flex
        align-items: center
        justify-content: space-between
        padding: 5px 14px
        div
            display: flex
            align-items: center
            justify-content: center

            .icon
                display: inline-block
                /*border: 1px solid blue*/
                margin-right: 5px

            .task_ic_loc
                width: 11px
                height: 14px
                bg-image('../../assets/img/audit/task_ic_loc')
                background-size:contain

            .sj_icon_b
                width: 17px
                height: 17px
                bg-image('../../assets/img/audit/sj_icon_b')
                background-size:contain
        p
            font-size .14rem
            margin: 10px 10px 10px 5px
</style>
