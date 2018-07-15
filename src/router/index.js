import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const error = r => require.ensure([], () => r(require('@/page/error')), 'error');
const news = r => require.ensure([], () => r(require('@/page_biz/news')), 'news');
const add_news = r => require.ensure([], () => r(require('@/page_biz/add_news')), 'add_news');
const sign = r => require.ensure([], () => r(require('@/page_biz/sign')), 'sign');
const sign_edit = r => require.ensure([], () => r(require('@/page_biz/sign_edit')), 'sign_edit');


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
				path: '/news',
				component: news,
				meta: ['新闻管理', '新闻列表'],
			},
			{
				path: '/add_news',
				component: add_news,
				meta: ['新闻管理', '编辑新闻'],
			},
			{
				path: '/sign',
				component: sign,
				meta: ['教务管理', '报名管理'],
			},
			{
				path: '/sign_edit',
				component: sign_edit,
				meta: ['教务管理', '编辑报名简章'],
			},
			// {
			// 	path: '/examination',
			// 	component: examination,
			// 	meta: ['教务管理', '考试管理'],
			// }

		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
