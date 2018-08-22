import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const error = r => require.ensure([], () => r(require('@/page/error')), 'error');
const config = r => require.ensure([], () => r(require('@/page_biz/config')), 'config');
const admin_user = r => require.ensure([], () => r(require('@/page_biz/admin_user')), 'admin_user');
const add_admin_user = r => require.ensure([], () => r(require('@/page_biz/add_admin_user')), 'add_admin_user');
const admin_group = r => require.ensure([], () => r(require('@/page_biz/admin_group')), 'admin_group');
const add_admin_group = r => require.ensure([], () => r(require('@/page_biz/add_admin_group')), 'add_admin_group');
const admin_purview = r => require.ensure([], () => r(require('@/page_biz/admin_purview')), 'admin_purview');
const add_admin_purview = r => require.ensure([], () => r(require('@/page_biz/add_admin_purview')), 'add_admin_purview');


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
				path: '/config',
				component: config,
				meta: ['设置', '参数配置'],
			},
			{
				path: '/admin_user',
				component: admin_user,
				meta: ['后台管理', '用户管理'],
			},
			{
				path: '/add_admin_user',
				component: add_admin_user,
				meta: ['后台管理', '添加用户'],
			},
			{
				path: '/admin_group',
				component: admin_group,
				meta: ['后台管理', '组管理'],
			},
			{
				path: '/add_admin_group',
				component: add_admin_group,
				meta: ['后台管理', '添加组'],
			},
			{
				path: '/admin_purview',
				component: admin_purview,
				meta: ['开发者设置', '权限管理'],
			},
			{
				path: '/add_admin_purview',
				component: add_admin_purview,
				meta: ['开发者设置', '添加权限'],
			}

		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
