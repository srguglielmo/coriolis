import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { CommonStore as Common } from "./modules";

export default new Vuex.Store({
  state: {},
  modules: {
    Common
  },
  mutations: {},
  actions: {}
});
