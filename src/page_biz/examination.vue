<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="标题"
                    v-model="title"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit(0)">新增考试</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <!--<el-table-column label="图片">-->
                    <!--<template slot-scope="scope">-->
                        <!--<img :src="scope.row.img" width="60" height="30"/>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="考试时间" >
                                <span>{{ props.row.examination_time }}</span>
                            </el-form-item>
                            <el-form-item label="报名截止" >
                                <span>{{ props.row.sign_end_time }}</span>
                            </el-form-item>
                            <el-form-item label="内容描述" >
                                <span>{{ props.row.content }}</span>
                            </el-form-item>

                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="标题" prop="title"></el-table-column>
                <el-table-column label="报名类型" prop="type"></el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        {{scope.row.sort}}
                        <el-button size="mini" @click="handleSort(scope.row)">设置</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleDaoru(scope.row)">导入</el-button>
                        <el-button size="mini" @click="handleDaochu(scope.row)">导出</el-button>
                        <el-button size="mini"  type="primary" @click="goto_sign_list(scope.row.id)">查看</el-button>
                        <br/>
                        <br/>
                        <el-button size="mini" @click="goto_edit(scope.row.id)">编辑</el-button>
                        <el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>
                        <el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">上架</el-button>
                        <el-button size="mini"   @click="del(scope.row, scope.$index)">删除</el-button>
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

        <el-dialog title="导入" :visible.sync="dialogFormVisibleDaoru" width="30%">
            <p>
                您即将导入考试数据:{{current.title}}。
            </p>
            <p>
                特别说明:导入的excel数据将全部替代现有的后台数据,请确保导入数据正常且完整!
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDaoru = false">取 消</el-button>
                <!--<el-button type="primary" @click="daoru">开始导入</el-button>-->
                <el-upload

                        class=""
                        :action="upload_url+'?id='+current.id"
                        :data="upload_data"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        :before-upload="beforeUpload"
                        style="display: inline-block;">
                    <!--<img v-if="img" :src="img" class="avatar">-->
                    <el-button type="primary">开始导入</el-button>
                </el-upload>
            </div>
        </el-dialog>


        <el-dialog title="导出" :visible.sync="dialogFormVisibleDaochu" width="30%">
            <p>
                您即将导出考试数据:{{current.title}}。
            </p>
            <p>
                特别说明:如果报名数据比较多,则导出速度会相应的慢一些哦~
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDaochu = false">取 消</el-button>
                <el-button type="primary" @click="daochu">开始导出</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {examination_list,examination_del,examination_verify,examination_sort,examination_excel_out} from '@/api/getDataEarth'
    import {getStore} from '@/config/mUtils'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                dialogFormVisibleDaoru:false,
                dialogFormVisibleDaochu:false,
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                title:'',
                loadingBtn:-1,
                upload_url:this.$store.state.constant.examination_daoru_excel_url,
                upload_data:{token:getStore('token') ? getStore('token') : ''}
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
            handleSuccess(res, file) {
                if (this.upload_loading) {
                    this.upload_loading.close();
                }

                if (res.code == this.$store.state.constant.status_success) {
                    this.dialogFormVisibleDaoru = false;
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

            },
            beforeUpload(file) {
                var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
                const extension = testmsg === 'xls'
                const extension2 = testmsg === 'xlsx'
                const isLt2M = file.size / 1024 / 1024 < 100
                if(!extension && !extension2) {
                    this.$message({
                        message: '上传文件只能是 xls、xlsx格式!',
                        type: 'warning'
                    });
                }
                if(!isLt2M) {
                    this.$message({
                        message: '上传文件大小不能超过 100MB!',
                        type: 'warning'
                    });
                }
                this.upload_loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                return extension || extension2 && isLt2M;
            },
            onEditorChange({ editor, html, text }) {//富文本编辑器  文本改变时 设置字段值
                this.content = html
            },
            list() {
                examination_list({page:this.currentPage,page_size:this.limit,title:this.title}).then(function(res){
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
            goto_edit(id) {
                this.$router.push({path:'examination_edit',query:{id:id}});
            },
            goto_sign_list(id){
                this.$router.push({path:'examination_signs',query:{id:id}});
            },
            verify(scope, status) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    examination_verify({id:item.id,status:status}).then(function(res){
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
                    examination_del({id:item.id}).then(function(res){
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
            handleDaoru(row){
                this.dialogFormVisibleDaoru = true;
                this.current = row;
            },
            handleDaochu(row){
                this.dialogFormVisibleDaochu = true;
                this.current = row;
            },

            sort() {
                examination_sort({
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
            },
            daochu() {
                examination_excel_out({
                    id:this.current.id,
                    is_ajax:true
                }).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        window.location.href=this.$store.state.constant.examination_daoru_excel_out + '?id='+this.current.id+'&token=' + (getStore('token') ? getStore('token') : '');
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                    this.dialogFormVisibleDaochu = false;
                }.bind(this));
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
