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

        </div>
        <div class="table_container">

            <el-tree

                    :data="tree_data"
                    :show-checkbox="true"
                    node-key="uri_md5"
                    ref="tree"
                    :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}
                    <el-tag v-if="data.type==2" size="mini">app菜单</el-tag>
                    <el-tag v-if="data.type==1" size="mini">菜单</el-tag>
                        <el-tag v-if="data.type==0" size="mini">功能</el-tag>

                    </span>


                  </span>
            </el-tree>

            <el-button style="margin-top: 20px;" type="primary" @click="submit_group_purview()">确定</el-button>
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
    import {admin_purview_tree,admin_group_edit,admin_group_info} from '@/api/getDataEarth'
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
                    {id:0,name:'普通权限'},
                    {id:1,name:'菜单权限'}
                ],
                edit_group_id:''

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
                vm.edit_group_id = to.query.edit_group_id ? to.query.edit_group_id : 0;
                if (vm.edit_group_id) {
                    vm.$refs.tree.setCheckedKeys([]);
                    admin_group_info({id:vm.edit_group_id}).then(function(res){
                        if (res.code == vm.$store.state.constant.status_success) {
                            if (res.data.purviews) {
                                vm.$refs.tree.setCheckedKeys(res.data.purviews.split(','));
                            }

                        }
                    });

                }

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
            submit_group_purview() {
                var purviews_arr = [];

                this.$refs.tree.getCheckedNodes().forEach(function(ele){

                    if (ele.type == 0 && ele.children && ele.children.length) {


                    } else {
                        purviews_arr.push(ele.uri_md5);
                    }

                });

                var purviews = purviews_arr.join(',');
                //var purviews = this.$refs.tree.getCheckedKeys().join(',');
                var purviews_half = this.$refs.tree.getHalfCheckedKeys().join(',');
                admin_group_edit({id:this.edit_group_id,purviews:purviews,purviews_half:purviews_half}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {

                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.$router.go(-1);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.msg
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
