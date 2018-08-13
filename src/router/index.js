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
const examination = r => require.ensure([], () => r(require('@/page_biz/examination')), 'examination');
const examination_edit = r => require.ensure([], () => r(require('@/page_biz/examination_edit')), 'examination_edit');
const examination_signs = r => require.ensure([], () => r(require('@/page_biz/examination_signs')), 'examination_signs');
const users = r => require.ensure([], () => r(require('@/page_biz/users')), 'users');
const config = r => require.ensure([], () => r(require('@/page_biz/config')), 'config');
const suggest = r => require.ensure([], () => r(require('@/page_biz/suggest')), 'suggest');


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
				meta: ['学校管理', '新闻列表'],
			},
			{
				path: '/add_news',
				component: add_news,
				meta: ['学校管理', '编辑新闻'],
			},
			{
				path: '/sign',
				component: sign,
				meta: ['学校管理', '报名管理'],
			},
			{
				path: '/sign_edit',
				component: sign_edit,
				meta: ['学校管理', '编辑报名简章'],
			},
			{
				path: '/examination',
				component: examination,
				meta: ['学校管理', '考试管理'],
			},
			{
				path: '/examination_edit',
				component: examination_edit,
				meta: ['学校管理', '编辑考试'],
			},
			{
				path: '/examination_signs',
				component: examination_signs,
				meta: ['学校管理', '考试学员情况'],
			},
			{
				path: '/users',
				component: users,
				meta: ['学校管理', '微信小程序用户'],
			},
			{
				path: '/suggest',
				component: suggest,
				meta: ['学校管理', '家长反馈'],
			},
			{
				path: '/config',
				component: config,
				meta: ['系统设置', '参数配置'],
			}

		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
