<template>
    <div style="text-align: left">

        <div style="width: 100%;font-size: 20px;font-weight: bolder;text-align: center;padding: 30px;padding-top: 10px;">冠美帽业-业务单({{order_info.custom_order_no}})</div>
        <!--<div class="item-item" style="padding: 10px;float: left">-->
        <!--客户单号:{{order_info.custom_order_no}}-->
        <!--</div>-->
        <div class="item-item" style="padding: 10px;float: left">
            客户姓名:{{order_info.custom_name}}
        </div>
        <div class="item-item" style="padding: 10px;float: right">
            交货日期:{{order_info.delivery_date}}
        </div>
        <div style="clear: both"></div>
        <div style="width: 100%;height:1px;border-bottom: 1px solid #999"></div>
        <div style="width: 100%;height:30px;"></div>
        <div v-for="(item, index)  in order_info.sales_order_sub" :key='index'>
            <div class="item-item" style="padding: 10px;display: inline-block;width: 20%;vertical-align: top">
                帽型:{{item.product_cat_name}}-{{item.product_name}}
            </div>
            <div style="padding: 10px;display: inline-block;width: 70%;">
                <template v-for="(color, index2)  in item.colors">
                    <div class="item-item" style="padding: 10px;padding-top:0;display: inline-block;vertical-align: top;width: 30%;">
                        颜色:{{color.name}}(总数量:{{color.sum}})
                    </div>
                    <div style="float:right;width: 60%;">
                        <template v-for="(detail, index3)  in color.color_details"  >
                            <div class="item-item" style="padding: 10px;padding-top:0;display: inline-block">
                                尺寸:{{detail.size}}<span style="width: 10px;display: inline-block"></span>
                                型号:{{detail.model}}
                                <span style="width: 10px;display: inline-block"></span>
                                去向:{{detail.go}}
                                <span style="width: 10px;display: inline-block"></span>
                                数量:{{detail.sum}}
                            </div>
                            <br/>
                        </template>

                    </div>
                    <div style="clear: both"></div>
                    <div v-if="index2<(item.colors.length-1)" style="width: 100%;height:1px;border-bottom: 1px dashed #999"></div>
                    <br/>
                </template>

            </div>
            <div style="width: 100%;height:1px;border-bottom: 1px dashed #999"></div>
            <div style="width: 100%;height:20px;"></div>

            <div>
                <div class="item-item" style="padding: 10px;float: left;width: 40%;height: auto">
                    材料:<br/>{{item.raw_material}}
                </div>
                <div class="item-item" style="padding: 10px;float: right;width: 40%;height: auto">
                    装饰说明:<br/>{{item.decoration}}
                </div>
                <div style="clear: both"></div>
            </div>
            <div style="width: 100%;height:1px;border-bottom: 1px dashed #999"></div>
            <div style="width: 100%;height:20px;"></div>
            <div>
                <div class="item-item" style="padding: 10px;float: left;width: 40%;height: auto">
                    客户款式:<br/>{{item.custom_model}}
                </div>
                <div class="item-item" style="padding: 10px;float: right;width: 40%;height: auto">
                    备注说明:<br/>{{item.sample_info}}
                </div>
                <div style="clear: both"></div>
            </div>
            <div style="width: 100%;height:1px;border-bottom: 1px dashed #999"></div>
            <div style="width: 100%;height:20px;"></div>
            <div>
                <!--<div class="item-item" style="padding: 10px;float: left;width: 40%;height: auto">-->
                <!--备注说明:<br/>{{item.sample_info}}-->
                <!--</div>-->
                <div class="item-item" style="padding: 10px;width: 100%;height: auto">
                    流程:<br/><span v-for="(_process, index) in item.process" >{{_process.name}}-></span>完成
                </div>
                <div style="clear: both"></div>
            </div>
            <div style="width: 100%;height:1px;border-bottom: 1px dashed #999"></div>
            <div style="width: 100%;height:20px;"></div>
            <div>
                <div class="item-item" style="padding: 10px;width: 100%;height: auto">
                    样品图:<br/> <img style="margin: 5px;" width="80" v-for="(img, index)  in item.sample_imgs" :src="img.url">
                </div>
            </div>
        </div>
        <div style="width: 100%;height:50px;"></div>
        <div style="width: 100%;height:1px;border-bottom: 1px solid #999"></div>
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
        <div class="item-item" style="padding: 10px;float: right">
            业务员:{{order_info.sales_man}}
        </div>
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
