<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">
            <el-select v-model="choose_categories" multiple placeholder="请选择分类">
                <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :label="item.display_name"
                        :value="item.id">
                </el-option>
            </el-select>

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="主体名称"
                    v-model="title"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="一级分类" >
                                <span>{{ props.row.first_cat_name }}</span>
                            </el-form-item>
                            <el-form-item label="二级分类" >
                                <span>{{ props.row.second_cat_name }}</span>
                            </el-form-item>
                            <el-form-item label="描述" >
                                <span>{{ props.row.desc }}</span>
                            </el-form-item>
                            <el-form-item label="备注" >
                                <span>{{ props.row.remark }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="主体名称" prop="title"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="手机" prop="mobile"></el-table-column>
                <el-table-column label="地址" prop="address"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="current_entity">
                <el-form-item label="手机号">
                    <el-input v-model="current_entity.mobile" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="企业描述"  >
                    <el-input type="textarea" :rows="2" v-model="current_entity.desc" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input type="textarea" :rows="2" v-model="current_entity.remark" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="modify_info">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {cixi_list,entity_cixi_edit,entity_categories} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                current_entity:{},
                remark:'',
                choose_categories:[],
                categories:[],
                title:''
            }
        },
        components: {
            headTop,
        },
        created(){
            this.entity_categories();
            this.cixi_list();
        },
        mounted(){

        },
        methods: {
            entity_categories() {
                entity_categories().then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.categories = res.data.list;
                    }
                }.bind(this));
            },
            cixi_list() {
                cixi_list({page:this.currentPage,page_size:this.limit,cate_ids:this.choose_categories,title:this.title}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tableData = res.data.list;
                        this.count = parseInt(res.data.count);
                    }
                }.bind(this));

            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.cixi_list();
            },
            handleEdit(index,row){
                this.dialogFormVisible = true;
                this.current_entity = row;
            },
            modify_info() {
                entity_cixi_edit({
                    id:this.current_entity.id,
                    mobile:this.current_entity.mobile,
                    desc:this.current_entity.desc,
                    remark:this.current_entity.remark,

                }).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.dialogFormVisible = false;
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));
                this.dialogFormVisible = false;
            },
            search() {
                this.currentPage = 1;
                this.cixi_list();
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
