<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">
            <el-button style="float: right;margin-bottom: 5px;" type="primary" @click="goto_edit_produce_order(0)">新增生产单</el-button>
            <div style="clear: both"></div>
            <el-collapse >
                <el-collapse-item title="条件搜索-可通过相关条件筛选数据" name="1">
                    <span style="font-size: 14px;">生产单名称:</span>
                    <el-input
                            style="display: inline-block;width: 250px;"
                            placeholder="生产单名称"
                            v-model="set_name"
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
                    <p style="margin-top:20px;">
                        <span style="font-size: 14px;">排序:</span>
                        <el-select size="mini" v-model="order_by[0].key" placeholder="排序字段" clearable>
                            <el-option
                                    v-for="item in [{value:'delivery_date',label:'交货日期'},{value:'order_date',label:'制单日期'},{value:'process_state_id',label:'流程进度'}]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>

                        <el-select size="mini" v-model="order_by[0].value" placeholder="排序方式" clearable>
                            <el-option
                                    v-for="item in [{value:'asc',label:'从小到大'},{value:'desc',label:'从大到小'}]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
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
                        <!--{{props1.row[0].order_date}}-->
                        <el-table
                                :data="props.row.list"
                                style="width: 100%">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-form  style="border: 1px dashed #ddd;margin-top: 5px;padding: 0 5px;" label-position="left" inline class="demo-table-expand">
                                        <el-form-item label="帽型:" >
                                            <span>{{props.row.product_cat_name}}-{{props.row.product_code}}-{{props.row.color_code}} 数量{{props.row.sum}};</span>
                                        </el-form-item>

                                        <el-form-item label="材质:" >
                                            <!--<span v-for="(material, index)  in props.row.material">{{material.name}};</span>-->
                                            <span v-for="(material, index)  in props.row.material">{{material.material ? material.material.name : material.name}}[{{material.sub ? material.sub.name : material.color_name}}]数量{{material.num}};</span>

                                        </el-form-item>
                                        <el-form-item label="装饰/辅料:" >
                                            <span v-for="(material_sub, index)  in props.row.material_sub">{{material_sub.material.name}}-{{material_sub.from.name}}(数量:{{material_sub.sum}});</span>
                                        </el-form-item>
                                        <el-form-item label="装饰说明:" >
                                            <span>{{props.row.decoration}}</span>
                                        </el-form-item>
                                        <el-form-item label="样品图:" >
                                            <img width="80" v-for="(img, index) in props.row.sample_imgs" :key='index' :src="img">
                                        </el-form-item>
                                        <el-form-item label="备注说明:" >
                                            <span>{{props.row.sample_info}}</span>
                                        </el-form-item>

                                        <el-form-item label="流程:" style="width: 100%">
                                            <span>{{props.row.process_info}}</span>
                                        </el-form-item>
                                        <!--<el-form-item label="所属业务单:" >-->
                                        <!--<span >{{props.row.sales_order_nos}}</span>-->
                                        <!--</el-form-item>-->
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column label="系统编号" prop="order_no"></el-table-column>
                            <el-table-column label="包含业务单" width="300">
                                <template slot-scope="scope">

                                    <span style="cursor: pointer;text-decoration: underline" @click="dialog_sales_order_visible = true;current=scope.row">客户单号:{{scope.row.sales_order_nos}}(客户型号:{{scope.row.sales_order_models}})</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="制单时间" prop="order_date"></el-table-column>
                            <el-table-column label="进度">
                                <template slot-scope="scope">

                                    <el-tag v-if="scope.row.status == 1 && scope.row.process_state_id == 0 && scope.row.process_state_next_id == 0" type="warning">待提交仓库</el-tag>
                                    <el-tag v-if="scope.row.status == 2 && scope.row.process_state_id == 0" >待仓库确认</el-tag>
                                    <el-tag v-if="scope.row.status == 3" type="success" >已完成</el-tag>
                                    <el-tag v-if="scope.row.status == 1 && scope.row.process_state_next_id > 0" >{{scope.row.process_state}}</el-tag>

                                </template>
                            </el-table-column>
                            <el-table-column label="已交接数量">
                                <template slot-scope="scope">
                                    {{scope.row.handed_num}}/{{scope.row.sum}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="300">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.status==1 && scope.row.process_state_id == 0 && scope.row.process_state_next_id == 0" size="mini" type="success" @click="submit_storage(scope.row)">提交仓库</el-button>
                                    <el-button v-if="scope.row.status == 1 && scope.row.process_state_next_id > 0" size="mini" type="success" @click="print_barcode(scope.row)">打印条形码({{scope.row.print_count}})</el-button>

                                    <el-button v-if="scope.row.status==1 && scope.row.process_state_id == 0 && scope.row.process_state_next_id == 0" size="mini" @click="goto_edit_produce_order(scope.row.id)">编辑</el-button>
                                    <el-button v-if="scope.row.status==1 && scope.row.process_state_id == 0 && scope.row.process_state_next_id == 0" size="mini" @click="del(scope.row, scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="set_name"></el-table-column>
                <el-table-column label="交货日期" prop="delivery_date"></el-table-column>
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <el-table-column label="是否提交仓库" prop="has_init">
                    <template slot-scope="scope">
                        <div v-if="scope.row.has_init" style="width: 10px;height: 10px;background: #ED6470;border-radius: 10px;"></div>
                        <div v-if="!scope.row.has_init" style="width: 10px;height: 10px;background: #6AC82F;border-radius: 10px;"></div>
                    </template>
                </el-table-column>
                <!--<el-table-column label="包含业务单">-->
                <!--<template slot-scope="scope">-->

                <!--<span style="cursor: pointer;text-decoration: underline" @click="dialog_sales_order_visible = true;current=scope.row">{{scope.row.sales_order_nos}}</span>-->
                <!--</template>-->
                <!--</el-table-column>-->

                <!--<el-table-column label="制单时间" prop="order_date"></el-table-column>-->
                <!--<el-table-column label="进度">-->
                <!--<template slot-scope="scope">-->

                <!--<el-tag v-if="scope.row.status == 1 && scope.row.process_state_id == 0 && scope.row.process_state_next_id == 0" type="warning">待提交仓库</el-tag>-->
                <!--<el-tag v-if="scope.row.status == 2 && scope.row.process_state_id == 0" >待仓库确认</el-tag>-->
                <!--<el-tag v-if="scope.row.status == 3" type="success" >已完成</el-tag>-->
                <!--<el-tag v-if="scope.row.status == 1 && scope.row.process_state_next_id > 0" >{{scope.row.process_state}}</el-tag>-->

                <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="操作" width="300">-->
                <!--<template slot-scope="scope">-->
                <!--<el-button v-if="scope.row.status==1 && scope.row.process_state_id == 0 && scope.row.process_state_next_id == 0" size="mini" type="success" @click="submit_storage(scope.row)">提交仓库</el-button>-->
                <!--<el-button v-if="scope.row.status == 1 && scope.row.process_state_next_id > 0" size="mini" type="success" @click="print_barcode(scope.row)">打印条形码({{scope.row.print_count}})</el-button>-->

                <!--<el-button v-if="scope.row.status==1 && scope.row.process_state_id == 0 && scope.row.process_state_next_id == 0" size="mini" @click="goto_edit_produce_order(scope.row.id)">编辑</el-button>-->
                <!--<el-button v-if="scope.row.status==1 && scope.row.process_state_id == 0 && scope.row.process_state_next_id == 0" size="mini" @click="del(scope.row, scope.$index)">删除</el-button>-->
                <!--</template>-->
                <!--</el-table-column>-->
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

        <el-dialog title="包含业务单" :visible.sync="dialog_sales_order_visible" width="30%">
            <el-table
                    :data="current.sales_sub_orders"
                    style="width: 100%">

                <el-table-column label="客户单号" prop="order_code"></el-table-column>
                <el-table-column label="客户款式" prop="custom_model"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog_sales_order_visible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="导出" :visible.sync="dialogFormVisibleDaochu" width="30%">
            <p>
                您即将导出订单数据,条件为:[生产单名称:{{set_name?set_name:'无限制'}}][制单时间:{{dateTime_create?dateTime_create[0]:'无限制'}}-{{dateTime_create?dateTime_create[1]:'无限制'}}][交货时间:{{dateTime?dateTime[0]:'无限制'}}-{{dateTime?dateTime[1]:'无限制'}}]。
            </p>
            <p>
                特别说明:如果报名数据比较多,则导出速度会相应的慢一些哦~
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDaochu = false">取 消</el-button>
                <el-button type="primary" @click="daochu" :loading="loadingBtn == 'daochu'">开始导出</el-button>
            </div>
        </el-dialog>

        <div style="display: none">
            <div id="print" width="90%">
                <img :src="barcode_url" style='width: 90%;margin: 10px auto;display: block'/>
                <div style="width: 90%;text-align: center;margin: 0 auto">{{print_order_no}}</div>
                <p style="width: 90%;text-align: center;margin: 0 auto">{{order_info}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from "../components/headTop";
    import {
            produce_order_list,
            produce_order_del,
            produce_order_verify,
            produce_order_sort,
            submit_storage,
            gen_barcode_html
    } from "@/api/getDataproduce_order";
    import { getStore } from "@/config/mUtils";
    import "@/assets/js/jquery-1.4.4.min";
    import "@/assets/js/jquery.jqprint-0.3";
    export default {
        data() {
            return {
                tableData: [],
                limit: 20,
                count: 0,
                currentPage: 1,
                dialogFormVisible: false,
                dialogFormVisibleDaochu: false,
                dialog_sales_order_visible: false,

                current: {},
                //                remark:'',
                //                choose_categories:[],
                //                categories:[],
                order_no: "",
                set_name: "",
                loadingBtn: -1,
                print_order_no: "",
                barcode_url: "",
                order_info: "",
                order_by:[{key:'',value:''}],
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
            };
        },
        components: {
            headTop
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
                produce_order_list({
                    list_type: 1,
                    page: this.currentPage,
                    page_size: this.limit,
                    order_no: this.order_no,
                    set_name: this.set_name,
                    start_time: this.dateTime ? this.dateTime[0]:'',
                    end_time: this.dateTime ? this.dateTime[1]:'',
                    start_time_create: this.dateTime_create ? this.dateTime_create[0]:'',
                    end_time_create: this.dateTime_create ? this.dateTime_create[1]:'',
                    order_by:this.order_by
                }).then(
                        function(res) {
                            if (res.code == this.$store.state.constant.status_success) {
                                this.tableData = res.data.list;
                                this.count = parseInt(res.data.count);
                            }
                        }.bind(this)
                );
            },
            submit_storage(row) {
                this.$confirm("确认此操作?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(
                        function() {
                            submit_storage({ produce_order_id: row.id }).then(
                                    function(res) {
                                        if (res.code == this.$store.state.constant.status_success) {
                                            row.status = 2;
                                            this.$message({
                                                type: "success",
                                                message: res.msg
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
            goto_edit_produce_order(id) {
                if (id) {
                    this.$router.push({
                        path: "add_produce_order",
                        query: { id: id, active: 1, way: 1 }
                    });
                } else {
                    this.$router.push({
                        path: "add_produce_order",
                        query: { id: id, is_new: 1 }
                    });
                }
            },
            verify(scope, status) {
                this.$confirm("确认此操作?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(
                        function() {
                            var item = scope.row;
                            this.loadingBtn = scope.$index;
                            produce_order_verify({ id: item.id, status: status })
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
                            produce_order_del({ id: item.id }).then(
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
                produce_order_sort({
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
            print_barcode(row) {
                this.print_order_no = row.order_no;
                this.order_info =
                        row.product_cat_name +
                        "-" +
                        row.product_code +
                        "-" +
                        row.color_code +
                        " " +
                        "数量" +
                        row.sum;
                gen_barcode_html({
                    code: row.order_no,
                    id: row.id
                }).then(
                        function(res) {
                            if (res.code == this.$store.state.constant.status_success) {
                                this.barcode_url = res.data;
                                setTimeout(function() {
                                    $("#print").jqprint();
                                    row.print_count++;
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
            },
            daochu() {
                window.open(
                        this.$store.state.constant.produce_order_excel_out +
                        "?client_from=1&set_name=" + this.set_name +
                        '&start_time='+(this.dateTime?this.dateTime[0]:'')+
                        '&end_time='+(this.dateTime?this.dateTime[1]:'')+
                        '&start_time_create='+(this.dateTime_create?this.dateTime_create[0]:'')+
                        '&end_time_create='+(this.dateTime_create?this.dateTime_create[1]:'')+
                                '&list_type=1'+
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
