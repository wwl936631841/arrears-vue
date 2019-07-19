<template>
  <div id="phoneReminder">
    <header>
      <condition-search @orderByMoney="orderByMoney($event)" :iconRestore="iconRestore"
                        @orderByTimeSpan="orderByTimeSpan($event)"
                        @orderByStatus="orderByStatus($event)"
                        @queryBySearch="queryBySearch($event)" :statusType='2'/>
    </header>
    <main>
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" loading-text pulling-text="下拉刷新">
        <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
          <van-cell v-for="(item,index) in list" :key="index">
            <ul class="message">
              <li @click="smsDetail(item.taskId,item.houseId,2)">
                <div class="status">
                  <div class="left">
                    <span class="customName">{{ item.customName }}</span>
                    <div v-hasBtn class="followStatus" @click.stop="toggle(item,item.isFollow=!item.isFollow)">
                                                <span class="yes" v-if="item.isFollow">
                                                    <img src="../../../assets/img/urgePayment/icon_unfollow@2x.png"
                                                         alt="">已关注
                                                </span>
                      <span class="no" v-if="!item.isFollow">
                                                    + 关注
                                                </span>
                    </div>
                  </div>
                  <div class="right">
                    <span class="yes" v-show="item.payStatus">已支付</span>
                    <span class="no" v-show="!item.payStatus">未支付</span>
                  </div>
                </div>
                <div class="price">
                  <span>{{ item.arrearageMoney }}元</span>
                  <div>
                    <i style="position:relative">
                      <em class="jiantou"></em>
                      逾期{{ item.arrearageTime }}天
                    </i>
                  </div>
                </div>
                <!-- <div class="tip">
                    <img src="../../../assets/img/sms/tips@2x.png" alt="">
                    <span>{{ item.suggestedToHomeTime }}</span>
                </div> -->
                <div class="add">
                  <div class="left">
                    <img src="../../../assets/img/sms/location@2x.png" alt="">
                    <span>{{ item.uptownName }} {{ item.unitNumber }}</span>
                  </div>
                  <div class="right">
                    <div class="first" @click.stop="phone(item)" v-show="item.hasCalled==1">
                      <van-button v-hasBtn type="info">拨打</van-button>
                    </div>
                    <div class="nth" @click.stop="phone(item)" v-show="item.hasCalled==2">
                      <van-button v-hasBtn plain>再次拨打</van-button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </van-cell>
      <empty :isEmptyShow="isEmpty"></empty>
        </van-list>
      </van-pull-refresh>
    </main>
  </div>
</template>
<script>
  import reminder from '../reminderList.styl'
  import conditionSearch from '../common/conditionSearch'
  import empty from '../common/empty'
  import axios from 'axios'
  import GetUrlParam from '@/utils/urlParse'
  import {mapState} from 'vuex';

  export default {
    name: "phoneReminderIndex",
    components: {conditionSearch, empty},
    data() {
      return {
        isEmpty: false,     // 接口数组长度做判断

        type: 2,
        phoneArr: [],
        iconRestore: false,

        // 下拉加载刷新
        list: [],
        loading: false,
        finished: false,
        finishedText: '没有更多了',
        refreshLoading: false,
      }
    },
    computed: mapState([
      'conditionParam',   // 过滤参数
    ]),
    created() {

    },
    mounted() {

    },
    methods: {
      onLoad() {
        this.getPhoneList()
      },

      defaultParam() {
        return {
          orderColumn: 'visit_suggest',   // 默认值
          orderType: 'DESC',
          ownId: this.conditionParam.ownId,
          pageNo: 1,
          pageSize: 10,
          // type: 3,  // 1:短信催缴,2:电话催缴,3:上门催缴
          houseId: '',
          customName: '',
          status: '',

        }
      },

      onRefresh() {
        // 加载第一次请求
        this.list = []
        this.$store.commit('changeConditionParam', this.defaultParam())
        this.iconRestore = true
        this.getPhoneList(1)
        // 设置
      },

      isNum(num) {
        var reg = /^[1-9]\d*$|^0$/;
        if (reg.test(num) == true) {
          return true
        } else {
          return false
        }
      },

      orderByCondition(arr) {
        this.orderType = arr[0]
        this.orderColumn = arr[1]
      },

      // 默认排序字段   方法合并          约定好排序规则！　　然后做方法合并
      orderByMoney(arr) {
        this.isEmpty = false
        this.list = []
        this.conditionParam.pageNo = 1
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.getPhoneList()
      },

      // 根据欠费时长排序
      orderByTimeSpan(arr) {
        this.isEmpty = false
        this.list = []
        this.conditionParam.pageNo = 1
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.getPhoneList()
      },

      // 根据状态显示
      orderByStatus(val) {
        this.isEmpty = false
        this.list = []
        this.conditionParam.pageNo = 1
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.getPhoneList()
      },

      // 搜索
      queryBySearch(val) {
        this.isEmpty = false
        this.list = []
        this.conditionParam.pageNo = 1
        this.$store.commit('changeConditionParam', this.conditionParam)
        this.getPhoneList()
      },

      // 切换关注状态
      toggle(item) {
        if (item.isFollow == false) {
          this.$buryPoint('Remove-attention')
          axios.get(`${this.$envConfigObj.cuiJiaoPath}/attention/cancelFollow/${localStorage.getItem('userId')}/${item.houseId}`).then(function (res) {
            console.log('取消关注')
          })
          this.$toast({
            message: "已取消关注",
            position: {
              bottom: 50,
            },
          })
        } else {
          this.$buryPoint('attention')
          axios.post(this.$envConfigObj.cuiJiaoPath + '/attention/addFollow', {
            ownId: this.conditionParam.ownId,
            customPhone: item.customPhone,
            houseId: item.houseId,
            customType: 1,
            customAddress: item.uptownName + item.unitNumber + item.houseName,
            customName: item.customName,
          }).then(function (res) {
            console.log('关注')
          })
          this.$toast({
            message: "关注成功",
            position: {
              bottom: 50,
            },
          })
        }
      },

      // 跳转电话详情页
      smsDetail(taskId, houseId, type) {
        this.$router.push({
          name: "phoneDetail",
          query: {
            taskId: taskId,
            houseId: houseId,
            arrearType: this.type,
          }
        })
      },

      // 打电话接口
      call(item) {
        if (item.customPhone == '') {
          this.$toast({
            message: "该用户未录入电话",
          })
        }
        this.$buryPoint('call-icon')
        axios.post(this.$envConfigObj.cuiJiaoPath + '/arrears/phone/insertDial', {
          taskDetailId: item.taskId,
          houseId: item.houseId,
          arrearId:item.arrearId,
          ownerId: localStorage.getItem('userId'),
          telUser: item.customName,
          telPhone: item.customPhone,
        }).then((res) => {
          if (res.data.status == 0) {
            // console.log(11111)
            window.location.href = 'tel:' + item.customPhone
          }
        })
      },
      // 拨打电话
      phone(item) {

        //
        if (item.customPhone == '') {
          this.$toast({
            message: "该用户未录入电话",
          })
        }else{

          this.$dialog.confirm({
            message: item.customPhone,
            cancelButtonColor: "#007AFF",
            confirmButtonColor: "#007AFF",
            className: "confirmUpdate",
          }).then(() => {
            this.call(item)
          }).catch(() => {
  
          });
        }

      },

      // 获取电话催缴列表
      getPhoneList(type) {
        let that = this
        axios.post(
          this.$envConfigObj.cuiJiaoPath + '/arrears/home/page',
          {
            ...that.conditionParam,
            type: that.type,
          }
        ).then(res => {
          if (res.data.status == 0) {
            console.log('123',res)
            let totalCount = res.data.data.total
            that.loading = false;   // 加载状态结束
            that.phoneArr = res.data.data.records
            that.list = [...that.list, ...that.phoneArr]              //    数组pollfiy
            if (that.list.length == 0) {
              that.isEmpty = true
              that.finishedText = ''
            }
            // 刷新逻辑
            if (type === 1) {
              that.refreshLoading = false;
            }
            // 页码加1  下次从这里开始查
            that.conditionParam.pageNo++
            this.$store.commit('changeConditionParam', that.conditionParam)
            // 根据total做判断
            // 数据全部加载完成
            if (that.list.length >= totalCount) {
              that.finished = true;
            }
          }

        }).catch(err => {
          console.log(err)
        })
      }
    },
  }
</script>
<style lang="stylus">
  .confirmUpdate {
    width: 70%

    .van-dialog__content {
      .van-dialog__message {
        font-size .17rem;
        color #030303
      }
    }
  }
</style>

<style lang="stylus" scoped>
  #phoneReminder {
    // padding-top .44rem;
    header{
      height: .91rem;
      position relative
    }
    .van-list {
      height: 73vh;
      overflow: auto;
      .van-cell {
        padding: 0
        margin-bottom: .1rem
      }
    }

    .first, .nth {
      display: flex;
      justify-content: flex-end;

      .van-button {
        width .7rem
        height .3rem
        line-height .3rem
        padding 0
        border-radius 4px
      }
    }

    .nth {
      border 1px solid #268AED
      border-radius 4px;

      .van-button {
        color #268AED
        font-size .13rem;
      }
    }

    .jiantou {
      width: 0;
      height: 0;
      border-width: 0.05rem;
      border-style: solid;
      border-color: transparent #ddd transparent transparent;
      position: absolute;
      top: 2px;
      left: -0.1rem;
    }
  }
</style>

