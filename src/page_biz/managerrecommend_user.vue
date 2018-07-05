<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">
            <el-select v-model="choose_categories" multiple placeholder="请选择分类">
                <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="昵称"
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
                    <template slot-scope="props" v-if="props.row.type==2">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="头像" >
                                <img :src="props.row.avatar" width="40" height="40"/>
                            </el-form-item>
                            <el-form-item label="店铺名称" >
                                <span>{{props.row.entity_title}}</span>
                            </el-form-item>
                            <el-form-item label="店铺地址" >
                                <span>{{props.row.address}}</span>
                            </el-form-item>
                            <el-form-item label="店铺联系" >
                                <span>{{props.row.entity_tel}}</span>
                            </el-form-item>
                            <el-form-item label="会员时期" >
                                <span v-if="!props.row.vip"><el-tag type="info">非会员</el-tag></span>
                                <span v-if="props.row.vip">
                                    <el-tag type="success">{{props.row.vip.start_time}}-{{props.row.vip.end_time}}</el-tag>
                                    <el-button size="mini" @click="set_vip(props)">续期</el-button>
                                </span>
                                <span v-if="props.row.vip && props.row.vip.is_past"><el-tag type="info">已过期</el-tag></span>

                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column label="类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == 1">顾客</span>
                        <span v-if="scope.row.type == 2">店长</span>
                    </template>
                </el-table-column>
                <el-table-column label="昵称" prop="user_name"></el-table-column>
                <el-table-column label="注册时间" prop="create_time"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--<el-button size="mini" @click="goto_edit(scope.row.id)">编辑</el-button>-->
                        <el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">冻结</el-button>
                        <el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">解冻</el-button>
                        <!--<el-button size="mini" @click="del(scope.row, scope.$index)">删除</el-button>-->
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

            <el-dialog title="续期" :visible.sync="dialogFormVisible" width="30%">
                <el-form >
                    <el-form-item label="续费时期(月)">
                        <el-input v-model="vip_extend_month" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="vip_extend">确 定</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {managerrecommend_user_list,managerrecommend_user_verify,managerrecommend_user_del,managerrecommend_vip_extend} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                remark:'',
                choose_categories:[],
                categories:[{id:2,name:'店长'},{id:1,name:'顾客'}],
                title:'',
                loadingBtn:-1,
                vip_extend_month:1,
                vip_extend_prop:0,
                dialogFormVisible:false
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
                managerrecommend_user_list({page:this.currentPage,page_size:this.limit,cate_ids:this.choose_categories,title:this.title}).then(function(res){
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
            set_vip(prop){
                this.dialogFormVisible = true;
                this.vip_extend_prop = prop;
            },
            vip_extend(){
                managerrecommend_vip_extend({uid:this.vip_extend_prop.row.id,month:this.vip_extend_month}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.$message({
                            showClose: true,
                            message: '操作成功',
                            type: 'success'
                        });
                        this.vip_extend_prop.row.vip = res.data;
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
                this.list();
            },
            verify(scope, status) {
                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    managerrecommend_user_verify({id:item.id,status:status}).then(function(res){
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
                    managerrecommend_user_del({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.tableData.splice(index,1);
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
