import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const test_list = data => fetch('/guanmei/test/index', data, 'POST').then(check_login);
export const test_edit = data => fetch('/guanmei/test/edit', data, 'POST').then(check_login);
export const test_verify = data => fetch('/guanmei/test/verify', data, 'POST').then(check_login);
export const test_del = data => fetch('/guanmei/test/del', data, 'POST').then(check_login);
export const test_info = data => fetch('/guanmei/test/info', data, 'POST').then(check_login);
export const test_sort = data => fetch('/guanmei/test/sort', data, 'POST').then(check_login);



