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
            <el-tree

                    :data="tree_data"
                    :show-checkbox="false"
                    node-key="uri_md5"
                    ref="tree"
                    @node-drop="handleDrop"
                    draggable
                    :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}
                    <el-tag v-if="data.type==1" size="mini">菜单</el-tag>
                        <el-tag v-if="data.type==2" size="mini">app菜单</el-tag>
                    </span>

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
    import {admin_purview_tree,admin_purview_del,admin_purview_verify,admin_purview_sort,admin_purview_edit} from '@/api/getDataEarth'
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
                type:0,
                types:[
                    {id:0,name:'普通权限'},
                    {id:1,name:'菜单权限'},
                    {id:2,name:'app菜单权限'},
                ],


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
                admin_purview_edit(this.current).then(function (res) {
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
