<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <el-input clearable placeholder="请输入账号" v-model="user_name" style="width: 350px">
                    <template slot="prepend">账号</template>
                </el-input>
            </div>
            <div class="search_item">
                <el-input clearable placeholder="请输入密码" v-model="password" style="width: 350px">
                    <template slot="prepend">密码</template>
                </el-input>
            </div>
            <div class="search_item">
                <el-input clearable placeholder="请输入显示名" v-model="show_name" style="width: 350px">
                    <template slot="prepend">显示名</template>
                </el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">所属组织:</span>
                <el-select v-model="group_id" placeholder="类型">
                    <el-option
                            v-for="item in groups"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {admin_user_edit,admin_user_info,admin_group_all_list} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                user_name:'',
                show_name:'',
                password:'',
                group_id:'',
                groups : []
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
//                console.log(vm.id )
            if (vm.id && vm.id > 0) {
                admin_group_all_list().then(function(res){
                    if (res.code == vm.$store.state.constant.status_success) {
                        vm.groups = res.data;
                    }

                });
                vm.get_info();
            } else {
                admin_group_all_list().then(function(res){
                    if (res.code == vm.$store.state.constant.status_success) {
                        vm.groups = res.data;
                        vm.init();
                    }
                });
            }

        })
        },
        methods: {

            init() {
                this.loading = false;
                this.user_name = '';
                this.show_name = '';
                this.password = '';
                this.group_id = this.groups[0].id;
            },
            get_info() {
                admin_user_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.user_name = res.data.user_name;
                        this.show_name = res.data.show_name;
                        this.password = '';
                        this.group_id = res.data.group_id;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {

                if (!this.user_name) {
                    var error_msg = '请填写账号';
                }

                if (!this.password) {
                    var error_msg = '请填写密码';
                }

                if (!this.show_name) {
                    var error_msg = '请填写显示名';
                }

                if (!this.group_id) {
                    var error_msg = '请选择组织';
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
                    admin_user_edit({id:this.id,user_name:this.user_name,password:this.password,show_name:this.show_name,group_id:this.group_id}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'admin_user',query:{}});
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

<style lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }

</style>
