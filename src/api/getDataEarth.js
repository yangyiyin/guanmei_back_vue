import fetch from '@/config/fetch'

/**
 * 获取电话记录
 */

export const cixi_list = data => fetch('/waibao/entity/cixi_list', data, 'POST');
