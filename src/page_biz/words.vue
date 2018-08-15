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
            <el-button style="float: right" type="primary" @click="goto_edit(0)">新增评论期</el-button>
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
                            <el-form-item label="标题" >
                                <span>{{ props.row.title}}</span>
                            </el-form-item>
                            <el-form-item label="描述" >
                                <span>{{ props.row.desc}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column label="标题" prop="title"></el-table-column>
                <el-table-column label="简介" prop="desc_pre"></el-table-column>
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
                <el-table-column label="评语" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleDaoru(scope.row)">导入</el-button>
                        <el-button size="mini" @click="handleDaochu(scope.row)">导出</el-button>
                        <el-button size="mini"  type="primary" @click="goto_words_content(scope.row.id)">查看</el-button>

                    </template>
                </el-table-column>

                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="goto_edit(scope.row.id)">编辑</el-button>
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
        <el-dialog title="导入" :visible.sync="dialogFormVisibleDaoru" width="30%">
            <p>
                您即将导入教师评语数据:【{{current.title}}】。
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
                    <el-button type="primary" :loading="loadingBtn == 'daoru'">开始导入</el-button>
                </el-upload>
            </div>
        </el-dialog>


        <el-dialog title="导出" :visible.sync="dialogFormVisibleDaochu" width="30%">
            <p>
                您即将导出教师评语数据:【{{current.title}}】。
            </p>
            <p>
                特别说明:如果报名数据比较多,则导出速度会相应的慢一些哦~
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDaochu = false">取 消</el-button>
                <el-button type="primary" @click="daochu" :loading="loadingBtn == 'daochu'">开始导出</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {words_list,words_del, words_content_excel_out} from '@/api/getDataEarth'
    import {getStore} from '@/config/mUtils'
    export default {
        data(){
            return {
                id:0,
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,

                dialogFormVisible:false,
                dialogFormVisibleDaoru:false,
                dialogFormVisibleDaochu:false,

                current:{},

                title:'',
                loadingBtn:-1,
                upload_url:this.$store.state.constant.words_content_daoru_excel_in,
                upload_data:{token:getStore('token') ? getStore('token') : ''}
            }
        },
        components: {
            headTop,
        },
        created(){
            //this.list();
        },
        mounted(){

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;
            vm.list();
        })
        },
        methods: {
            handleSuccess(res, file) {
                this.loadingBtn = '-1';
                if (this.upload_loading) {
                    this.upload_loading.close();
                }

                if (res.code == this.$store.state.constant.status_success) {
                    this.dialogFormVisibleDaoru = false;
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

            },
            beforeUpload(file) {
                this.loadingBtn = 'daoru';
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
            list() {
                words_list({id:this.id,page:this.currentPage,page_size:this.limit,title:this.title}).then(function(res){
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
            search() {
                this.currentPage = 1;
                this.list();
            },
            goto_edit(id) {
                this.$router.push({path:'words_edit',query:{id:id}});
            },
            del(item, index) {

                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    words_del({id:item.id}).then(function(res){
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
            goto_words_content(id) {
                this.$router.push({path:'words_content',query:{id:id}});
            },
            handleDaoru(row){
                this.dialogFormVisibleDaoru = true;
                this.current = row;
            },
            handleDaochu(row){
                this.dialogFormVisibleDaochu = true;
                this.current = row;
            },
            daochu() {
                this.loadingBtn = 'daochu';
                words_content_excel_out({
                    id:this.current.id,
                    is_ajax:true
                }).then(function(res){
                    this.loadingBtn = '-1';
                    if (res.code == this.$store.state.constant.status_success) {
                        window.open(this.$store.state.constant.words_content_daochu_excel_out + '?id='+this.current.id+'&token=' + (getStore('token') ? getStore('token') : ''));
                        return;
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                    this.dialogFormVisibleDaochu = false;
                }.bind(this));
            },
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
