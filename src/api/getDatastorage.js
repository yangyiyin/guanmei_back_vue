import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const storage_list = data => fetch('/guanmei/storage/index', data, 'POST').then(check_login);
export const storage_all_list = data => fetch('/guanmei/storage/all_list', data, 'POST').then(check_login);
export const storage_edit = data => fetch('/guanmei/storage/edit', data, 'POST').then(check_login);
export const storage_verify = data => fetch('/guanmei/storage/verify', data, 'POST').then(check_login);
export const storage_del = data => fetch('/guanmei/storage/del', data, 'POST').then(check_login);
export const storage_info = data => fetch('/guanmei/storage/info', data, 'POST').then(check_login);
export const storage_sort = data => fetch('/guanmei/storage/sort', data, 'POST').then(check_login);



