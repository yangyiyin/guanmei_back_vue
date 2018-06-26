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
