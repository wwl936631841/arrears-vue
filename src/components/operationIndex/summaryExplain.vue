<template>
    <div id="explains">
        <v-nav-bar :title="title"/>
        <p class="title">基础数据</p>
        <p class="yingshou">
            建筑面积: <span>取收费系统房产信息登记的建筑面积（系统建筑面积来源于房产证、面积测绘报告或甲方盖章确认的面积）。剔除重复房间号，建筑面积为0，房号为空的不计算。</span>
        </p>
        <p class="yingshou">
            户数: <span>甲方交付物业的房产户数（包含已入住及未入住的）建筑面积为0，房号为空的不计算。</span>
        </p>
        <p class="yingshou">
            项目数: <span>管理项目数量。</span>
        </p>
        <p class="yingshou">
            本年累计应收(含本月): <span>：指本年累计到当月的应收款（仅指常规收费，含住宅物业费、空调费、能耗费、车位管理费、专项维修基金、多种经营等费用），不含往年应收款。</span>
        </p>
        <p class="shishou">
            实收本年累计(含本月): <span>指本年累计到当月的实收款，包含本月实收本年往月的费用，不含本月预收下月的预收款，包含往月结转至本月的抵扣款。数据统计到当前时间前一天。</span><br/>
            <span>实收本年=实收本月累加（含往月预收抵扣到本月的，不含本月预收下月及下下月的）+本月实收本年往月累加。</span><br/>
        </p>
        <p class="wangqian">
            年初往年应收: <span>指截至上年末的累计欠费。 </span>
        </p>
        <p class="yishou">
            实收往年累计: <span>指本年累计到当月实际收到以前年度的费用，不含实收本年的费用。数据统计时间本年到当前时间前一天。</span>
        </p>
    </div>
</template>
<script>
export default {
    name:"summaryExplain",
    data(){
        return{
            title:'指标解释'
        }
    }
}
</script>
<style lang="stylus">
#explains{
    padding 0 .2rem
    >p{
        font-size .14rem
        color #313131
        font-weight 600
    }
    .yingshou,.shishou,.wangqian,.yishou{
        span{
            color #666
            font-size .12rem
            line-height .24rem
            font-weight 500
        }
    }
}
</style>


