<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <!--<el-input-->
                    <!--style="display: inline-block;width: 250px;"-->
                    <!--placeholder="名称"-->
                    <!--v-model="name"-->
                    <!--clearable>-->
            <!--</el-input>-->

            <!--<el-select v-model="type" placeholder="类型">-->
                <!--<el-option-->
                        <!--v-for="item in types"-->
                        <!--:key="item.id"-->
                        <!--:label="item.name"-->
                        <!--:value="item.id">-->
                <!--</el-option>-->
            <!--</el-select>-->

            <!--<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>-->
            <el-button  type="primary" @click="goto_edit_admin_orgnize(0)">新增部门</el-button>

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
                        <!--<el-button size="mini" @click="goto_edit_admin_orgnize(scope.row.id)">编辑</el-button>-->
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
                    :show-checkbox="false"
                    node-key="uri_md5"
                    ref="tree"
                    default-expand-all
                    @node-drop="handleDrop"
                    draggable
                    :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}   </span>
                    <span>

                        <i class="iconfont" @click="goto_edit_admin_orgnize(data.id, 'modify')">&#xe604;</i>
                        &nbsp;
                        <i class="iconfont" @click="goto_edit_admin_orgnize(data.id, 'add')">&#xe6b7;</i>
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
    import {admin_orgnize_tree,admin_orgnize_del,admin_orgnize_verify,admin_orgnize_sort,admin_orgnize_edit} from '@/api/getDataEarth'
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

                vm.list();

        })
        },
        methods: {
            list() {
                admin_orgnize_tree({page:this.currentPage,page_size:this.limit,name:this.name}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tree_data = res.data;
                    }
                }.bind(this));

            },
            search() {
                this.currentPage = 1;
                this.list();
            },
            goto_edit_admin_orgnize(id, action) {
                this.$router.push({path:'add_admin_orgnize',query:{id:id,action:action}});
            },
            verify(scope, status) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    admin_orgnize_verify({id:item.id,status:status}).then(function(res){
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

                this.$confirm('此操作将永久删除该条数据,并解除该部门的用户关联, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    admin_orgnize_del({id:item.id}).then(function(res){
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
                admin_orgnize_sort({
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


                if (position == 'before') {
                    this.current = node.data;
                    this.current.sort = parseInt(pnode.data.sort) + 1;
                    this.current.pid = pnode.data.pid;
                } else if (position == 'after') {
                    this.current = node.data;
                    this.current.sort = parseInt(pnode.data.sort) - 1;
                    this.current.pid = pnode.data.pid;
                } else if (position == 'inner') {
                    this.current = node.data;
                    var sort = 1;
                    if (pnode.childNodes.length && pnode.childNodes[pnode.childNodes.length-2] && pnode.childNodes[pnode.childNodes.length-2].data) {
                        var sort = pnode.childNodes[pnode.childNodes.length-2].data.sort - 1;
                    }
                    this.current.sort = parseInt(sort);
                    this.current.pid = pnode.data.id;

                }
                admin_orgnize_edit(this.current).then(function (res) {
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

                }.bind(this));

            }
        },
    }
</script>

<style scoped lang="less">
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
