import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const error = r => require.ensure([], () => r(require('@/page/error')), 'error');
const phone_contact = r => require.ensure([], () => r(require('@/page_biz/phone_contact')), 'phone_contact');
const managerrecommend_template = r => require.ensure([], () => r(require('@/page_biz/managerrecommend_template')), 'managerrecommend_template');
const managerrecommend_template_list = r => require.ensure([], () => r(require('@/page_biz/managerrecommend_template_list')), 'managerrecommend_template_list');
const managerrecommend_user = r => require.ensure([], () => r(require('@/page_biz/managerrecommend_user')), 'managerrecommend_user');


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
				path: '/error',
				component: error,
				meta: ['错误', '错误'],
			},
			{
				path: '/phone_contact',
				component: phone_contact,
				meta: ['电话联系', '慈溪电联记录'],
			},
			{
				path: '/managerrecommend_template',
				component: managerrecommend_template,
				meta: ['店长的推荐', '制作模板'],
			},
			{
				path: '/managerrecommend_template_list',
				component: managerrecommend_template_list,
				meta: ['店长的推荐', '模板列表'],
			},
			{
				path: '/managerrecommend_user',
				component: managerrecommend_user,
				meta: ['店长的推荐', '用户管理'],
			}

		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
