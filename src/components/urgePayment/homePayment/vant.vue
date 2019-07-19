<template>
    <div id="vant">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad">
        <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
          <van-cell v-for="item in list" :key="item" :title="item"></van-cell>
        </van-pull-refresh>
      </van-list>
    </div>
</template>

<script>
  export default {
    name:'vant',
    data() {
      return {
        list: [],
        loading: false,
        refreshLoading: false,
        finished: false
      };
    },

    methods: {
      onLoad() {
        alert('触发了load事件')
        // 异步更新数据
        setTimeout(() => {
          for (let i = 0; i < 5; i++) {
            this.list.push(this.list.length + 1);
          }
          // 加载状态结束
          this.loading = false;

          // 数据全部加载完成
          if (this.list.length >= 40) {
            this.finished = true;
          }
        }, 500);
      },
      onRefresh() {
        setTimeout(() => {
          this.$toast('刷新成功');
          this.refreshLoading = false;
          this.count++;
        }, 500);
      }
    }
  }
</script>

<style scoped lang="stylus">
  #vant
    .van-cell
      height: 2rem
      border: 1px solid red

</style>
