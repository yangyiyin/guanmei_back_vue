<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container">
           <div style="padding-top: 100px;text-align: center">
               <p style="margin-bottom: 20px;">
                   <i class="iconfont" style="color: #999;font-size: 140px;">&#xe628;</i>
               </p>
               <el-input ref="input" autofocus v-model="order_no" placeholder="请通过扫码,输入生产单号" style="width: 500px;display: inline-block" clearable @input="produce_order_detail"></el-input>
               <!--<el-button v-if="!order_no || !order_detail.order_no" type="success" style="display: inline-block" @click="produce_order_detail()">搜索</el-button>-->
               <el-button v-if="order_no && order_detail.order_no" type="success" style="display: inline-block" @click="dialog_handover_visible=true;">确认接单</el-button>
               <br/>
               <div v-if="order_detail.order_no" style="margin: 30px auto;display: inline-block;text-align: left">
                   <p>
                       <span style="color: #999">生产单:</span>
                       <span style="font-size: 30px;">{{order_detail.order_no}}</span>
                   </p>
                   <p style="height: 1px;width: 300px;background: #eee"></p>
                   <p v-for="(detail, index)  in order_detail.detail" style="margin-top: 10px;">
                       <span style="color: #999">{{detail.key}}:</span>{{detail.value}}
                   </p>
               </div>

           </div>
        </div>

        <el-dialog :title="'订单编号:'+cur_order.order_no" :visible.sync="dialog_handover_visible" width="20%">
            <p>
                请输入交接数量({{cur_order.handed_num}}/{{cur_order.sum}}):<el-input v-model="cur_order.handover_num" auto-complete="off"></el-input>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="process_order()">确 定</el-button>
                <el-button @click="dialog_handover_visible = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {produce_order_detail,process_order} from '@/api/getDataproduce_order'

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
                dialog_handover_visible:false,
                current:{},
                cur_order:{},
                order_no:'',
                order_detail:{},
                loadingBtn:-1,


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
                vm.$refs.input.focus();
            });

        },
        methods: {
            produce_order_detail() {
                if (!this.order_no) {
                    this.order_detail = {};
                    return;
                }
                produce_order_detail({order_no:this.order_no}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.order_detail = res.data;
                        this.cur_order = {order_no:res.data.order_no};
                        this.order_detail.detail.forEach(function(val){
                            if (val.key == '数量') {
                                this.cur_order.sum = val.value;
                            }
                            if (val.key == '已交接数量') {
                                this.cur_order.handed_num = val.value;
                            }
                        }.bind(this))

                    } else {
                        this.order_detail = {
                            order_no:'没有订单信息',
                            detail:[]
                        }
                    }
                }.bind(this));

            },
            process_order() {
                if (!this.order_no) {
                    this.$message({
                        type: 'warning',
                        message: '请输入单号'
                    });
                    return;
                }

                if (parseInt(this.cur_order.handover_num) + parseInt(this.cur_order.handed_num) > parseInt(this.cur_order.sum)) {
                    this.$message({
                        type: "warning",
                        message: '交接数量超过订单总数,请重新输入正确的交接数量'
                    });
                    return;
                } else if (parseInt(this.cur_order.handover_num) + parseInt(this.cur_order.handed_num) == parseInt(this.cur_order.sum)) {
                    var msg_tip = "本次交接数量为"+this.cur_order.handover_num+",本次交接完成,流程将流转至下一流程,确认此操作?";
                } else {
                    var msg_tip = "本次交接数量为"+this.cur_order.handover_num+",确认此操作?";
                }

                this.$confirm(msg_tip, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    process_order({produce_order_no:this.order_no,handover_num:this.cur_order.handover_num}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                type: 'success',
                                message: res.msg
                            });

                            this.dialog_handover_visible = false;
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                        this.order_no = '';
                        this.order_detail = {};
                        this.$refs.input.focus();

                    }.bind(this));
                }.bind(this))

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
</style>
