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
export const examination_list = data => fetch('/wenyuanjiaoyu/examination/index', data, 'POST').then(check_login);
export const examination_info = data => fetch('/wenyuanjiaoyu/examination/info', data, 'POST').then(check_login);
export const examination_verify = data => fetch('/wenyuanjiaoyu/examination/verify', data, 'POST').then(check_login);
export const examination_del = data => fetch('/wenyuanjiaoyu/examination/del', data, 'POST').then(check_login);
export const examination_edit = data => fetch('/wenyuanjiaoyu/examination/edit', data, 'POST').then(check_login);
export const examination_sort = data => fetch('/wenyuanjiaoyu/examination/sort', data, 'POST').then(check_login);
export const examination_excel_out = data => fetch('/wenyuanjiaoyu/examination_signs/excel_out', data, 'POST').then(check_login);
export const examination_gen_ticket = data => fetch('/wenyuanjiaoyu/examination_signs/gen_ticket', data, 'POST').then(check_login);
export const examination_send_mail = data => fetch('/wenyuanjiaoyu/examination_signs/send_mail', data, 'POST').then(check_login);
export const examination_signs_list = data => fetch('/wenyuanjiaoyu/examination_signs/index', data, 'POST').then(check_login);
export const setCanEditAvatar = data => fetch('/wenyuanjiaoyu/examination_signs/setCanEditAvatar', data, 'POST').then(check_login);
export const users_list = data => fetch('/wenyuanjiaoyu/users/index', data, 'POST').then(check_login);
export const users_verify = data => fetch('/wenyuanjiaoyu/users/verify', data, 'POST').then(check_login);
export const users_del = data => fetch('/wenyuanjiaoyu/users/del', data, 'POST').then(check_login);
export const config_list = data => fetch('/wenyuanjiaoyu/config/index', data, 'POST').then(check_login);
export const config_edit = data => fetch('/wenyuanjiaoyu/config/edit', data, 'POST').then(check_login);
export const get_course_list = data => fetch('/wenyuanjiaoyu/student/get_course_list', data, 'POST').then(check_login);
export const suggest_list = data => fetch('/wenyuanjiaoyu/suggest/index', data, 'POST').then(check_login);
export const words_list = data => fetch('/wenyuanjiaoyu/words/index', data, 'POST').then(check_login);
export const words_edit = data => fetch('/wenyuanjiaoyu/words/edit', data, 'POST').then(check_login);
export const words_del = data => fetch('/wenyuanjiaoyu/words/del', data, 'POST').then(check_login);
export const words_info = data => fetch('/wenyuanjiaoyu/words/info', data, 'POST').then(check_login);
export const words_content_list = data => fetch('/wenyuanjiaoyu/words_content/index', data, 'POST').then(check_login);
export const words_content_edit = data => fetch('/wenyuanjiaoyu/words_content/edit', data, 'POST').then(check_login);
export const words_content_excel_out = data => fetch('/wenyuanjiaoyu/words_content/excel_out', data, 'POST').then(check_login);
export const suggest_excel_out = data => fetch('/wenyuanjiaoyu/suggest/excel_out', data, 'POST').then(check_login);

