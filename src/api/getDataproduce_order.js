import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const produce_order_list = data => fetch('/guanmei/produce_order/index', data, 'POST').then(check_login);
export const produce_order_all_list = data => fetch('/guanmei/produce_order/all_list', data, 'POST').then(check_login);
export const produce_order_edit = data => fetch('/guanmei/produce_order/edit', data, 'POST').then(check_login);
export const produce_order_verify = data => fetch('/guanmei/produce_order/verify', data, 'POST').then(check_login);
export const produce_order_del = data => fetch('/guanmei/produce_order/del', data, 'POST').then(check_login);
export const produce_order_info = data => fetch('/guanmei/produce_order/info', data, 'POST').then(check_login);
export const produce_order_sort = data => fetch('/guanmei/produce_order/sort', data, 'POST').then(check_login);



