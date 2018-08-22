import fetch from '@/config/fetch'

/**
 * 登陆
 */

export const login = data => fetch('/guanmei/admin/login', data, 'POST');



