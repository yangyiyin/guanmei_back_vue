<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="编号"
                    v-model="order_no"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit_sales_order(0)">新增业务单</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form style="border: 1px dashed #ddd;margin-top: 5px;padding: 0 5px;"  v-for="(sub_order, index)  in props.row.sales_order_sub" label-position="left" inline class="demo-table-expand">
                            <el-form-item label="帽型:" >
                                <span>{{sub_order.product_cat_name}}-{{sub_order.product_code}}-{{sub_order.color_code}} 数量{{sub_order.sum}}</span>
                                <el-tag size="mini" v-if="sub_order.status == 1" type="warning">待安排生产</el-tag>
                                <el-tag size="mini" v-if="sub_order.status == 2" >已安排生产</el-tag>
                                <el-tag size="mini" v-if="sub_order.status == 3" type="success">已完成</el-tag>
                                <el-tag size="mini" v-if="sub_order.status == 4" type="danger">生成单已删除</el-tag>
                            </el-form-item>

                            <el-form-item label="材质:" >
                                <span v-for="(material, index)  in sub_order.material">{{material.material ? material.material.name : material.name}}[{{material.sub ? material.sub.name : material.color_name}}]数量{{material.num}};</span>
                            </el-form-item>
                            <el-form-item label="装饰说明:" >
                                <span>{{sub_order.decoration}}</span>
                            </el-form-item>
                            <el-form-item label="样品图:" >
                                <img width="80" v-for="(img, index)  in sub_order.sample_imgs" :src="img">
                            </el-form-item>
                            <el-form-item label="样品说明:" >
                                <span>{{sub_order.sample_info}}</span>
                            </el-form-item>

                            <el-form-item label="当前进度:" >
                                <span style="font-weight: bold;color: #000">{{sub_order.process_state ? sub_order.process_state : '暂无'}}</span>
                            </el-form-item>


                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="编号" prop="order_no">
                    <template slot-scope="scope">
                        <span v-if="scope.row.custom_order_no"> {{scope.row.order_no}}({{scope.row.custom_order_no}})</span>
                        <span v-if="!scope.row.custom_order_no"> {{scope.row.order_no}}</span>

                    </template>
                </el-table-column>
                <el-table-column label="制单日期" prop="order_date"></el-table-column>
                <el-table-column label="交货日期" prop="delivery_date"></el-table-column>
                <el-table-column label="业务员" prop="sales_man"></el-table-column>

                <el-table-column label="状态">
                    <template slot-scope="scope">

                        <el-tag v-if="scope.row.status == 1" type="warning">待安排生产</el-tag>
                        <el-tag v-if="scope.row.status == 2" >已安排生产</el-tag>
                        <el-tag v-if="scope.row.status == 3" type="success">已完成</el-tag>
                        <el-tag v-if="scope.row.status == 4" type="danger">生成单已删除</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 1" size="mini" @click="goto_edit_sales_order(scope.row.id)">编辑</el-button>
                        <!--<el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>-->
                        <!--<el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">上架</el-button>-->
                        <el-button v-if="scope.row.status == 1" size="mini" @click="del(scope.row, scope.$index)">删除</el-button>
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
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {sales_order_list,sales_order_del,sales_order_verify,sales_order_sort} from '@/api/getDatasales_order'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                order_no:'',
                loadingBtn:-1
            }
        },
        components: {
            headTop,
        },
        created(){
            this.list();
        },
        mounted(){

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.list();
        })
        },
        methods: {
            list() {
                sales_order_list({page:this.currentPage,page_size:this.limit,name:this.name}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tableData = res.data.list;
                        this.count = parseInt(res.data.count);
                    }
                }.bind(this));

            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.list();
            },
            handleEdit(row){
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
            goto_edit_sales_order(id) {
                this.$router.push({path:'add_sales_order',query:{id:id}});
            },
            verify(scope, status) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    sales_order_verify({id:item.id,status:status}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            item.status = status;
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                    }.bind(this)).finally(function(){
                        this.loadingBtn = -1;
                    }.bind(this));
                }.bind(this));



            },
            del(item, index) {

                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    sales_order_del({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.tableData.splice(index,1);
                            this.count --;
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                    }.bind(this));
                }.bind(this))

            },
            handleSort(row){
                this.dialogFormVisible = true;
                this.current = row;
            },
            sort() {
                sales_order_sort({
                    id:this.current.id,
                    sort:this.current.sort

                }).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.dialogFormVisible = false;
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));
                this.dialogFormVisible = false;
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
