import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const process_list = data => fetch('/guanmei/process/index', data, 'POST').then(check_login);
export const process_all_list = data => fetch('/guanmei/process/all_list', data, 'POST').then(check_login);
export const process_edit = data => fetch('/guanmei/process/edit', data, 'POST').then(check_login);
export const process_verify = data => fetch('/guanmei/process/verify', data, 'POST').then(check_login);
export const process_del = data => fetch('/guanmei/process/del', data, 'POST').then(check_login);
export const process_info = data => fetch('/guanmei/process/info', data, 'POST').then(check_login);
export const process_sort = data => fetch('/guanmei/process/sort', data, 'POST').then(check_login);



