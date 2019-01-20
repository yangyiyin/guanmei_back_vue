<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container">


            <p>
                <span style="padding: 10px;font-size: 14px;">年份:</span><el-button :type="year.active?'primary':''" @click="change_year(year)" v-for="(year, index) in years" :key="index">{{year.label}}</el-button>

            </p>



            <p style="margin-top: 20px">
                <span style="padding: 10px;font-size: 14px;">月份:</span>
                <template v-for="(month, index) in months">
                    <el-badge :value="month.is_config ? '':'配'" class="item" style="margin: 10px;">
                       <el-button @click="dialogFormVisible=true;current=month">
                           <p>  <el-tag>{{month.label}}月份</el-tag></p>
                            <p style="margin-top: 5px;">
                                业务单:{{month.complete.sales}}/{{month.target.sales}}({{month.target.sales ? parseInt((month.complete.sales/month.target.sales)*10000)/100 : 0}}%)<br/>
                                生产单:{{month.complete.produce}}/{{month.target.produce}}({{month.target.produce ? parseInt((month.complete.produce/month.target.produce)*10000)/100 :0}}%)
                            </p>


                       </el-button>
                    </el-badge>
                </template>

            </p>

            <v-chart style="width:100%;" :options="polar"/>

        </div>

        <el-dialog :title="'配置目标:'+current.label+'月份'" :visible.sync="dialogFormVisible" width="20%" >
            <template v-if="current.target">
                <p>
                    业务单目标数量:<el-input v-model="current.target.sales" auto-complete="off"></el-input>
                </p>
                <p>
                    生产单目标数量:<el-input v-model="current.target.produce" auto-complete="off"></el-input>
                </p>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="set_targets()">确 定</el-button>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                </div>
            </template>

        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {config_edit,config_value,get_month_data_by_year} from '@/api/getDataEarth'
    import ECharts from 'vue-echarts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/axis'
    import 'echarts/lib/component/axisPointer'
    import 'echarts/lib/component/dataZoom'
    import 'echarts/lib/component/toolbox'
//    import 'echarts/lib/component/polar'
//
//    import '@/assets/js/jquery-1.4.4.min';
//    import '@/assets/js/jquery.jqprint-0.3';
    export default {
        data(){


            var date = [];
            var data1 = [];
            var data2 = [];

//            var start_time = "2018-1";//开始时间 不要加0，如2016-2
//            var now = new Date();
//            var arr = start_time.split('-');
//            var start_year = arr[0];//开始年份
//            var start_month = arr[1];//开始月份
//            var month = now.getMonth()+1;//现在的月份
//            var year = now.getFullYear();//现在的年份
//            var count = ( year-start_year ) * 12 + month - start_month +1;//循环的次数
//            var date = [];
//            for(var i=0; i<count; i++) {
//
//                if (start_month < 10) {
//                    start_month = start_month;
//                }
//                date[i] = start_year + "-" +start_month;
//                data1.push(Math.random());
//                data2.push(Math.random());
//                if(start_month == 12) {
//                    start_year++;
//                    start_month =0;
//                }
//                start_month++;
//            }
//


            return {
                years: [],
                months: [],
                cur_year:0,
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
                targets:{},

                polar: {
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        },
                        formatter:'{b0}<br/>{a0}: {c0}%<br />{a1}: {c1}%'
                    },
                    title: {
                        left: 'center',
                        text: '大数据量面积图',
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: date
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value}%'
                        },
                    },
                    dataZoom: [{
                        type: 'inside',
                        start: 0,
                        end: 100
                    }, {
                        start: 0,
                        end: 100,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '100%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    series: [
                        {
                            name:'业务单',
                            type:'line',
                            smooth:true,
//                            symbol: 'none',
                            sampling: 'average',
                            itemStyle: {
                                color: 'rgb(255, 70, 131)'
                            },
                            areaStyle: {
                                normal:{}
                            },
                            data: data1
                        },
                        {
                            name:'生产单',
                            type:'line',
                            smooth:true,
//                            symbol: 'none',
                            sampling: 'average',
                            itemStyle: {
                                color: 'rgb(255, 70, 131)'
                            },
                            areaStyle: {
                                normal:{}
                            },
                            data: data2
                        }
                    ]
                },
                year_data:{}

            }
        },
        components: {
            headTop,
            'v-chart': ECharts
        },
        created(){

            var cur_year = (new Date()).getFullYear();
            for(var i=2018;i<=cur_year;i++) {
                this.years.push({
                    label:i,
                    active:i==cur_year ? true:false
                });
            }

            this.cur_year = cur_year;



            this.get_targets().then(function(){

                //获取数据
                this.get_year_data().then(function () {
                    this.gen_month();
                }.bind(this));
            }.bind(this))



        },
        mounted(){
        },
//        beforeRouteEnter (to, from, next) {
//
//
//        },
        methods: {
            get_year_data(){
                return new Promise(function(resolve,reject){
                    get_month_data_by_year({year:this.cur_year}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.year_data = res.data;
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                        resolve();
                    }.bind(this));
                }.bind(this))

            },
            gen_month(){
                this.months = [];
                for(var i=1;i<=12;i++) {
                    var _id = this.cur_year+'_'+i;
                    var _id_complete_sales = '1_'+this.cur_year+'_'+i;
                    var _id_complete_produce = '2_'+this.cur_year+'_'+i;

                    this.months.push({
                        id:_id,
                        label:i,
                        label2:this.cur_year + '/'+i,
                        is_config:this.targets[_id] ? true : false,
                        target:{
                            sales:(this.targets[_id] && this.targets[_id].sales) ? this.targets[_id].sales : 0,
                            produce:(this.targets[_id] && this.targets[_id].produce) ? this.targets[_id].produce : 0,
                        },
                        complete:{
                            sales:(this.year_data[_id_complete_sales]) ? this.year_data[_id_complete_sales] : 0,
                            produce:(this.year_data[_id_complete_produce]) ? this.year_data[_id_complete_produce] : 0,
                        }
                    });
                }
                this.gen_echarts();
//                console.log(this.months);
            },
            gen_echarts(){
                var date = [];
                var data1 = [];
                var data2 = [];

                for(var i=0; i<12; i++) {

                    var month = this.months[i];
                    date[i] = month.label2;

                    var sales_rate = month.target.sales ? parseInt((month.complete.sales/month.target.sales)*10000)/100 : 0;
                    var produce_rate = month.target.produce ? parseInt((month.complete.produce/month.target.produce)*10000)/100 : 0;
                    data1.push(sales_rate);
                    data2.push(produce_rate);
                }


                this.polar.xAxis.data = date;
                this.polar.series[0].data = data1;
                this.polar.series[1].data = data2;
            },
            change_year(year){
                this.cur_year = year.label;
                this.get_year_data().then(function(){
                    this.gen_month();
                }.bind(this));
                this.years.forEach(function(val){
                    val.active = false;
                })
                year.active = true;
            },
            set_targets() {
                this.targets[this.current.id] = {
                    sales:this.current.target.sales,
                    produce:this.current.target.produce,
                }
                config_edit({data:[{key:'biz_target',value:JSON.stringify(this.targets),remark:'业务目标'}]}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.current.is_config = true;
                        this.dialogFormVisible = false;
//                        this.change_year(this.cur_year);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        });
                    }
                }.bind(this));

            },
            get_targets(){
                return new Promise(function(resolve,reject){
                    config_value({key:'biz_target'}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.targets = res.data ? JSON.parse(res.data) : {};

                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                        resolve();
                    }.bind(this));
                }.bind(this));

            }
//            process_order() {
//                if (!this.order_no) {
//                    this.$message({
//                        type: 'warning',
//                        message: '请输入单号'
//                    });
//                    return;
//                }
//
//                if (parseInt(this.cur_order.handover_num) + parseInt(this.cur_order.handed_num) > parseInt(this.cur_order.sum)) {
//                    this.$message({
//                        type: "warning",
//                        message: '交接数量超过订单总数,请重新输入正确的交接数量'
//                    });
//                    return;
//                } else if (parseInt(this.cur_order.handover_num) + parseInt(this.cur_order.handed_num) == parseInt(this.cur_order.sum)) {
//                    var msg_tip = "本次交接数量为"+this.cur_order.handover_num+",本次交接完成,流程将流转至下一流程,确认此操作?";
//                } else {
//                    var msg_tip = "本次交接数量为"+this.cur_order.handover_num+",确认此操作?";
//                }
//
//                this.$confirm(msg_tip, '提示', {
//                    confirmButtonText: '确定',
//                    cancelButtonText: '取消',
//                    type: 'warning'
//                }).then(function(){
//                    process_order({produce_order_no:this.order_no,handover_num:this.cur_order.handover_num}).then(function(res){
//                        if (res.code == this.$store.state.constant.status_success) {
//                            this.$message({
//                                type: 'success',
//                                message: res.msg
//                            });
//
//                            this.dialog_handover_visible = false;
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
