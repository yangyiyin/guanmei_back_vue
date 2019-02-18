<template >
    <div class="fillcontain" >
        <head-top></head-top>

        <div class="table_container">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="业务单概况" name="first" v-loading="loading" ref="order_survey_box" >

                    <div class="block" v-for="(detail, index)  in survey_order_data">
                        <div class="line" style="margin-left: 0px;">
                            <span style="background: #ccc">业务单:{{detail.order_no}}&nbsp;({{detail.sales_man}})</span>
                        </div>
                        <div class="line" v-for="(item, index)  in detail.items">
                            <div class="process_block info" style="line-height: 20px;">
                                {{item.product_category}}[{{item.product_code}}][{{item.color}}{{(item.color_data && item.color_data.custom_model)?'-'+item.color_data.custom_model:''}}]<br/>
                                数量:{{item.sum}}(生产单总数:{{item.produce_sum}})&nbsp;&nbsp;交货时间:{{item.create_time}}<br/>
                            </div>
                            <div class="process_block" v-for="(process, index)  in item.process_list" :style="process.status==1?'background:#67C23A':'background:#F56C6C'">
                                <span style="font-size: 16px;">{{process.name}}</span><br/>
                                <p style="line-height: 15px">
                                    <span v-if="process.id>0">已完成:{{process.produce_completed_num}}/{{item.produce_sum}}</span><br/>
                                    已交付:{{process.produce_handed_num}}/{{item.produce_sum}}<br/>
                                </p>
                            </div>

                        </div>
                    </div>
                    <div class="Pagination" style="text-align: left;margin-top: 10px;">
                        <el-pagination
                                @current-change="handleCurrentChange"
                                :current-page="currentPage"
                                :page-size="limit"
                                layout="total, prev, pager, next"
                                :total="count"
                                background>
                        </el-pagination>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="部门概况" name="second" v-loading="loading">
                    <div class="department" v-for="(item, index)  in survey_orgnize_data" :style="'background:'+item.bg_color" @click="show_orders(item.orders)">
                        <span class="tips">{{item.order_sum}}</span>
                        <p>{{item.name}}</p>
                    </div>

                </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog title="正在进行中的订单" :visible.sync="dialogFormVisible">

            <el-table
                    :data="current_orders"
                    style="width: 100%"
                    height="400">
                <el-table-column label="编号" prop="order_no"></el-table-column>

                <el-table-column label="帽型" prop="product_cat"></el-table-column>
                <el-table-column label="型号" prop="product"></el-table-column>
                <el-table-column label="颜色" prop="color"></el-table-column>
                <el-table-column label="数量" prop="sum"></el-table-column>
                <el-table-column label="交货时间" prop="create_time"></el-table-column>
            </el-table>



        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {survey_order,survey_orgnize} from '@/api/getDataprocess'

    import '@/assets/js/jquery-1.4.4.min';
    import '@/assets/js/jquery.jqprint-0.3';
    export default {
        data(){
            return {
                tableData: [],
                limit: 3,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                current_orders:{},
                loadingBtn:-1,
                loading:false,
                activeName:'first',
                survey_order_data:[],
                survey_orgnize_data:[],

            }
        },
        components: {
            headTop,
        },
        created(){

        },
        mounted(){

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {

                vm.activeName = to.query.activeName ? to.query.activeName : 'first';

                if (vm.activeName == 'first') {
                    vm.survey_order(1);
                } else {
                    vm.survey_orgnize(1);
                }

            });

        },
        beforeRouteUpdate(to, from, next) {

            this.activeName = to.query.activeName ? to.query.activeName : 'first';

            if (this.activeName == 'first') {
                this.survey_order(1);
            } else {
                this.survey_orgnize(1);
            }
            next();
        },
        methods: {
            survey_order(init) {
                this.loading = true;
                survey_order({page:this.currentPage,page_size:this.limit}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.survey_order_data = res.data.list;
                        this.count = parseInt(res.data.count);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        });
                    }
                    this.loading = false;
                }.bind(this));

            },
            survey_orgnize(init) {
                this.loading = true;
                survey_orgnize({}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.survey_orgnize_data = res.data;
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        });
                    }
                    this.loading = false;
                }.bind(this));

            },
            handleClick(){
                this.$router.push({path:'process_survey',query:{activeName:this.activeName}});
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.survey_order();
            },
            show_orders(orders) {
                this.current_orders = orders;
                this.dialogFormVisible = true;
            }
        },
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .table_container{
        padding: 20px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .process_block{
        display: inline-block;
        color: #fff;
        background: red;
        width: 150px;
        height: 80px;
        text-align: center;
        line-height: 40px;
        font-size: 12px;
        margin-left: 3px;
    }
    .process_block.info{
        color: #333;
        background: none;
        width: auto;
    }
    .line{
        margin-bottom: 5px;
        margin-top: 5px;
        margin-left: 20px;
    }
    .block{
        border: 1px solid #eee;
        margin-bottom: 10px;
        margin-top: 5px;
        padding: 10px;
        background: #eee;
    }
    .department{
        width: 150px;
        height: 150px;
        background: #eee;
        border-radius: 3px;
        text-align: center;
        line-height: 150px;
        display: inline-block;
        position: relative;
        margin-right: 20px;
        margin-top: 20px;
        cursor: pointer;
    }
    .tips{
        position: absolute;
        top: 5px;
        left: 5px;
        line-height: 1px;
        padding: 10px;
        text-align: center;
        border-radius: 100px;
        background: #fff;

    }

</style>
