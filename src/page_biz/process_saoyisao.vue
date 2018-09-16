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
               <el-button v-if="order_no && order_detail.order_no" type="success" style="display: inline-block" @click="process_order()">确认接单</el-button>
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
                current:{},
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
                this.$confirm('接单之后,流程将流转到下一阶段,确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    process_order({produce_order_no:this.order_no}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                type: 'success',
                                message: res.msg
                            });


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
