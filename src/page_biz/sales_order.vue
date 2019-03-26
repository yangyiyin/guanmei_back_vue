<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">
            <el-button style="float: right;margin-bottom: 5px;" type="primary" @click="goto_edit_sales_order(0)">新增业务单</el-button>
            <div style="clear: both"></div>
            <el-collapse>
                <el-collapse-item  title="条件搜索-可通过相关条件筛选数据" name="1">
                    <span style="font-size: 14px;">客户单号:</span>
                    <el-input
                            style="display: inline-block;width: 250px;"
                            placeholder="编号"
                            v-model="order_no"
                            clearable>
                    </el-input>

                    <p style="margin-top: 5px;">
                        <span style="font-size: 14px;">制单日期日期:</span>
                        <el-date-picker
                                v-model="dateTime_create"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions">
                        </el-date-picker>

                        <span style="font-size: 14px;">交货日期:</span>
                        <el-date-picker
                                v-model="dateTime"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </p>

                    <p style="margin-top: 5px;">
                        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                        <el-button  @click="dialogFormVisibleDaochu = true;">导出</el-button>
                    </p>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form style="border: 1px dashed #ddd;margin-top: 5px;padding: 0 5px;"  v-for="(sub_order, index)  in props.row.sales_order_sub" label-position="left" inline :key='index' class="demo-table-expand">
                            <el-form-item label="帽型:" >
                                <span>{{sub_order.product_cat_name}}[{{sub_order.product_code}}][{{sub_order.color_code+(sub_order.color_data?'-'+sub_order.color_data.custom_model:'')}}] 数量{{sub_order.sum}}</span>
                                <el-tag size="mini" v-if="sub_order.status == 1" type="warning">待安排生产</el-tag>
                                <el-tag size="mini" v-if="sub_order.status == 2" >已安排生产</el-tag>
                                <el-tag size="mini" v-if="sub_order.status == 3" type="success">已完成</el-tag>
                                <el-tag size="mini" v-if="sub_order.status == 4" type="danger">生成单已删除</el-tag>
                            </el-form-item>

                            <el-form-item label="详细信息:" >
                                <p v-for="(color_detail, index)  in sub_order.color_details" :key='index'>尺寸:{{color_detail.size}};型号:{{color_detail.model}};去向:{{color_detail.go}};数量:{{color_detail.sum}};</p>
                            </el-form-item>

                            <el-form-item label="材质:" >
                                <span v-for="(material, index)  in sub_order.material" :key='index'>{{material.material ? material.material.name : material.name}}[{{material.sub ? material.sub.name : material.color_name}}]数量{{material.num}};</span>
                                <span>{{sub_order.raw_material}}</span>
                            </el-form-item>
                            <el-form-item label="装饰说明:" >
                                <span>{{sub_order.decoration}}</span>
                            </el-form-item>
                            <el-form-item label="样品图:" >
                                <img width="80" v-for="(img, index)  in sub_order.sample_imgs" :key='index' :src="img">
                            </el-form-item>
                            <el-form-item label="备注说明:" >
                                <span>{{sub_order.sample_info}}</span>
                            </el-form-item>
                            <el-form-item label="客户款式:" >
                                <span>{{sub_order.custom_model}}</span>
                            </el-form-item>
                            <el-form-item label="客户姓名:" >
                                <span>{{props.row.custom_name}}</span>
                            </el-form-item>
                            <el-form-item label="当前进度:" >
                                <span style="font-weight: bold;color: #000">{{sub_order.process_state ? sub_order.process_state : '暂无'}}</span>
                            </el-form-item>


                        </el-form>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="编号" type="index" width="50" :index="typeIndex" align="center"></el-table-column> -->
                <!-- <el-table-column label="业务单号" prop="order_no">
                    <template slot-scope="scope">
                        <span v-if="scope.row.custom_order_no"> {{scope.row.order_no}}({{scope.row.custom_order_no}})</span>
                        <span v-if="!scope.row.custom_order_no"> {{scope.row.order_no}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="客户单号" prop="order_no">
                    <template slot-scope="scope">
                        <span>{{scope.row.custom_order_no}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="制单日期" prop="order_date"></el-table-column>
                <el-table-column label="交货日期" prop="delivery_date"></el-table-column>
                <el-table-column label="业务员" prop="sales_man"></el-table-column>

                <el-table-column label="状态">
                    <template slot-scope="scope">

                        <el-tag v-if="scope.row.status == 5" type="warning">草稿，待提交</el-tag>
                        <el-tag v-if="scope.row.status == 1" type="warning">待安排生产</el-tag>
                        <el-tag v-if="scope.row.status == 2" >已安排生产</el-tag>
                        <el-tag v-if="scope.row.status == 3" type="success">已完成</el-tag>
                        <el-tag v-if="scope.row.status == 4" type="danger">生成单已删除</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="400">
                    <template slot-scope="scope">
                        <el-button size="mini" v-if="scope.row.status == 5" @click="verify(scope, 1)" type="warning" :loading="loadingBtn == scope.$index">提交</el-button>
                        <el-button v-if="scope.row.status == 1 || scope.row.status == 5" size="mini" @click="goto_edit_sales_order(scope.row.id)">编辑</el-button>
                        <el-button size="mini" @click="goto_edit_sales_order(scope.row.id,'clone')">克隆</el-button>
                        <!--<el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>-->
                        <el-button v-if="scope.row.status == 5" size="mini" @click="del(scope.row, scope.$index)">删除</el-button>
                        <el-button size="mini"  @click="print_order(scope.row)">打印</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
        </div>
        <el-dialog title="修改排序" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="current">
                <el-form-item label="排序值(越大越靠前)">
                    <el-input v-model="current.sort" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sort">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="导出" :visible.sync="dialogFormVisibleDaochu" width="30%">
            <p>
                您即将导出订单数据,条件为:[客户单号:{{order_no?order_no:'无限制'}}][制单时间:{{dateTime_create?dateTime_create[0]:'无限制'}}-{{dateTime_create?dateTime_create[1]:'无限制'}}][交货时间:{{dateTime?dateTime[0]:'无限制'}}-{{dateTime?dateTime[1]:'无限制'}}]。
            </p>
            <p>
                特别说明:如果报名数据比较多,则导出速度会相应的慢一些哦~
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDaochu = false">取 消</el-button>
                <el-button type="primary" @click="daochu" :loading="loadingBtn == 'daochu'">开始导出</el-button>
            </div>
        </el-dialog>

        <!-- 打印div -->
        <div style="display: none">
            <div id="print" width="90%">
                <template v-if="order_info.custom_order_no">
                    <sales-order :order_info="order_info"></sales-order>
                    <!--<div style="width: 100%;font-size: 20px;font-weight: bolder;text-align: center;padding: 30px;padding-top: 10px;">冠美帽业-业务单({{order_info.custom_order_no}})</div>-->
                    <!--&lt;!&ndash;<div class="item-item" style="padding: 10px;float: left">&ndash;&gt;-->
                        <!--&lt;!&ndash;客户单号:{{order_info.custom_order_no}}&ndash;&gt;-->
                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                    <!--<div class="item-item" style="padding: 10px;float: left">-->
                        <!--客户姓名:{{order_info.custom_name}}-->
                    <!--</div>-->
                    <!--<div class="item-item" style="padding: 10px;float: right">-->
                        <!--交货日期:{{order_info.delivery_date}}-->
                    <!--</div>-->
                    <!--<div style="clear: both"></div>-->
                    <!--<div style="width: 100%;height:1px;border-bottom: 1px solid #999"></div>-->
                    <!--<div style="width: 100%;height:30px;"></div>-->
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
                    <!--<div style="width: 100%;height:50px;"></div>-->
                    <!--<div style="width: 100%;height:1px;border-bottom: 1px solid #999"></div>-->
                    <!--<div class="item-item" style="padding: 10px;float: left">-->
                        <!--当前状态:-->
                        <!--<span v-if="order_info.status == 5">草稿，待提交</span>-->
                        <!--<span v-if="order_info.status == 1" >待安排生产</span>-->
                        <!--<span v-if="order_info.status == 2" >已安排生产</span>-->
                        <!--<span v-if="order_info.status == 3" >已完成</span>-->
                        <!--<span v-if="order_info.status == 4" >生成单已删除</span>-->
                    <!--</div>-->
                    <!--<div class="item-item" style="padding: 10px;float: right">-->
                        <!--制单日期:{{order_info.order_date}}-->
                    <!--</div>-->
                    <!--<div class="item-item" style="padding: 10px;float: right">-->
                        <!--业务员:{{order_info.sales_man}}-->
                    <!--</div>-->

                </template>
                <template v-else>
                    数据获取失败,请关闭当前打印,重新打开打印。
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from "../components/headTop";
    import salesOrder from '../components/salesOrder'
    import {
            sales_order_list,
            sales_order_del,
            sales_order_verify,
            sales_order_sort,
            sales_order_info
    } from "@/api/getDatasales_order";
    import "@/assets/js/jquery-1.4.4.min";
    import "@/assets/js/jquery.jqprint-0.3";
    import { getStore } from "@/config/mUtils";
    // import { gen_barcode_html } from "@/api/getDataproduce_order";

    export default {
        data() {
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible: false,
                dialogFormVisibleDaochu: false,
                current: {},
                //                remark:'',
                //                choose_categories:[],
                //                categories:[],
                order_no: "",
                loadingBtn: -1,
                pickerOptions: {
                    shortcuts: [
                        {
                            text: "最近一周",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近一个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近三个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit("pick", [start, end]);
                            }
                        }
                    ]
                },
                dateTime: "",
                dateTime_create: "",

                order_info:{}
            };
        },
        components: {
            headTop,
            salesOrder
        },
        created() {
//            this.list();
        },
        mounted() {},
        beforeRouteEnter(to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.list();
        });
        },
        methods: {
            list() {
                sales_order_list({
                    page: this.currentPage,
                    page_size: this.limit,
                    order_no: this.order_no,
                    name: this.name,
                    start_time: this.dateTime ? this.dateTime[0]:'',
                    end_time: this.dateTime ? this.dateTime[1]:'',
                    start_time_create: this.dateTime_create ? this.dateTime_create[0]:'',
                    end_time_create: this.dateTime_create ? this.dateTime_create[1]:'',
                }).then(
                        function(res) {
                            if (res.code == this.$store.state.constant.status_success) {
                                this.tableData = res.data.list;
                                this.count = parseInt(res.data.count);
                            }
                        }.bind(this)
                );
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.list();
            },
            handleEdit(row) {
                this.dialogFormVisible = true;
                if (row) {
                    this.current_entity = row;
                } else {
                    this.current_entity = {};
                }
            },
            search() {
                this.currentPage = 1;
                this.list();
            },
            goto_edit_sales_order(id, clone) {
                this.$router.push({
                    path: "add_sales_order",
                    query: { id: id, clone: clone }
                });
            },
            verify(scope, status) {
                this.$confirm("提交后将不能修改和删除,确认此操作?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(
                        function() {
                            var item = scope.row;
                            this.loadingBtn = scope.$index;
                            sales_order_verify({ id: item.id, status: status })
                                    .then(
                                            function(res) {
                                                if (res.code == this.$store.state.constant.status_success) {
                                                    item.status = status;
                                                    this.$message({
                                                        type: "success",
                                                        message: "操作成功"
                                                    });
                                                } else {
                                                    this.$message({
                                                        type: "warning",
                                                        message: res.msg
                                                    });
                                                }
                                            }.bind(this)
                                    )
                                    .finally(
                                            function() {
                                                this.loadingBtn = -1;
                                            }.bind(this)
                                    );
                        }.bind(this)
                );
            },
            del(item, index) {
                this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(
                        function() {
                            sales_order_del({ id: item.id }).then(
                                    function(res) {
                                        if (res.code == this.$store.state.constant.status_success) {
                                            this.tableData.splice(index, 1);
                                            this.count--;
                                            this.$message({
                                                type: "success",
                                                message: "操作成功"
                                            });
                                        } else {
                                            this.$message({
                                                type: "warning",
                                                message: res.msg
                                            });
                                        }
                                    }.bind(this)
                            );
                        }.bind(this)
                );
            },
            handleSort(row) {
                this.dialogFormVisible = true;
                this.current = row;
            },
            sort() {
                sales_order_sort({
                    id: this.current.id,
                    sort: this.current.sort
                }).then(
                        function(res) {
                            if (res.code == this.$store.state.constant.status_success) {
                                this.dialogFormVisible = false;
                                this.$message({
                                    type: "success",
                                    message: "操作成功"
                                });
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: res.msg,
                                    type: "warning"
                                });
                            }
                        }.bind(this)
                );
                this.dialogFormVisible = false;
            },
            // 序号根据数据增加
            typeIndex(index) {
                return index + (this.currentPage - 1) * 10 + 1;
            },

            // 打印
            print_order(row) {

                sales_order_info({
                    id: row.id
                }).then(function(res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.order_info = res.data;
                            console.log(this.order_info);
                            setTimeout(function() {
                                $("#print").jqprint();
                            });
                        } else {
                            this.$message({
                                message: res.msg,
                                type: "warning"
                            });
                        }
                    }.bind(this)

                );
            },
            daochu() {
                window.open(
                        this.$store.state.constant.sales_order_excel_out +
                        "?client_from=1&order_no=" + this.order_no +
                        '&start_time='+(this.dateTime?this.dateTime[0]:'')+
                        '&end_time='+(this.dateTime?this.dateTime[1]:'')+
                        '&start_time_create='+(this.dateTime_create?this.dateTime_create[0]:'')+
                        '&end_time_create='+(this.dateTime_create?this.dateTime_create[1]:'')+
                        "&token=" +
                        (getStore("token") ? getStore("token") : "")
                );
            }
        }
    };
</script>

<style lang="less">
    @import "../style/mixin";
    .table_container {
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
    .el-collapse-item__header{
        background: #EEF4FF!important;
    }
</style>
