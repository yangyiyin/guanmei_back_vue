import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const sales_order_list = data => fetch('/guanmei/sales_order/index', data, 'POST').then(check_login);
export const sales_order_all_list = data => fetch('/guanmei/sales_order/all_list', data, 'POST').then(check_login);
export const sales_order_get_all = data => fetch('/guanmei/sales_order/get_all', data, 'POST').then(check_login);
export const sales_order_edit = data => fetch('/guanmei/sales_order/edit', data, 'POST').then(check_login);
export const sales_order_verify = data => fetch('/guanmei/sales_order/verify', data, 'POST').then(check_login);
export const sales_order_del = data => fetch('/guanmei/sales_order/del', data, 'POST').then(check_login);
export const sales_order_info = data => fetch('/guanmei/sales_order/info', data, 'POST').then(check_login);
export const sales_order_sort = data => fetch('/guanmei/sales_order/sort', data, 'POST').then(check_login);
export const init_select_options = data => fetch('/guanmei/sales_order/init_select_options', data, 'POST').then(check_login);
export const sales_sub_orders = data => fetch('/guanmei/sales_order_sub/index', data, 'POST').then(check_login);
export const sales_sub_orders_index_by_order = data => fetch('/guanmei/sales_order_sub/index_by_order', data, 'POST').then(check_login);



