<template>
  <div>
    <h1>Home</h1>
    <ul id="example-2">
      <li v-for="(item, index) in list" :key="index">
        <router-link class="enter" :to="item.path">{{item.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>

  // import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
  // let vConsole = new VConsole() // 初始化

  export default {
    name: "home",
    data() {
      return {
        list: [
          {
            name: 'temp',
            path: '/vueTest',
          },
          {
            name: '审计首页',
            path: '/auditTaskList',
          },
          {
            name: '催缴',
            path: '/urgePayment',
          },
          {
            name: 'operationIndex',
            path: '/operationIndex',
          },
          {
            name: 'chargeRecord',
            path: '/chargeRecord',
          },
          {
            name: 'financeAI',
            path: '/financeAI',
          },
          {
            name: 'parkingLotAI',
            path: '/parkingLotAI',
          }, {
            name: '催缴任务',
            path: 'arrears/reminderTask',
          },

        ],
        loading: false,
        finished: false
      };
    }
  }
</script>

<style scoped lang="stylus">
  h1{
    font-size :0.32rem;
  }
  li {
    /*display: block*/
    height: .4rem;
    position relative
    .enter{
      position absolute
      font-size .16rem
    }
  }
</style>
