import fetch from '@/config/fetch'

/**
 * 登陆
 */

export const login = data => fetch('/waibao/admin/login', data, 'POST');

/**
 * 退出
 */

export const signout = () => fetch('/admin/singout');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/admin/info');


