<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">名称:</span>
                <el-input clearable placeholder="请输入名称" v-model="name" style="width: 350px">
                </el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">所属部门:</span>
                <el-select v-model="orgnize_ids" multiple placeholder="请选择">
                    <el-option
                            v-for="item in orgnizes"
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
    import {process_edit,process_info} from '@/api/getDataprocess'
    import {admin_orgnize_all_list} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                orgnize_ids:[],
                orgnizes:[],
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
                vm.get_info();
            } else {
                vm.init();
            }

            vm.get_all_orgnize_list();
        })
        },
        methods: {

            init() {
                this.loading = false;
                this.name = '';
                this.orgnize_ids = [];
            },
            get_info() {
                process_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.name = res.data.name;
                        this.orgnize_ids = res.data.orgnize_ids;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            get_all_orgnize_list(){

                return admin_orgnize_all_list().then(function(res){
                    return new Promise(function(resolve,reject){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.orgnizes = res.data

                        }
                        resolve();
                    }.bind(this));

                }.bind(this));
            },
            submit: function () {

                if (!this.name) {
                    var error_msg = '请填写名称';
                }

                if (!this.orgnize_ids.length) {
                    var error_msg = '请选择部门';
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
                    process_edit({id:this.id,name:this.name,orgnize_ids:this.orgnize_ids}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'process',query:{}});
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
    .pre_info{
        display:inline-block;
        width: 120px;
    }
</style>
