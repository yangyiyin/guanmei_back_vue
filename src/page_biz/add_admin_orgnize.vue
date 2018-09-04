<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

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

            <div class="search_item">
                <el-input clearable placeholder="请输入名称" v-model="name" style="width: 350px">
                    <template slot="prepend">名称</template>
                </el-input>
            </div>


            <!--<div class="search_item">-->
                <!--<el-input clearable placeholder="请输入图标代码" v-model="img" style="width: 350px">-->
                    <!--<template slot="prepend">图标</template>-->
                <!--</el-input>-->
            <!--</div>-->

            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {admin_orgnize_edit,admin_orgnize_info,admin_orgnize_all_list} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                id:0,
                action:'',
                loading:false,
                pid:'0',
                name:'',
                img:'',
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
                    admin_orgnize_all_list().then(function(res){
                        if (res.code == vm.$store.state.constant.status_success) {
                            vm.parents = res.data
                            vm.parents.unshift({id:'0',name:'顶级'});
                        }

                    });
                    vm.get_info();
                } else {
                    admin_orgnize_all_list().then(function(res){
                        if (res.code == vm.$store.state.constant.status_success) {
                            vm.parents = res.data
                            vm.parents.unshift({id:'0',name:'顶级'});
                        }
                    });
                    vm.init();


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
                this.img = '';
            },
            get_info() {
                admin_orgnize_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        if (this.action == 'modify') {
                            this.pid = res.data.pid
                            this.name = res.data.name;
                            this.img = res.data.img;
                        } else if(this.action == 'add') {
                            this.pid = res.data.id
                            this.name = '';
                            this.img = '';
                        }

                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {

                if (!this.name) {
                    var error_msg = '请填写名称';
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
                    admin_orgnize_edit({id:this.id,name:this.name,pid:this.pid,img:this.img}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'admin_orgnize',query:{}});
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
