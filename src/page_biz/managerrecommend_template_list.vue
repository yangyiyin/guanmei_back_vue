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
                    placeholder="标题"
                    v-model="title"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

        </div>
        <div class="table_container">

            <el-table
                    :data="tableData"
                    style="width: 100%">

                <el-table-column label="标题" prop="title"></el-table-column>
                <el-table-column label="封面">
                    <template scope="scope">
                        <img :src="scope.row.img" width="40" height="40"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="goto_edit(scope.row.id)">编辑</el-button>
                        <el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope.row, 0)">下架</el-button>
                        <el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope.row, 1)">上架</el-button>
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
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {managerrecommend_tmp_list,managerrecommend_tmp_verify,managerrecommend_tmp_del} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                remark:'',
                choose_categories:[],
                categories:[{id:1,name:'限时抢购'},{id:2,name:'砍价'},{id:3,name:'集赞'},{id:4,name:'投票'},{id:5,name:'图文'}],
                title:''
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
                managerrecommend_tmp_list({page:this.currentPage,page_size:this.limit,cate_ids:this.choose_categories,title:this.title}).then(function(res){
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
            goto_edit(id){
//                this.$router.push('managerrecommend_template?id='+id);
                this.$router.push({path:'managerrecommend_template',query:{id:id}});
            },
            search() {
                this.currentPage = 1;
                this.list();
            },
            verify(item, status) {
                managerrecommend_tmp_verify({id:item.id,status:status}).then(function(res){
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
                }.bind(this));
            },
            del(item, index) {

                this.$confirm('此操作将永久删除该条模板数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    managerrecommend_tmp_del({id:item.id}).then(function(res){
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
