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

export const news_list = data => fetch('/wenyuanjiaoyu/news/index', data, 'POST').then(check_login);
export const news_info = data => fetch('/wenyuanjiaoyu/news/info', data, 'POST').then(check_login);
export const news_verify = data => fetch('/wenyuanjiaoyu/news/verify', data, 'POST').then(check_login);
export const news_del = data => fetch('/wenyuanjiaoyu/news/del', data, 'POST').then(check_login);
export const news_edit = data => fetch('/wenyuanjiaoyu/news/edit', data, 'POST').then(check_login);
export const news_sort = data => fetch('/wenyuanjiaoyu/news/sort', data, 'POST').then(check_login);
export const sign_info_default = data => fetch('/wenyuanjiaoyu/sign/sign_info_default', data, 'POST').then(check_login);
export const sign_edit = data => fetch('/wenyuanjiaoyu/sign/edit', data, 'POST').then(check_login);
export const sign_signs_list = data => fetch('/wenyuanjiaoyu/sign_signs/index', data, 'POST').then(check_login);
export const sign_signs_del = data => fetch('/wenyuanjiaoyu/sign_signs/del', data, 'POST').then(check_login);
export const sign_signs_areas = data => fetch('/wenyuanjiaoyu/sign_signs/areas', data, 'POST').then(check_login);
