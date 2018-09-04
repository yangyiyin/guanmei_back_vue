import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const sales_order_list = data => fetch('/guanmei/sales_order/index', data, 'POST').then(check_login);
export const sales_order_all_list = data => fetch('/guanmei/sales_order/all_list', data, 'POST').then(check_login);
export const sales_order_edit = data => fetch('/guanmei/sales_order/edit', data, 'POST').then(check_login);
export const sales_order_verify = data => fetch('/guanmei/sales_order/verify', data, 'POST').then(check_login);
export const sales_order_del = data => fetch('/guanmei/sales_order/del', data, 'POST').then(check_login);
export const sales_order_info = data => fetch('/guanmei/sales_order/info', data, 'POST').then(check_login);
export const sales_order_sort = data => fetch('/guanmei/sales_order/sort', data, 'POST').then(check_login);



