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
                            <el-form-item label="家长手机1" >
                                <span>{{ props.row.content.father_tel }}</span>
                            </el-form-item>
                            <el-form-item label="家长手机2" >
                                <span>{{ props.row.content.mother_tel }}</span>
                            </el-form-item>
                            <el-form-item label="是否新生" >
                                <span>{{ props.row.is_new ? '是':'否' }}</span>
                            </el-form-item>
                            <el-form-item label="结果备注" >
                                <span>{{ props.row.content.remark }}</span>
                            </el-form-item>
                            <el-form-item label="准考证" >
                                <span><img style="width: 200px;" :src="props.row.ticket"/></span>
                            </el-form-item>
                            <el-form-item label="" >
                                <el-button size="mini"  type="warning" @click="handleGenTicket(props.row)">生成准考证</el-button>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="学生姓名" prop="student_name"></el-table-column>
                <el-table-column label="家长手机号" prop="parent_tel"></el-table-column>
                <el-table-column label="来源" prop="from"></el-table-column>
                <!--<el-table-column label="操作" width="300">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button size="mini"  type="warning" @click="handleGenTicket(scope.row)">生成准考证</el-button>-->


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

        <el-dialog title="生成准考证" :visible.sync="dialogFormVisibleTicket" width="30%">
            <p>
                您即将为【{{current.student_name}}】生成准考证图片
            </p>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleTicket = false">取 消</el-button>
                <el-button type="primary" @click="genticket" :loading="loadingBtn == 'ticket'">开始生成</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {examination_signs_list,examination_gen_ticket} from '@/api/getDataEarth'
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
                dialogFormVisibleTicket:false,
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                student_name:'',
                parent_tel:'',
                loadingBtn:-1,
                upload_url:this.$store.state.constant.examination_daoru_excel_url,
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
            list() {
                examination_signs_list({id:this.id,page:this.currentPage,page_size:this.limit,student_name:this.student_name,parent_tel:this.parent_tel}).then(function(res){
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
            handleGenTicket(row){
                this.dialogFormVisibleTicket = true;
                this.current = row;
            },
            genticket(){
                this.loadingBtn = 'ticket';
                examination_gen_ticket({
                    sign_id:this.current.id
                }).then(function(res){
                    this.loadingBtn = '-1';
                    if (res.code == this.$store.state.constant.status_success) {
                        this.dialogFormVisibleTicket = false;
                        this.$message({
                            type: 'success',
                            message: '生成成功'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                    this.dialogFormVisibleTicket = false;
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
