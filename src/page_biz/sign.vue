<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="学生姓名"
                    v-model="student_name"
                    clearable>
            </el-input>
            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="家长手机号"
                    v-model="parent_tel"
                    clearable>
            </el-input>
            <el-select v-model="area" multiple placeholder="请选择校区">
                <el-option
                        v-for="item in areas"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>

            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit_sign(0)">设置报名简章</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="性别" >
                                <span>{{ props.row.content.sex }}</span>
                            </el-form-item>
                            <el-form-item label="生日" >
                                <span>{{ props.row.content.birthday }}</span>
                            </el-form-item>
                            <el-form-item label="学校" >
                                <span>{{ props.row.content.school }}</span>
                            </el-form-item>
                            <el-form-item label="班级" >
                                <span>{{ props.row.content.class }}</span>
                            </el-form-item>
                            <el-form-item label="培训课程" >
                                <span>{{ props.row.content.level }}-{{ props.row.content.subject }}-{{ props.row.content.how}}</span>
                            </el-form-item>
                            <el-form-item label="家长微信" >
                                <span>{{ props.row.content.wechat }}</span>
                            </el-form-item>
                            <el-form-item label="家庭住址" >
                                <span>{{ props.row.content.address }}</span>
                            </el-form-item>
                            <el-form-item label="备注" >
                                <span>{{ props.row.content.remark }}</span>
                            </el-form-item>

                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column label="学生姓名" prop="student_name"></el-table-column>
                <el-table-column label="家长手机号" prop="parent_tel"></el-table-column>
                <el-table-column label="选择校区" prop="area"></el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <!--<el-button size="mini" @click="goto_edit_news(scope.row.id)">编辑</el-button>-->
                        <!--<el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>-->
                        <!--<el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">上架</el-button>-->
                        <el-button size="mini" @click="del(scope.row, scope.$index)">删除</el-button>
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
        <!--<el-dialog title="修改排序" :visible.sync="dialogFormVisible" width="30%">-->
            <!--<el-form :model="current">-->
                <!--<el-form-item label="排序值(越大越靠前)">-->
                    <!--<el-input v-model="current.sort" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="sort">确 定</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {sign_signs_list,sign_signs_del,sign_signs_areas} from '@/api/getDataEarth'
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
                area:[],
                areas:[],
                student_name:'',
                parent_tel:'',
                out_id:1,
                loadingBtn:-1
            }
        },
        components: {
            headTop,
        },
        created(){
            this.get_areas();
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
            get_areas() {
                sign_signs_areas({}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.areas = res.data;
                    }
                }.bind(this));
            },
            list() {
                sign_signs_list({page:this.currentPage,page_size:this.limit,title:this.title, out_id:this.out_id,student_name:this.student_name,area:this.area,parent_tel:this.parent_tel}).then(function(res){
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
//            handleEdit(row){
//                this.dialogFormVisible = true;
//                if (row) {
//                    this.current_entity = row;
//                } else {
//                    this.current_entity = {};
//                }
//
//            },
            search() {
                this.currentPage = 1;
                this.list();
            },
            goto_edit_sign(id) {
                this.$router.push({path:'sign_edit',query:{id:id}});
            },
//            verify(scope, status) {
//
//                this.$confirm('确认此操作?', '提示', {
//                    confirmButtonText: '确定',
//                    cancelButtonText: '取消',
//                    type: 'warning'
//                }).then(function(){
//                    var item = scope.row;
//                    this.loadingBtn = scope.$index;
//                    news_verify({id:item.id,status:status}).then(function(res){
//                        if (res.code == this.$store.state.constant.status_success) {
//                            item.status = status;
//                            this.$message({
//                                type: 'success',
//                                message: '操作成功'
//                            });
//                        } else {
//                            this.$message({
//                                type: 'warning',
//                                message: res.msg
//                            });
//                        }
//                    }.bind(this)).finally(function(){
//                        this.loadingBtn = -1;
//                    }.bind(this));
//                }.bind(this));
//
//
//
//            },
            del(item, index) {

                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    sign_signs_del({id:item.id}).then(function(res){
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
//            handleSort(row){
//                this.dialogFormVisible = true;
//                this.current = row;
//            },
//            sort() {
//                news_sort({
//                    id:this.current.id,
//                    sort:this.current.sort
//
//                }).then(function(res){
//                    if (res.code == this.$store.state.constant.status_success) {
//                        this.dialogFormVisible = false;
//                        this.$message({
//                            type: 'success',
//                            message: '操作成功'
//                        });
//                    } else {
//                        this.$message({
//                            showClose: true,
//                            message: res.msg,
//                            type: 'warning'
//                        });
//                    }
//                }.bind(this));
//                this.dialogFormVisible = false;
//            },
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
