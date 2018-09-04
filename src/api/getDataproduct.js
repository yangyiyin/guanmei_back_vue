import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const product_list = data => fetch('/guanmei/product/index', data, 'POST').then(check_login);
export const product_edit = data => fetch('/guanmei/product/edit', data, 'POST').then(check_login);
export const product_verify = data => fetch('/guanmei/product/verify', data, 'POST').then(check_login);
export const product_del = data => fetch('/guanmei/product/del', data, 'POST').then(check_login);
export const product_info = data => fetch('/guanmei/product/info', data, 'POST').then(check_login);
export const product_sort = data => fetch('/guanmei/product/sort', data, 'POST').then(check_login);



