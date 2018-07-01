import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const error = r => require.ensure([], () => r(require('@/page/error')), 'error');
const phone_contact = r => require.ensure([], () => r(require('@/page_biz/phone_contact')), 'phone_contact');
const managerrecommend_template = r => require.ensure([], () => r(require('@/page_biz/managerrecommend_template')), 'managerrecommend_template');


const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [
			{
				path: '/phone_contact',
				component: phone_contact,
				meta: ['电话联系', '慈溪电联记录'],
			},
			{
				path: '/managerrecommend_template',
				component: managerrecommend_template,
				meta: ['店长的推荐', '模板'],
			},
			{
				path: '/error',
				component: error,
				meta: ['错误', '错误'],
			}

		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
