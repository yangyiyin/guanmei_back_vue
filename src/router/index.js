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
const admin_orgnize = r => require.ensure([], () => r(require('@/page_biz/admin_orgnize')), 'admin_orgnize');
const add_admin_orgnize = r => require.ensure([], () => r(require('@/page_biz/add_admin_orgnize')), 'add_admin_orgnize');
const color = r => require.ensure([], () => r(require('@/page_biz/color')), 'color');
const add_color = r => require.ensure([], () => r(require('@/page_biz/add_color')), 'add_color');
const product_category = r => require.ensure([], () => r(require('@/page_biz/product_category')), 'product_category');
const add_product_category = r => require.ensure([], () => r(require('@/page_biz/add_product_category')), 'add_product_category');
const product = r => require.ensure([], () => r(require('@/page_biz/product')), 'product');
const add_product = r => require.ensure([], () => r(require('@/page_biz/add_product')), 'add_product');
const _process = r => require.ensure([], () => r(require('@/page_biz/process')), 'process');
const add_process = r => require.ensure([], () => r(require('@/page_biz/add_process')), 'add_process');
const process_produce_order = r => require.ensure([], () => r(require('@/page_biz/process_produce_order')), 'process_produce_order');
const process_saoyisao = r => require.ensure([], () => r(require('@/page_biz/process_saoyisao')), 'process_saoyisao');
const process_survey = r => require.ensure([], () => r(require('@/page_biz/process_survey')), 'process_survey');
const storage_produce_order = r => require.ensure([], () => r(require('@/page_biz/storage_produce_order')), 'storage_produce_order');
const storage = r => require.ensure([], () => r(require('@/page_biz/storage')), 'storage');
const add_storage = r => require.ensure([], () => r(require('@/page_biz/add_storage')), 'add_storage');
const produce_order = r => require.ensure([], () => r(require('@/page_biz/produce_order')), 'produce_order');
const add_produce_order = r => require.ensure([], () => r(require('@/page_biz/add_produce_order')), 'add_produce_order');
const sales_order = r => require.ensure([], () => r(require('@/page_biz/sales_order')), 'sales_order');
const add_sales_order = r => require.ensure([], () => r(require('@/page_biz/add_sales_order')), 'add_sales_order');

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
				path: '/admin_orgnize',
				component: admin_orgnize,
				meta: ['后台管理', '部门管理'],
			},
			{
				path: '/add_admin_orgnize',
				component: add_admin_orgnize,
				meta: ['后台管理', '添加部门'],
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
				meta: ['后台管理', '权限组权限'],
			},

{path: '/color',component: color,meta: ['设置', '颜色'],},
{path: '/add_color',component: add_color,meta: ['设置', '设置颜色'],},
{path: '/product_category',component: product_category,meta: ['设置', '帽子种类管理'],},
{path: '/add_product_category',component: add_product_category,meta: ['设置', '设置帽子种类'],},
{path: '/product',component: product,meta: ['设置', '帽子型号管理'],},
{path: '/add_product',component: add_product,meta: ['设置', '设置帽子型号'],},
{path: '/process',component: _process,meta: ['设置', '流程管理'],},
{path: '/add_process',component: add_process,meta: ['设置', '设置流程'],},
{path: '/process_produce_order',component: process_produce_order,meta: ['交接单', '订单交接'],},
{path: '/process_saoyisao',component: process_saoyisao,meta: ['交接单', '扫码交接'],},
{path: '/process_survey',component: process_survey,meta: ['流程概况', '概况'],},
{path: '/storage_produce_order',component: storage_produce_order,meta: ['仓库', '生产单管理'],},
{path: '/storage',component: storage,meta: ['仓库', '库存管理'],},
{path: '/add_storage',component: add_storage,meta: ['仓库', '设置库存'],},
{path: '/produce_order',component: produce_order,meta: ['生产单', '生产单管理'],},
{path: '/add_produce_order',component: add_produce_order,meta: ['生产单', '设置生产单'],},
{path: '/sales_order',component: sales_order,meta: ['业务单', '业务单管理'],},
{path: '/add_sales_order',component: add_sales_order,meta: ['业务单', '设置业务单'],},
//{#replace2#}

		]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
