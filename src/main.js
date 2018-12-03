import Vue from "vue";
// import './plugins/axios';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import bugsnag from '@bugsnag/js';
import bugsnagVue from '@bugsnag/plugin-vue';
import "./registerServiceWorker";
import "./less/app.less";

Vue.config.productionTip = false;

const bugsnagClient = bugsnag({
	apiKey: 'ba9fae819372850fb660755341fa6ef5'
});

window.bugsnagClient = bugsnagClient;
bugsnagClient.use(bugsnagVue, Vue);

window.App = new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#coriolis");
