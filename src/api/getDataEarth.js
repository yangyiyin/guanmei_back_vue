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
export const cixi_list = data => fetch('/waibao/entity/cixi_list', data, 'POST').then(check_login);
export const entity_cixi_edit = data => fetch('/waibao/entity/cixi_edit', data, 'POST').then(check_login);;
export const entity_categories = data => fetch('/waibao/entity/categories', data, 'POST').then(check_login);
export const managerrecommend_tmp_add = data => fetch('//88plus.net/public/index.php/ADMINAPIManagerrecommend/managerrecommend/tmp_add', data, 'POST');
export const managerrecommend_cache_data = data => fetch('//88plus.net/public/index.php/ADMINAPI/managerrecommend/cache_data', data, 'POST');
export const managerrecommend_tmp_list = data => fetch('/managerrecommend/template/index', data, 'POST').then(check_login);
export const managerrecommend_tmp_info = data => fetch('/managerrecommend/template/info', data, 'POST').then(check_login);
export const managerrecommend_tmp_verify = data => fetch('/managerrecommend/template/verify', data, 'POST').then(check_login);
export const managerrecommend_tmp_del = data => fetch('/managerrecommend/template/del', data, 'POST').then(check_login);
export const managerrecommend_user_list = data => fetch('/managerrecommend/user/index', data, 'POST').then(check_login);
export const managerrecommend_user_info = data => fetch('/managerrecommend/user/info', data, 'POST').then(check_login);
export const managerrecommend_user_verify = data => fetch('/managerrecommend/user/verify', data, 'POST').then(check_login);
export const managerrecommend_user_del = data => fetch('/managerrecommend/user/del', data, 'POST').then(check_login);
export const managerrecommend_vip_extend = data => fetch('/managerrecommend/user/vip_extend', data, 'POST').then(check_login);
