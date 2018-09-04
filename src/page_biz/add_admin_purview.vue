<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">类型:</span>
                <el-select @change="get_all_list" v-model="type" placeholder="类型">
                    <el-option
                            v-for="item in types"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">父类:</span>
                <el-select v-model="pid" placeholder="类型">
                    <el-option
                            v-for="item in parents"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>


            <div v-if="type==1" class="search_item">
                <el-input clearable placeholder="请输入菜单名称" v-model="name" style="width: 350px">
                    <template slot="prepend">菜单名称</template>
                </el-input>
            </div>

            <div v-if="type!=1" class="search_item">
                <el-input clearable placeholder="请输入名称" v-model="name" style="width: 350px">
                    <template slot="prepend">名称</template>
                </el-input>
            </div>

            <div class="search_item">
                <el-input clearable placeholder="请输入权限资源" v-model="uri" style="width: 350px">
                    <template slot="prepend">权限资源</template>
                </el-input>
            </div>

            <div v-if="type==1" class="search_item">
                <el-input clearable placeholder="请输入图标代码" v-model="ico" style="width: 350px">
                    <template slot="prepend">图标</template>
                </el-input>
            </div>

            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {admin_purview_edit,admin_purview_info,admin_purview_all_list} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                id:0,
                action:'',
                loading:false,
                type:0,
                pid:'0',
                name:'',
                uri:'',
                ico:'',
                types:[
                    {id:0,name:'普通权限'},
                    {id:1,name:'菜单权限'}
                ],
                parents:[{id:'0',name:'顶级'}],
            }

        },
        components: {
            headTop
        },
        created(){

        },
        mounted(){

        },

        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;
                vm.action = to.query.action ? to.query.action : '';
//                console.log(vm.id )
                if (vm.id && vm.id > 0) {
                    vm.get_info().then(vm.get_all_list);
                } else {
                    vm.init();
                    vm.get_all_list();
                }

            })
        },
        methods: {

            init() {
                this.loading = false;
                this.name = '';
                this.type=0;
                this.pid = '0';
                this.uri = '';
                this.ico = '';
            },
            get_all_list(){
                admin_purview_all_list({type:this.type}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.parents = res.data
                        this.parents.unshift({id:'0',name:'顶级'});
                    }
                }.bind(this));
            },
            get_info() {

                return admin_purview_info({id:this.id}).then(function (res) {
                    return new Promise(function(resolve,reject){

                        if (res.code == this.$store.state.constant.status_success) {
                            if (this.action == 'modify') {
                                this.pid = res.data.pid
                                this.type = parseInt(res.data.type);
                                this.uri = res.data.uri;
                                this.name = res.data.name;
                                this.ico = res.data.ico;
                            } else if(this.action == 'add') {
                                this.pid = res.data.id
                                this.type=parseInt(res.data.type);
                                this.uri = '';
                                this.name = '';
                                this.ico = '';
                            }
                            resolve(res);
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                            reject();
                        }

                    }.bind(this));
                }.bind(this));
            },
            submit: function () {

                if (!this.name && !this.menu_name) {
                    var error_msg = '请填写名称';
                }

                if (!this.uri) {
                    var error_msg = '请填写权限资源';
                }

                if (error_msg) {
                    this.$message({
                        type: 'warning',
                        message: error_msg
                    });
                    return;
                }

                this.$confirm('确认无误, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    this.loading = true;
                    if (this.action == 'add') {
                        this.id = '';
                    }
                    admin_purview_edit({id:this.id,name:this.name,pid:this.pid,type:this.type,uri:this.uri,ico:this.ico}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'admin_purview',query:{}});
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }

                    }.bind(this));

                }.bind(this)).catch(() => {

                }).finally(function(){
                    this.loading = false;
                }.bind(this));

            }

        }
    }
</script>

<style scoped lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }

</style>
