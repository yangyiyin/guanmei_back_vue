import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo} from '@/api/getData'
import constant from '@/config/constant'
Vue.use(Vuex)

const state = {
	constant:constant,
	adminInfo: {
		avatar: 'default.jpg'
	},
	percentage:0
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
	},
	set_percentage(state, percentage){
		state.percentage = percentage;
	},
	add_percentage(state, percentage){
		var percentage = state.percentage + parseInt(percentage);
		if (percentage >= 99) {
			percentage = 99;
		}
		state.percentage = percentage;
	},
}

const actions = {

}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})