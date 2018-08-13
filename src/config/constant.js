/**
 * Created by yyy on 18/6/25.
 */
import { baseUrl } from './env'
export default {
    status_success : 100,
    upload_url:baseUrl + '/waibao/common/qiniu_upload?bucket=wenyuanjiaoyu',
    examination_daoru_excel_url:baseUrl + '/wenyuanjiaoyu/examination_signs/excel_in',
    examination_daoru_excel_out:baseUrl + '/wenyuanjiaoyu/examination_signs/excel_out',
    words_content_daoru_excel_in:baseUrl + '/wenyuanjiaoyu/words_content/excel_in',
    words_content_daochu_excel_out:baseUrl + '/wenyuanjiaoyu/words_content/excel_out',
}