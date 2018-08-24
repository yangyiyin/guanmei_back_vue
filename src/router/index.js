import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const error = r => require.ensure([], () => r(require('@/page/error')), 'error');
const welcome = r => require.ensure([], () => r(require('@/page/welcome')), 'welcome');
const config = r => require.ensure([], () => r(require('@/page_biz/config')), 'config');
const admin_user = r => require.ensure([], () => r(require('@/page_biz/admin_user')), 'admin_user');
const add_admin_user = r => require.ensure([], () => r(require('@/page_biz/add_admin_user')), 'add_admin_user');
const admin_group = r => require.ensure([], () => r(require('@/page_biz/admin_group')), 'admin_group');
const add_admin_group = r => require.ensure([], () => r(require('@/page_biz/add_admin_group')), 'add_admin_group');
const admin_purview = r => require.ensure([], () => r(require('@/page_biz/admin_purview')), 'admin_purview');
const add_admin_purview = r => require.ensure([], () => r(require('@/page_biz/add_admin_purview')), 'add_admin_purview');
const group_purview = r => require.ensure([], () => r(require('@/page_biz/group_purview')), 'group_purview');
const admin_log = r => require.ensure([], () => r(require('@/page_biz/admin_log')), 'admin_log');
const test = r => require.ensure([], () => r(require('@/page_biz/test')), 'test');
const add_test = r => require.ensure([], () => r(require('@/page_biz/add_test')), 'add_test');
//{#replace1#}

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
				path: '/',
				component: welcome,
				meta: ['首页',''],
			},
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
				meta: ['系统', '权限管理'],
			},
			{
				path: '/add_admin_purview',
				component: add_admin_purview,
				meta: ['系统', '添加权限'],
			},
			{
				path: '/admin_log',
				component: admin_log,
				meta: ['系统', '用户操作日志'],
			},
			{
				path: '/group_purview',
				component: group_purview,
				meta: ['后台管理', '用户组权限'],
			},

{path: '/test',component: test,meta: ['系统', '测试'],},
{path: '/add_test',component: add_test,meta: ['系统', '设置测试'],},
//{#replace2#}

		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
