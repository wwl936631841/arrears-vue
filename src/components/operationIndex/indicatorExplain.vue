<template>
  <div id="indicatorExplain">
    <van-nav-bar title="指标解释" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="explain-text">
      <h4 v-text="explain[name]['title']"></h4>
      <ul class="item-text">
        <li v-for="(item, index) in explain[name]['list']" :key="'key_'+index">
          <b v-text="item.title"></b>
          <span v-html="item.content"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import explainText from '../../utils/explainText'
import GetUrlParam from '@/utils/urlParse'
export default {
  data() {
    return {
      explain: explainText,
      name: ''
    }
  },
  methods: {
    onClickLeft() {
          let fromPhone = GetUrlParam('fromPhone')
          if ((fromPhone == "android") || (fromPhone == "iOS")) {
              window.location.href = "zjh://close"
          } else if (fromPhone == null) {
              this.$router.go(-1)
          }
      }
    
  },
  created() {
    this.name = this.$route.query.name
  }
}
</script>

<style scoped>
@import '../../stylus/operationIndex/base.css';

#indicatorExplain .van-nav-bar__title {
  font-size: 17px;
}

#indicatorExplain .van-nav-bar__arrow {
  font-size: 20px;
  color: #666666;
  font-weight: 600;
}

#indicatorExplain .firstTitle {
  font-size: 16px;
}
.van-nav-bar__title {
  font-weight: 700;
}
.explain-text{
  font-size: .12rem;
  padding: 0 .12rem;
  line-height: 2em;
}
.explain-text h4{
  font-size: .14rem;
  margin: .1rem 0;
  color: #313131;
}
.explain-text .item-text b{
  color: #313131;
}
.explain-text .item-text span{
  color: #666666;
}
</style>

