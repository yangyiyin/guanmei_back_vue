import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const product_category_list = data => fetch('/guanmei/product_category/index', data, 'POST').then(check_login);
export const product_category_all_list = data => fetch('/guanmei/product_category/all_list', data, 'POST').then(check_login);
export const product_category_edit = data => fetch('/guanmei/product_category/edit', data, 'POST').then(check_login);
export const product_category_verify = data => fetch('/guanmei/product_category/verify', data, 'POST').then(check_login);
export const product_category_del = data => fetch('/guanmei/product_category/del', data, 'POST').then(check_login);
export const product_category_info = data => fetch('/guanmei/product_category/info', data, 'POST').then(check_login);
export const product_category_sort = data => fetch('/guanmei/product_category/sort', data, 'POST').then(check_login);



