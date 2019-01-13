/**
 * Created by yyy on 18/6/25.
 */
import { baseUrl } from './env'
export default {
    status_success : 100,
    upload_url:baseUrl + '/waibao/common/qiniu_upload?bucket=guanmei',
    sales_order_excel_out:baseUrl + '/guanmei/sales_order/excel_out',
    produce_order_excel_out:baseUrl + '/guanmei/produce_order/excel_out',
}