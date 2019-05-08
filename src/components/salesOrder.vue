<template>
    <div style="text-align: left">

        <div style="width: 100%;font-size: 20px;font-weight: bolder;text-align: center;padding: 30px;padding-top: 10px;">生产计划单({{order_info.sales_man}})</div>
        <!--<div class="item-item" style="padding: 10px;float: left">-->
        <!--客户单号:{{order_info.custom_order_no}}-->
        <!--</div>-->
        <div class="item-item" style="float: left">
            客户:{{order_info.custom_name}}
        </div>
        <div class="item-item" style="margin-left:20px;float: left">
            订单号:{{order_info.custom_order_no}}
            <!--交货日期:{{order_info.delivery_date}}-->
        </div>
        <div class="item-item" style="float: right">
            帽类:{{order_info.sales_order_sub[0].product_cat_name}}<span v-if="order_info.sales_order_sub[0].product_name">({{order_info.sales_order_sub[0].product_name}})</span>
            <!--交货日期:{{order_info.delivery_date}}-->
        </div>
        <div style="clear: both"></div>

        <div style="width: 100%;height:10px;"></div>

        <table border="1" cellspacing="0" style="width: 100%">

            <tr>
                <td>产品型号:{{order_info.sales_order_sub[0].custom_model}}</td>
                <td>数/件:</td>
                <td>件数:</td>
                <td>总数量:{{order_info.sum}}</td>
                <td>交货日期:{{order_info.delivery_date}}</td>
            </tr>

            <tr>
                <td colspan="4" style="width: 50%;vertical-align: top">
                    <table style="width: 100%;">

                        <template v-for="(color, index)  in order_info.sales_order_sub[0].colors">
                            <tr style="font-weight: bolder">
                                <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">颜色</td>
                                <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">数量</td>
                                <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">尺寸</td>
                                <td style="border-bottom: 1px solid #999">{{color.go_name}}</td>
                            </tr>
                            <template v-for="(detail, index2)  in color.color_details"  >
                                <tr >
                                    <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">{{color.name}}{{color.custom_model?'-'+color.custom_model:''}}</td>
                                    <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">{{detail.sum}}</td>
                                    <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">{{detail.size}}</td>
                                    <td style="border-bottom: 1px solid #999">{{detail.go}}</td>
                                </tr>
                            </template>
                        </template>

                    </table>
                </td>
                <td style="vertical-align: top">

                    <table  style="width: 100%;">
                        <tr >
                            <td colspan="2" style="border-bottom: 1px solid #999">
                                <img style="margin: 5px;" width="150" v-for="(img, index)  in order_info.sales_order_sub[0].sample_imgs" :src="img.url">

                            </td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">材料说明:</td>
                            <td style="width: 80%;border-bottom: 1px solid #999">{{order_info.sales_order_sub[0].raw_material}}</td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">备注说明:</td>
                            <td style="width: 80%;border-bottom: 1px solid #999">{{order_info.sales_order_sub[0].sample_info}}</td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">装饰说明:</td>
                            <td style="width: 80%;border-bottom: 1px solid #999">{{order_info.sales_order_sub[0].decoration}}</td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">每箱数量:</td>
                            <td style="width: 80%;border-bottom: 1px solid #999">{{order_info.package_containment}}</td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">箱数:</td>
                            <td style="width: 80%;border-bottom: 1px solid #999">{{order_info.package_num}}</td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">包装配色:</td>
                            <td style="width: 80%;border-bottom: 1px solid #999">{{order_info.package_short_info}}</td>
                        </tr>
                        <tr>
                            <td style="border-right: 1px solid #999;border-bottom: 1px solid #999">箱麦:</td>
                            <td style="width: 80%;border-bottom: 1px solid #999"><div v-html="order_info.package_info"></div></td>
                        </tr>

                        <!--<tr>-->
                            <!--<td>包装说明:</td>-->
                            <!--<td style="width: 80%">{{order_info.sales_order_sub[0].product_cat_name}}</td>-->
                        <!--</tr>-->
                        <tr>
                            <td style="border-right: 1px solid #999;">生产流程:</td>
                            <td style="width: 80%;">
                                <span v-for="(_process, index) in order_info.sales_order_sub[0].process" >{{_process.name}}-></span>完成

                            </td>
                        </tr>
                    </table>

                </td>

            </tr>

        </table>


        <!--<div v-for="(item, index)  in order_info.sales_order_sub" :key='index'>-->
            <!--<div class="item-item" style="padding: 10px;display: inline-block;width: 20%;vertical-align: top">-->
                <!--帽型:{{item.product_cat_name}}-{{item.product_name}}-->
            <!--</div>-->
            <!--<div style="padding: 10px;display: inline-block;width: 70%;">-->
                <!--<template v-for="(color, index2)  in item.colors">-->
                    <!--<div class="item-item" style="padding: 10px;padding-top:0;display: inline-block;vertical-align: top;width: 30%;">-->
                        <!--颜色:{{color.name}}(总数量:{{color.sum}})-->
                    <!--</div>-->
                    <!--<div style="float:right;width: 60%;">-->
                        <!--<template v-for="(detail, index3)  in color.color_details"  >-->
                            <!--<div class="item-item" style="padding: 10px;padding-top:0;display: inline-block">-->
                                <!--尺寸:{{detail.size}}<span style="width: 10px;display: inline-block"></span>-->
                                <!--型号:{{detail.model}}-->
                                <!--<span style="width: 10px;display: inline-block"></span>-->
                                <!--去向:{{detail.go}}-->
                                <!--<span style="width: 10px;display: inline-block"></span>-->
                                <!--数量:{{detail.sum}}-->
                            <!--</div>-->
                            <!--<br/>-->
                        <!--</template>-->

                    <!--</div>-->
                    <!--<div style="clear: both"></div>-->
                    <!--<div v-if="index2<(item.colors.length-1)" style="width: 100%;height:1px;border-bottom: 1px dashed #999"></div>-->
                    <!--<br/>-->
                <!--</template>-->

            <!--</div>-->
            <!--<div style="width: 100%;height:1px;border-bottom: 1px dashed #999"></div>-->
            <!--<div style="width: 100%;height:20px;"></div>-->

            <!--<div>-->
                <!--<div class="item-item" style="padding: 10px;float: left;width: 40%;height: auto">-->
                    <!--材料:<br/>{{item.raw_material}}-->
                <!--</div>-->
                <!--<div class="item-item" style="padding: 10px;float: right;width: 40%;height: auto">-->
                    <!--装饰说明:<br/>{{item.decoration}}-->
                <!--</div>-->
                <!--<div style="clear: both"></div>-->
            <!--</div>-->
            <!--<div style="width: 100%;height:1px;border-bottom: 1px dashed #999"></div>-->
            <!--<div style="width: 100%;height:20px;"></div>-->
            <!--<div>-->
                <!--<div class="item-item" style="padding: 10px;float: left;width: 40%;height: auto">-->
                    <!--客户款式:<br/>{{item.custom_model}}-->
                <!--</div>-->
                <!--<div class="item-item" style="padding: 10px;float: right;width: 40%;height: auto">-->
                    <!--备注说明:<br/>{{item.sample_info}}-->
                <!--</div>-->
                <!--<div style="clear: both"></div>-->
            <!--</div>-->
            <!--<div style="width: 100%;height:1px;border-bottom: 1px dashed #999"></div>-->
            <!--<div style="width: 100%;height:20px;"></div>-->
            <!--<div>-->
                <!--&lt;!&ndash;<div class="item-item" style="padding: 10px;float: left;width: 40%;height: auto">&ndash;&gt;-->
                <!--&lt;!&ndash;备注说明:<br/>{{item.sample_info}}&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--<div class="item-item" style="padding: 10px;width: 100%;height: auto">-->
                    <!--流程:<br/><span v-for="(_process, index) in item.process" >{{_process.name}}-></span>完成-->
                <!--</div>-->
                <!--<div style="clear: both"></div>-->
            <!--</div>-->
            <!--<div style="width: 100%;height:1px;border-bottom: 1px dashed #999"></div>-->
            <!--<div style="width: 100%;height:20px;"></div>-->
            <!--<div>-->
                <!--<div class="item-item" style="padding: 10px;width: 100%;height: auto">-->
                    <!--样品图:<br/> <img style="margin: 5px;" width="80" v-for="(img, index)  in item.sample_imgs" :src="img.url">-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
        <div style="width: 100%;height:10px;"></div>
        <div class="item-item" style="padding: 10px;float: left">
            当前状态:
            <span v-if="order_info.status == 5">草稿，待提交</span>
            <span v-if="order_info.status == 1" >待安排生产</span>
            <span v-if="order_info.status == 2" >已安排生产</span>
            <span v-if="order_info.status == 3" >已完成</span>
            <span v-if="order_info.status == 4" >生成单已删除</span>
        </div>
        <div class="item-item" style="padding: 10px;float: right">
            制单日期:{{order_info.order_date}}
        </div>
        <!--<div class="item-item" style="padding: 10px;float: right">-->
            <!--业务员:{{order_info.sales_man}}-->
        <!--</div>-->
        <div style="clear: both"></div>
    </div>

</template>

<script>

    export default {
        props: ['order_info'],
    	data(){
    		return {

    		}
    	},

    }
</script>

<style lang="less" scoped>
	@import '../style/mixin';

</style>
