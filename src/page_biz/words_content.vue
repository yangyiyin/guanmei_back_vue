<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="内容"
                    v-model="content"
                    clearable>
            </el-input>
            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="学生姓名"
                    v-model="student_name"
                    clearable>
            </el-input>
            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="评论老师"
                    v-model="auth"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

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
                            <el-form-item label="内容" >
                                <span>{{ props.row.content}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column label="学生姓名" prop="student_name"></el-table-column>
                <el-table-column label="学生学号" prop="studentid"></el-table-column>
                <el-table-column label="内容" prop="content_pre">

                </el-table-column>
                <el-table-column label="评论老师" prop="auth"></el-table-column>
                <el-table-column label="时间" prop="create_time"></el-table-column>
                <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button size="mini" @click="show_edit(scope.row)">编辑</el-button>

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
        <el-dialog title="编辑内容" :visible.sync="dialogFormVisible" width="30%">
            <span class="pre_info" style="font-size: 14px;vertical-align: top">评语内容:</span>
            <el-input  placeholder="内容..." v-model="current.content" type="textarea" :rows="2" >

            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="edit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {words_content_list,words_content_edit} from '@/api/getDataEarth'
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
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                content:'',
                student_name:'',
                auth:'',
                loadingBtn:-1
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
            list() {
                words_content_list({id:this.id,page:this.currentPage,page_size:this.limit,content:this.content,student_name:this.student_name,auth:this.auth}).then(function(res){
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
            show_edit(row){

                this.dialogFormVisible = true;
                this.current= row;

            },
            edit(){
                words_content_edit({
                    id:this.current.id,
                    content:this.current.content
                }).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.list();

                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                    this.dialogFormVisible = false;
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
