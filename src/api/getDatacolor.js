import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const color_list = data => fetch('/guanmei/color/index', data, 'POST').then(check_login);
export const color_edit = data => fetch('/guanmei/color/edit', data, 'POST').then(check_login);
export const color_verify = data => fetch('/guanmei/color/verify', data, 'POST').then(check_login);
export const color_del = data => fetch('/guanmei/color/del', data, 'POST').then(check_login);
export const color_info = data => fetch('/guanmei/color/info', data, 'POST').then(check_login);
export const color_sort = data => fetch('/guanmei/color/sort', data, 'POST').then(check_login);



