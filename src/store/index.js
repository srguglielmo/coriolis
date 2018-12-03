import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { CommonStore as Common, ShipStore as Ship } from "./modules";

export default new Vuex.Store({
  state: {},
  modules: {
    Common,
    Ship
  },
  mutations: {},
  actions: {}
});
