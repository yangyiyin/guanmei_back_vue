<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="名称"
                    v-model="name"
                    clearable>
            </el-input>

            <el-select v-model="type" placeholder="类型">
                <el-option
                        v-for="item in types"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>

            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit_admin_purview(0)">新增顶级权限</el-button>

        </div>
        <div class="table_container">
            <!--<el-table-->
                    <!--:data="tableData"-->
                    <!--style="width: 100%">-->
                <!--<el-table-column label="名称" prop="name"></el-table-column>-->
                <!--<el-table-column label="是否菜单">-->
                    <!--<template slot-scope="scope">-->
                        <!--<span v-if="scope.row.type == 1">是</span>-->
                        <!--<span v-if="scope.row.type == 0">否</span>-->


                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="创建日期" prop="create_time"></el-table-column>-->
                <!--<el-table-column label="排序">-->
                    <!--<template slot-scope="scope">-->
                        <!--{{scope.row.sort}}-->
                        <!--<el-button size="mini" @click="handleSort(scope.row)">设置</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="操作" width="300">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button size="mini" @click="goto_edit_admin_purview(scope.row.id)">编辑</el-button>-->
                        <!--<el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">禁用</el-button>-->
                        <!--<el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">启用</el-button>-->
                        <!--<el-button size="mini" @click="del(scope.row, scope.$index)">删除</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            <!--</el-table>-->
            <!--<div class="Pagination" style="text-align: left;margin-top: 10px;">-->
                <!--<el-pagination-->
                        <!--@current-change="handleCurrentChange"-->
                        <!--:current-page="currentPage"-->
                        <!--:page-size="limit"-->
                        <!--layout="total, prev, pager, next"-->
                        <!--:total="count"-->
                        <!--background>-->
                <!--</el-pagination>-->
            <!--</div>-->

            <el-tree
                    :data="tree_data"
                    :show-checkbox="show_checkbox"
                    node-key="id"
                    default-expand-all
                    @node-drop="handleDrop"
                    draggable
                    :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}    <el-tag v-if="data.type==1" size="mini">菜单</el-tag></span>

                    <span>

                        <i class="iconfont" @click="goto_edit_admin_purview(data.id, 'modify')">&#xe604;</i>
                        &nbsp;
                        <i class="iconfont" @click="goto_edit_admin_purview(data.id, 'add')">&#xe6b7;</i>
                          &nbsp;
                        <i class="iconfont" @click="del(node, data)">&#xe600;</i>
                    </span>
                  </span>
            </el-tree>

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
    import {admin_purview_tree,admin_purview_del,admin_purview_verify,admin_purview_sort} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                tree_data:[],
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                current:{},
                name:'',
                loadingBtn:-1,
                type:-1,
                types:[
                    {id:-1,name:'全部'},
                    {id:0,name:'普通权限'},
                    {id:1,name:'菜单权限'}
                ],
                show_checkbox:false

            }
        },
        components: {
            headTop,
        },
        created(){

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
                admin_purview_tree({page:this.currentPage,page_size:this.limit,name:this.name, type:this.type}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tree_data = res.data;
                    }
                }.bind(this));

            },
            search() {
                this.currentPage = 1;
                this.list();
            },
            goto_edit_admin_purview(id, action) {
                this.$router.push({path:'add_admin_purview',query:{id:id,action:action}});
            },
            verify(scope, status) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    admin_purview_verify({id:item.id,status:status}).then(function(res){
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
            del(node, item) {

                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    admin_purview_del({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {

                            const parent = node.parent;
                            const children = parent.data.children || parent.data;
                            const index = children.findIndex(d => d.id === item.id);
                            children.splice(index, 1);

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
            sort() {
                admin_purview_sort({
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
            handleDrop(node, pnode, position, event){
                console.log(node)
                console.log(pnode)
                console.log(position)
                console.log(event)
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
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
