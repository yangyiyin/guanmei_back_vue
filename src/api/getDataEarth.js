import fetch from '@/config/fetch'
import router from '@/router'
/**
 * 获取电话记录
 */

var check_login = function(res){
    return new Promise(function(resolve,reject){
        if (res.code == 999) {
            router.push('/');
        } else {
            resolve(res);
        }

    });
}
export const config_list = data => fetch('/guanmei/config/index', data, 'POST').then(check_login);
export const config_edit = data => fetch('/guanmei/config/edit', data, 'POST').then(check_login);
export const admin_user_list = data => fetch('/guanmei/admin_user/index', data, 'POST').then(check_login);
export const admin_user_edit = data => fetch('/guanmei/admin_user/edit', data, 'POST').then(check_login);
export const admin_user_verify = data => fetch('/guanmei/admin_user/verify', data, 'POST').then(check_login);
export const admin_user_del = data => fetch('/guanmei/admin_user/del', data, 'POST').then(check_login);
export const admin_user_info = data => fetch('/guanmei/admin_user/info', data, 'POST').then(check_login);
export const admin_group_list = data => fetch('/guanmei/admin_group/index', data, 'POST').then(check_login);
export const admin_group_all_list = data => fetch('/guanmei/admin_group/all_list', data, 'POST').then(check_login);
export const admin_group_edit = data => fetch('/guanmei/admin_group/edit', data, 'POST').then(check_login);
export const admin_group_verify = data => fetch('/guanmei/admin_group/verify', data, 'POST').then(check_login);
export const admin_group_del = data => fetch('/guanmei/admin_group/del', data, 'POST').then(check_login);
export const admin_group_info = data => fetch('/guanmei/admin_group/info', data, 'POST').then(check_login);
export const admin_group_sort = data => fetch('/guanmei/admin_group/sort', data, 'POST').then(check_login);

export const admin_purview_tree = data => fetch('/guanmei/admin_purview/tree', data, 'POST').then(check_login);
export const admin_purview_all_list = data => fetch('/guanmei/admin_purview/all_list', data, 'POST').then(check_login);
export const admin_purview_edit = data => fetch('/guanmei/admin_purview/edit', data, 'POST').then(check_login);
export const admin_purview_verify = data => fetch('/guanmei/admin_purview/verify', data, 'POST').then(check_login);
export const admin_purview_del = data => fetch('/guanmei/admin_purview/del', data, 'POST').then(check_login);
export const admin_purview_info = data => fetch('/guanmei/admin_purview/info', data, 'POST').then(check_login);
export const admin_purview_sort = data => fetch('/guanmei/admin_purview/sort', data, 'POST').then(check_login);

