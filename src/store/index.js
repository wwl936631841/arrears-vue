import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import moduleA from './module/module_a'


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,

  modules: {
    moduleA
  }
})
