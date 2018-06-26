import fetch from '@/config/fetch'

/**
 * 获取电话记录
 */

export const cixi_list = data => fetch('/waibao/entity/cixi_list', data, 'POST');
export const entity_cixi_edit = data => fetch('/waibao/entity/cixi_edit', data, 'POST');
export const entity_categories = data => fetch('/waibao/entity/categories', data, 'POST');
