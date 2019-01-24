<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container">
           <div style="padding-top: 100px;text-align: center">
               <p style="margin-bottom: 20px;">
                   <!--<i class="iconfont" style="color: #999;font-size: 140px;">&#xe628;</i>-->
                   输入单号查询
               </p>

               <el-radio-group v-model="order_no_type">
                   <el-radio-button label="yw">业务单</el-radio-button>
                   <el-radio-button label="sc">生产单</el-radio-button>
               </el-radio-group>
               <el-input ref="input" autofocus v-model="order_no" placeholder="业务单号/生产单号" style="width: 500px;display: inline-block" clearable></el-input>
               <!--<el-button v-if="!order_no || !order_detail.order_no" type="success" style="display: inline-block" @click="produce_order_detail()">搜索</el-button>-->
               <el-button  type="success" style="display: inline-block" @click="search()">查询</el-button>
               <br/>
               <!--<div v-if="order_detail.order_no" style="margin: 30px auto;display: inline-block;text-align: left">-->
                   <!--<p>-->
                       <!--<span style="color: #999">生产单:</span>-->
                       <!--<span style="font-size: 30px;">{{order_detail.order_no}}</span>-->
                   <!--</p>-->
                   <!--<p style="height: 1px;width: 300px;background: #eee"></p>-->
                   <!--<p v-for="(detail, index)  in order_detail.detail" style="margin-top: 10px;">-->
                       <!--<span style="color: #999">{{detail.key}}:</span>{{detail.value}}-->
                   <!--</p>-->
               <!--</div>-->
               <el-dialog title="" :visible.sync="dialog_order_visible" width="70%">
                   <template  v-if="order_list && order_list.length>1">
                       <div class="table_container">

                           <el-table
                                   :data="order_list"
                                   style="width: 100%;"
                                   height="500">
                               <el-table-column v-if="order_no_type=='yw'" label="客户单号" prop="custom_order_no">
                                   <template slot-scope="scope">

                                       <span @click="order_list=[scope.row];get_single_order()" style="text-decoration: underline;cursor: pointer">{{scope.row.custom_order_no}}</span>
                                   </template>
                               </el-table-column>

                               <el-table-column v-if="order_no_type=='sc'" label="单号" prop="order_no">
                                   <template slot-scope="scope">

                                       <span @click="order_list=[scope.row];get_single_order()" style="text-decoration: underline;cursor: pointer">{{scope.row.order_no}}</span>
                                   </template>
                               </el-table-column>

                               <el-table-column label="创建时间" prop="create_time"></el-table-column>
                           </el-table>
                           <div slot="footer" class="dialog-footer">
                               <el-button @click="dialog_order_visible = false">关 闭</el-button>
                           </div>
                       </div>

                   </template>
                   <template  v-if="order_no_type=='yw' && order_info && (!order_list.length || order_list.length <= 1)">


                       <div id="print_sales_order">
                           <sales-order :order_info="order_info"></sales-order>

                       </div>
                       <div slot="footer" class="dialog-footer">
                           <el-button type="success" @click="print_order_sales_order()">打 印</el-button>
                           <el-button @click="dialog_order_visible = false">关 闭</el-button>
                       </div>
                   </template>
                   <template  v-if="order_no_type=='sc' && order_info && (!order_list.length || order_list.length <= 1)">
                       <div id="print_produce_order">
                           <produce-order :order_info="order_info"></produce-order>

                       </div>
                       <div slot="footer" class="dialog-footer">
                           <el-button type="success" @click="print_order_produce_order()">打 印</el-button>
                           <el-button @click="dialog_order_visible = false">关 闭</el-button>
                       </div>
                   </template>
               </el-dialog>
           </div>
        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import salesOrder from '../components/salesOrder'
    import produceOrder from '../components/produceOrder'
    import {sales_order_info,sales_order_get_all} from "@/api/getDatasales_order";
    import {produce_order_info,produce_order_all_list} from "@/api/getDataproduce_order";
    import '@/assets/js/jquery-1.4.4.min';
    import '@/assets/js/jquery.jqprint-0.3';
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                dialog_order_visible:false,
                current:{},
                order_no:'',
                order_no_type:'yw',
                order_detail:{},
                loadingBtn:-1,
                order_info:null,
                order_list:[]

            }
        },
        components: {
            headTop,
            salesOrder,
            produceOrder,
        },
        created(){

        },
        mounted(){

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.$refs.input.focus();
            });

        },
        methods: {
            search(){
                if (!this.order_no) {
                    return;
                }

//                var order_no_arr = this.order_no.split('-');
//                if (order_no_arr.length == 4 && order_no_arr[0].indexOf('SC')!= -1) {
//                    this.order_no_type = 'sc';
//                } else {
//                    this.order_no_type = 'yw';
//                }

                this.order_list = [];
                if (this.order_no_type == 'yw') {//业务单
                    sales_order_get_all({order_no:this.order_no}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.order_list = res.data;
                            if (!this.order_list.length) {
                                this.$message({
                                    type: "warning",
                                    message: "没有查询到订单信息"
                                });
                                return;
                            } else if (this.order_list.length == 1) {
                                this.get_single_order();
                            } else {

                            }
                            this.dialog_order_visible = true;
                        } else {
                            this.$message({
                                type: "warning",
                                message: res.msg
                            });
                        }
                    }.bind(this));
                } else if(this.order_no_type == 'sc') {//生产单

                    produce_order_all_list({order_no:this.order_no}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.order_list = res.data;
                            if (!this.order_list.length) {
                                this.$message({
                                    type: "warning",
                                    message: "没有查询到订单信息"
                                });
                                return;
                            } else if (this.order_list.length == 1) {
                                this.get_single_order();
                            } else {

                            }
                            this.dialog_order_visible = true;
                        } else {
                            this.$message({
                                type: "warning",
                                message: res.msg
                            });
                        }
                    }.bind(this));
                }


            },
            get_single_order(){
                if(this.order_no_type == 'yw') {//生产单
                    sales_order_info({id:this.order_list[0].id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.order_info = res.data;
//                                        this.order_list = [];
                            this.dialog_order_visible = true;
                        } else {
                            this.$message({
                                type: "warning",
                                message: res.msg
                            });
                        }
                    }.bind(this));
                } else if(this.order_no_type == 'sc') {//生产单
                    produce_order_info({id:this.order_list[0].id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.order_info = res.data;
                            this.dialog_order_visible = true;
                        } else {
                            this.$message({
                                type: "warning",
                                message: res.msg
                            });
                        }
                    }.bind(this));
                }

            },
            // 打印
            print_order_sales_order(row) {
                $("#print_sales_order").jqprint();
            },
            print_order_produce_order(row) {
                $("#print_produce_order").jqprint();
            },
//            produce_order_detail() {
//                if (!this.order_no) {
//                    this.order_detail = {};
//                    return;
//                }
//                produce_order_detail({order_no:this.order_no}).then(function(res){
//                    if (res.code == this.$store.state.constant.status_success) {
//                        this.order_detail = res.data;
//                    } else {
//                        this.order_detail = {
//                            order_no:'没有订单信息',
//                            detail:[]
//                        }
//                    }
//                }.bind(this));
//
//            },
//            process_order() {
//                if (!this.order_no) {
//                    this.$message({
//                        type: 'warning',
//                        message: '请输入单号'
//                    });
//                    return;
//                }
//                this.$confirm('接单之后,流程将流转到下一阶段,确认此操作?', '提示', {
//                    confirmButtonText: '确定',
//                    cancelButtonText: '取消',
//                    type: 'warning'
//                }).then(function(){
//                    process_order({produce_order_no:this.order_no}).then(function(res){
//                        if (res.code == this.$store.state.constant.status_success) {
//                            this.$message({
//                                type: 'success',
//                                message: res.msg
//                            });
//
//
//                        } else {
//                            this.$message({
//                                type: 'warning',
//                                message: res.msg
//                            });
//                        }
//                        this.order_no = '';
//                        this.order_detail = {};
//                        this.$refs.input.focus();
//
//                    }.bind(this));
//                }.bind(this))
//
//            }
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
</style>
